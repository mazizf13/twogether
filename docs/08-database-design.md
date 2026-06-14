# 08 — Database Design

---

## Overview

This document defines the domain model, entity descriptions, relationships, constraints, and audit strategy for Twogether's data layer. The database is **MySQL**, managed through **Laravel 13 migrations** and **Eloquent ORM**.

All decisions are made with forward-compatibility in mind — the schema should not require destructive migrations to support V1.5 or V2 features.

---

## Design Principles

1. **Soft deletes everywhere** — Nothing is hard-deleted in production. All user-generated data uses `deleted_at`.
2. **Audit trails for financial data** — Every change to a financial record (shared expenses, contributions) is logged.
3. **Couple-scoped isolation** — Every data entity is scoped to a `couple_id`. Queries without couple scope are a security violation.
4. **Currency-ready** — All monetary amounts are stored as integers (cents/minimum currency unit) with a currency_code field, even if single-currency at launch.
5. **Timestamps always** — Every table has `created_at` and `updated_at`.
6. **UUIDs for public-facing IDs** — Prevents ID enumeration attacks. Internal primary keys are auto-increment integers; public IDs exposed in URLs are UUIDs.

---

## Entity Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CORE ENTITIES                            │
│                                                                 │
│  users ──────────────────────────────────────────┐             │
│    │                                             │             │
│    │ belongs to (optional)                       │             │
│    ▼                                             │             │
│  couples ◄── couple_invitations                  │             │
│    │                                             │             │
│    ├──── personal_expenses (owner: user)         │             │
│    ├──── shared_expenses                         │             │
│    │       └── shared_expense_audit_logs         │             │
│    ├──── savings_fund                            │             │
│    │       └── savings_contributions             │             │
│    ├──── savings_goals                           │             │
│    │       └── goal_contributions                │             │
│    ├──── checklist_items                         │             │
│    ├──── settlements                             │             │
│    ├──── activity_logs                           │             │
│    └──── notifications ─────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entity Descriptions

---

### `users`

The core identity table. Represents an individual user account.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Internal PK |
| uuid | CHAR(36) | UNIQUE, NOT NULL | Public-facing ID |
| display_name | VARCHAR(100) | NOT NULL | User's preferred name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| email_verified_at | TIMESTAMP | NULLABLE | Email verification timestamp |
| password | VARCHAR(255) | NOT NULL | Bcrypt hash |
| avatar_url | VARCHAR(500) | NULLABLE | Profile photo URL |
| couple_id | BIGINT UNSIGNED | NULLABLE, FK → couples.id | Active couple reference |
| notification_preferences | JSON | NULLABLE | User-level notification settings |
| remember_token | VARCHAR(100) | NULLABLE | Laravel remember me token |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**Indexes:** `email`, `uuid`, `couple_id`

---

### `couples`

The central organizing entity. All shared data hangs off this table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Internal PK |
| uuid | CHAR(36) | UNIQUE, NOT NULL | Public-facing ID |
| name | VARCHAR(200) | NULLABLE | Optional couple space name |
| partner_a_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Creator/inviter |
| partner_b_id | BIGINT UNSIGNED | NULLABLE, FK → users.id | Invitee (null until accepted) |
| wedding_date | DATE | NULLABLE | Target wedding date |
| currency_code | CHAR(3) | NOT NULL, DEFAULT 'IDR' | ISO 4217 currency code |
| status | ENUM | NOT NULL | active / dissolved / pending |
| dissolved_at | TIMESTAMP | NULLABLE | When couple was dissolved |
| avatar_url | VARCHAR(500) | NULLABLE | Couple photo URL |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**Status Values:**
- `pending` — Invitation sent, partner not yet joined
- `active` — Both partners joined
- `dissolved` — One partner left

**Indexes:** `uuid`, `partner_a_id`, `partner_b_id`, `status`

---

### `couple_invitations`

Tracks invitation tokens for couple linking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK → couples.id | |
| inviter_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Who sent it |
| invited_email | VARCHAR(255) | NOT NULL | Target email |
| token | CHAR(64) | UNIQUE, NOT NULL | Secure random token |
| status | ENUM | NOT NULL | pending / accepted / expired / cancelled |
| expires_at | TIMESTAMP | NOT NULL | Token expiry (72h from creation) |
| accepted_at | TIMESTAMP | NULLABLE | When accepted |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**Indexes:** `token`, `couple_id`, `invited_email`, `status`

---

### `personal_expenses`

Individual expenses logged by a user, scoped to their couple context.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK → couples.id | Couple context |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Owner |
| amount_cents | BIGINT UNSIGNED | NOT NULL | Amount in smallest currency unit |
| currency_code | CHAR(3) | NOT NULL | |
| category | VARCHAR(50) | NOT NULL | Expense category |
| description | VARCHAR(500) | NULLABLE | |
| expense_date | DATE | NOT NULL | |
| is_visible_to_partner | BOOLEAN | NOT NULL, DEFAULT FALSE | Partner visibility |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `couple_id`, `user_id`, `expense_date`, `category`, `is_visible_to_partner`

---

### `shared_expenses`

Expenses shared between both partners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK → couples.id | |
| logged_by_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Who entered it |
| paid_by_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Who actually paid |
| amount_cents | BIGINT UNSIGNED | NOT NULL | |
| currency_code | CHAR(3) | NOT NULL | |
| category | VARCHAR(50) | NOT NULL | |
| description | VARCHAR(500) | NULLABLE | |
| expense_date | DATE | NOT NULL | |
| partner_a_split_pct | DECIMAL(5,2) | NOT NULL, DEFAULT 50.00 | Partner A's % of expense |
| partner_b_split_pct | DECIMAL(5,2) | NOT NULL, DEFAULT 50.00 | Partner B's % of expense |
| settled_by_settlement_id | BIGINT UNSIGNED | NULLABLE, FK → settlements.id | If covered by settlement |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Constraints:** `partner_a_split_pct + partner_b_split_pct = 100.00` (enforced at application layer + DB CHECK constraint if MySQL 8+)

**Indexes:** `couple_id`, `expense_date`, `paid_by_id`, `category`

---

### `shared_expense_audit_logs`

Immutable history of changes to shared expenses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| shared_expense_id | BIGINT UNSIGNED | NOT NULL, FK → shared_expenses.id | |
| changed_by_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | |
| action | ENUM | NOT NULL | created / updated / deleted |
| previous_data | JSON | NULLABLE | Full row before change |
| new_data | JSON | NULLABLE | Full row after change |
| changed_at | TIMESTAMP | NOT NULL | |

**Note:** This table is append-only. No updates or deletes.

---

### `settlements`

Records of balance settlements between partners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | |
| initiated_by_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | |
| amount_cents | BIGINT UNSIGNED | NOT NULL | Amount settled |
| currency_code | CHAR(3) | NOT NULL | |
| payer_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Who transferred money |
| payee_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Who received money |
| settlement_date | DATE | NOT NULL | |
| notes | VARCHAR(500) | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL | |

---

### `savings_fund`

The overall wedding savings fund per couple. One-to-one with couple.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| couple_id | BIGINT UNSIGNED | UNIQUE, NOT NULL, FK | One per couple |
| target_amount_cents | BIGINT UNSIGNED | NULLABLE | Savings target |
| currency_code | CHAR(3) | NOT NULL | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### `savings_contributions`

Individual contributions to the overall savings fund.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Contributor |
| amount_cents | BIGINT UNSIGNED | NOT NULL | |
| currency_code | CHAR(3) | NOT NULL | |
| contribution_date | DATE | NOT NULL | |
| notes | VARCHAR(300) | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Indexes:** `couple_id`, `user_id`, `contribution_date`

---

### `savings_goals`

Named savings goals within a couple's space.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | |
| created_by_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | |
| name | VARCHAR(200) | NOT NULL | Goal name |
| target_amount_cents | BIGINT UNSIGNED | NOT NULL | |
| currency_code | CHAR(3) | NOT NULL | |
| deadline | DATE | NULLABLE | Target completion date |
| description | TEXT | NULLABLE | |
| color | VARCHAR(20) | NULLABLE | CSS color or palette key |
| icon | VARCHAR(50) | NULLABLE | Icon identifier |
| status | ENUM | NOT NULL, DEFAULT 'active' | active / completed / archived |
| completed_at | TIMESTAMP | NULLABLE | When marked complete |
| sort_order | INT UNSIGNED | NOT NULL, DEFAULT 0 | Display ordering |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | |

**Indexes:** `couple_id`, `status`

---

### `goal_contributions`

Contributions to individual savings goals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| savings_goal_id | BIGINT UNSIGNED | NOT NULL, FK | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | (denormalized for query performance) |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Contributor |
| amount_cents | BIGINT UNSIGNED | NOT NULL | |
| currency_code | CHAR(3) | NOT NULL | |
| contribution_date | DATE | NOT NULL | |
| notes | VARCHAR(300) | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | |

**Indexes:** `savings_goal_id`, `couple_id`, `user_id`

---

### `checklist_items`

Wedding preparation tasks, both system-default and custom.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | |
| created_by_id | BIGINT UNSIGNED | NULLABLE, FK → users.id | Null = system default |
| title | VARCHAR(300) | NOT NULL | |
| category | VARCHAR(100) | NOT NULL | |
| description | TEXT | NULLABLE | |
| assigned_to | ENUM | NOT NULL, DEFAULT 'both' | partner_a / partner_b / both |
| due_date | DATE | NULLABLE | |
| status | ENUM | NOT NULL, DEFAULT 'todo' | todo / done |
| completed_by_id | BIGINT UNSIGNED | NULLABLE, FK → users.id | |
| completed_at | TIMESTAMP | NULLABLE | |
| is_system_default | BOOLEAN | NOT NULL, DEFAULT FALSE | Template item flag |
| sort_order | INT UNSIGNED | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULLABLE | |

**Indexes:** `couple_id`, `status`, `assigned_to`, `due_date`, `category`

---

### `activity_logs`

Append-only feed of couple activity. Powers the activity feed.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | |
| actor_id | BIGINT UNSIGNED | NOT NULL, FK → users.id | Who did it |
| action | VARCHAR(100) | NOT NULL | e.g. 'expense.shared.created' |
| subject_type | VARCHAR(100) | NULLABLE | Polymorphic: 'SharedExpense' |
| subject_id | BIGINT UNSIGNED | NULLABLE | Polymorphic: record ID |
| metadata | JSON | NULLABLE | Action-specific data |
| occurred_at | TIMESTAMP | NOT NULL | |

**Indexes:** `couple_id`, `actor_id`, `occurred_at`, composite(`couple_id`, `occurred_at`)

**Note:** This table is append-only. No soft deletes. Retained for 12 months.

---

### `notifications`

User-specific notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| user_id | BIGINT UNSIGNED | NOT NULL, FK | Recipient |
| couple_id | BIGINT UNSIGNED | NOT NULL, FK | |
| type | VARCHAR(100) | NOT NULL | Notification class |
| data | JSON | NOT NULL | Notification content |
| read_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL | |

**Indexes:** `user_id`, `read_at`, composite(`user_id`, `couple_id`)

---

## Relationship Summary

| Entity | Related To | Type | Via |
|--------|-----------|------|-----|
| User | Couple | Many-to-one (max 1 active) | users.couple_id |
| Couple | Users | One-to-two | couples.partner_a_id / partner_b_id |
| Couple | Invitation | One-to-many | couple_invitations.couple_id |
| Couple | SavingsFund | One-to-one | savings_fund.couple_id |
| Couple | PersonalExpenses | One-to-many (per user) | personal_expenses.couple_id |
| Couple | SharedExpenses | One-to-many | shared_expenses.couple_id |
| Couple | SavingsGoals | One-to-many | savings_goals.couple_id |
| Couple | ChecklistItems | One-to-many | checklist_items.couple_id |
| SharedExpense | AuditLogs | One-to-many | shared_expense_audit_logs |
| SavingsGoal | GoalContributions | One-to-many | goal_contributions |

---

## Scalability Considerations

1. **Partitioning readiness:** `activity_logs` and `notifications` will grow large. Design for archival partitioning by `occurred_at` / `created_at` in V2.
2. **JSON columns:** `metadata`, `notification_preferences`, `previous_data` — use JSON for flexibility without premature schema rigidity.
3. **Denormalized couple_id:** Added to `goal_contributions` to avoid expensive JOINs in analytics queries.
4. **Monetary storage:** Integers (cents) prevent floating-point precision errors. All display formatting is done in the application layer.
5. **Future multi-tenancy:** All tables include `couple_id` which serves as the tenant discriminator. This pattern supports efficient database-level isolation in future if required.
6. **Audit log retention:** Activity logs are append-only and expected to be archived/pruned after 12 months in production.

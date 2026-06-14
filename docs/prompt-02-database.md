# Prompt 02 — Database Migrations & Models

## Context
Project is set up per Prompt 01. Now build the complete database schema. Read `08-database-design.md` thoroughly before starting — it contains every table, column, type, and relationship.

## Your Task

Create all Laravel migrations and Eloquent models for the complete Twogether schema.

---

## Migrations (in order — respect foreign key dependencies)

### Migration 01: Modify users table
The default Laravel users migration is already created by Breeze/auth scaffold. Modify it to add:
```
- uuid (char 36, unique)
- display_name (varchar 100, not null)
- avatar_url (varchar 500, nullable)
- couple_id (bigint unsigned, nullable, FK → couples.id — add constraint after couples table created)
- notification_preferences (json, nullable)
- Remove: name column (replaced by display_name)
```

### Migration 02: Create couples table
```
- id (bigint unsigned, PK, auto-increment)
- uuid (char 36, unique, not null)
- name (varchar 200, nullable)
- partner_a_id (bigint unsigned, not null, FK → users.id)
- partner_b_id (bigint unsigned, nullable, FK → users.id)
- wedding_date (date, nullable)
- currency_code (char 3, not null, default 'IDR')
- status (enum: pending/active/dissolved, not null, default 'pending')
- dissolved_at (timestamp, nullable)
- avatar_url (varchar 500, nullable)
- timestamps
```
Indexes: uuid, partner_a_id, partner_b_id, status

### Migration 03: Add couple_id FK to users table
```php
$table->foreign('couple_id')->references('id')->on('couples')->nullOnDelete();
```

### Migration 04: Create couple_invitations table
```
- id, couple_id (FK), inviter_id (FK → users), invited_email (varchar 255),
- token (char 64, unique), status (enum: pending/accepted/expired/cancelled),
- expires_at (timestamp), accepted_at (timestamp nullable), timestamps
```

### Migration 05: Create personal_expenses table
```
- id, uuid, couple_id (FK), user_id (FK → users)
- amount_cents (bigint unsigned, not null)
- currency_code (char 3, not null)
- category (varchar 50, not null)
- description (varchar 500, nullable)
- expense_date (date, not null)
- is_visible_to_partner (boolean, not null, default false)
- timestamps, soft deletes
```
Indexes: couple_id, user_id, expense_date, category, is_visible_to_partner

### Migration 06: Create shared_expenses table
```
- id, uuid, couple_id (FK), logged_by_id (FK → users), paid_by_id (FK → users)
- amount_cents (bigint unsigned), currency_code (char 3)
- category (varchar 50), description (varchar 500 nullable)
- expense_date (date)
- partner_a_split_pct (decimal 5,2, not null, default 50.00)
- partner_b_split_pct (decimal 5,2, not null, default 50.00)
- settled_by_settlement_id (bigint unsigned, nullable, FK → settlements — add later)
- timestamps, soft deletes
```
Indexes: couple_id, expense_date, paid_by_id, category

### Migration 07: Create shared_expense_audit_logs table
```
- id, shared_expense_id (FK), changed_by_id (FK → users)
- action (enum: created/updated/deleted)
- previous_data (json nullable), new_data (json nullable)
- changed_at (timestamp, not null)
```
Note: NO timestamps(), NO softDeletes() — this is append-only.

### Migration 08: Create settlements table
```
- id, uuid, couple_id (FK), initiated_by_id (FK → users)
- amount_cents (bigint unsigned), currency_code (char 3)
- payer_id (FK → users), payee_id (FK → users)
- settlement_date (date), notes (varchar 500 nullable)
- created_at (timestamp) — only created_at, no updated_at
```

### Migration 09: Add settled_by_settlement_id FK to shared_expenses

### Migration 10: Create savings_fund table
```
- id, couple_id (bigint unsigned, unique, FK → couples)
- target_amount_cents (bigint unsigned, nullable)
- currency_code (char 3, not null, default 'IDR')
- timestamps
```

### Migration 11: Create savings_contributions table
```
- id, uuid, couple_id (FK), user_id (FK → users)
- amount_cents (bigint unsigned), currency_code (char 3)
- contribution_date (date), notes (varchar 300 nullable)
- timestamps, soft deletes
```
Indexes: couple_id, user_id, contribution_date

### Migration 12: Create savings_goals table
```
- id, uuid, couple_id (FK), created_by_id (FK → users)
- name (varchar 200), target_amount_cents (bigint unsigned)
- currency_code (char 3), deadline (date nullable)
- description (text nullable), color (varchar 20 nullable)
- icon (varchar 50 nullable)
- status (enum: active/completed/archived, default 'active')
- completed_at (timestamp nullable)
- sort_order (int unsigned, default 0)
- timestamps, soft deletes
```
Indexes: couple_id, status

### Migration 13: Create goal_contributions table
```
- id, uuid, savings_goal_id (FK), couple_id (FK — denormalized), user_id (FK → users)
- amount_cents (bigint unsigned), currency_code (char 3)
- contribution_date (date), notes (varchar 300 nullable)
- timestamps, soft deletes
```
Indexes: savings_goal_id, couple_id, user_id

### Migration 14: Create checklist_items table
```
- id, uuid, couple_id (FK), created_by_id (FK → users, nullable — null = system)
- title (varchar 300), category (varchar 100)
- description (text nullable)
- assigned_to (enum: partner_a/partner_b/both, default 'both')
- due_date (date nullable)
- status (enum: todo/done, default 'todo')
- completed_by_id (FK → users, nullable)
- completed_at (timestamp nullable)
- is_system_default (boolean, default false)
- sort_order (int unsigned, default 0)
- timestamps, soft deletes
```
Indexes: couple_id, status, assigned_to, due_date, category

### Migration 15: Create activity_logs table
```
- id, couple_id (FK), actor_id (FK → users)
- action (varchar 100) — e.g. 'expense.shared.created'
- subject_type (varchar 100 nullable) — polymorphic
- subject_id (bigint unsigned nullable) — polymorphic
- metadata (json nullable)
- occurred_at (timestamp, not null)
```
Indexes: couple_id, actor_id, occurred_at; composite(couple_id, occurred_at)
Note: No softDeletes, no updated_at — append-only

### Migration 16: Create notifications table
```
- id, uuid, user_id (FK), couple_id (FK)
- type (varchar 100), data (json)
- read_at (timestamp nullable)
- created_at (timestamp)
```
Indexes: user_id, read_at; composite(user_id, couple_id)

### Migration 17: Create sessions table (for database session driver)
Laravel standard: `php artisan session:table`

### Migration 18: Create jobs & failed_jobs tables
Laravel standard: `php artisan queue:table && php artisan queue:failed-table`

---

## Eloquent Models

Create a model for every table. Each model must include:

### `User` model
```php
protected $fillable = ['uuid', 'display_name', 'email', 'password', 'avatar_url', 'couple_id', 'notification_preferences'];
protected $hidden = ['password', 'remember_token'];
protected $casts = ['notification_preferences' => 'array', 'email_verified_at' => 'datetime'];

// Relationships
public function couple(): BelongsTo  // → Couple
public function personalExpenses(): HasMany
public function sharedExpensesLogged(): HasMany
public function sharedExpensesPaid(): HasMany
public function savingsContributions(): HasMany
public function goalContributions(): HasMany
public function activityLogs(): HasMany  // as actor
public function notifications(): HasMany

// Helpers
public function isInCouple(): bool
public function isPartnerOf(User $user): bool
public function getCouplePartner(): ?User
```

### `Couple` model
```php
protected $fillable = ['uuid', 'name', 'partner_a_id', 'partner_b_id', 'wedding_date', 'currency_code', 'status', 'dissolved_at', 'avatar_url'];
protected $casts = ['wedding_date' => 'date', 'dissolved_at' => 'datetime'];

// Relationships
public function partnerA(): BelongsTo  // → User
public function partnerB(): BelongsTo  // → User
public function invitations(): HasMany
public function personalExpenses(): HasMany
public function sharedExpenses(): HasMany
public function savingsFund(): HasOne
public function savingsContributions(): HasMany
public function savingsGoals(): HasMany
public function checklistItems(): HasMany
public function activityLogs(): HasMany
public function settlements(): HasMany

// Helpers
public function isActive(): bool
public function hasBothPartners(): bool
public function getOtherPartner(User $user): ?User
public function daysUntilWedding(): ?int
```

Create all remaining models following the same pattern:
- `CoupleInvitation` — with `isExpired()`, `isPending()` helpers
- `PersonalExpense` — with `SoftDeletes`
- `SharedExpense` — with `SoftDeletes`, `auditLogs()` relationship
- `SharedExpenseAuditLog` — append-only (no SoftDeletes, no updated_at)
- `Settlement`
- `SavingsFund`
- `SavingsContribution` — with `SoftDeletes`
- `SavingsGoal` — with `SoftDeletes`, `isCompleted()`, `progressPercentage()` helpers
- `GoalContribution` — with `SoftDeletes`
- `ChecklistItem` — with `SoftDeletes`, `isOverdue()`, `isDone()` helpers
- `ActivityLog` — append-only (no SoftDeletes, no updated_at)
- `Notification`

---

## Database Seeders

### `DefaultChecklistSeeder`
A seeder that stores the default wedding checklist template. This is used by the `SeedChecklistOnCoupleFormed` listener. Define 15–20 items across categories: Venue, Catering, Attire, Photography, Invitations, Legal, Honeymoon, Music.

Store these as a PHP array constant in `app/Data/DefaultChecklist.php` (not in the database — they are seeded per couple on couple formation).

### `DatabaseSeeder`
Create a development seeder that:
1. Creates 2 test users
2. Creates an active couple between them
3. Seeds 10 personal expenses for each user
4. Seeds 8 shared expenses with varied splits
5. Seeds a savings fund with 5 contributions
6. Seeds 3 savings goals with contributions
7. Seeds the default checklist
8. Seeds 10 activity log entries

---

## Acceptance Criteria
- [ ] All 18 migrations run in order without errors: `php artisan migrate`
- [ ] All models are created with correct `$fillable`, casts, and relationships
- [ ] `php artisan migrate:fresh --seed` runs without errors
- [ ] All foreign key constraints are correctly defined
- [ ] Soft deletes applied to correct tables
- [ ] Append-only tables have no `updated_at` or `deleted_at`
- [ ] `DefaultChecklist.php` data class exists with full template
- [ ] Test seeder creates valid, related data

## Notes
- All monetary amounts stored as integers (cents) — NEVER use float/decimal for amounts
- UUIDs generated in model `boot()` method using `Str::uuid()`
- `split_pct` columns must sum to 100 — enforce in model or service, not migration (MySQL 8 CHECK is fine if available)
- Commit message: `feat: database migrations and eloquent models`

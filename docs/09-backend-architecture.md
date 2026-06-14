# 09 — Backend Architecture

---

## Overview

Twogether's backend is built on **Laravel 13** with **MySQL** as the primary database, **Inertia.js** as the server-side rendering bridge, and a queue-based system for async operations. The architecture is monolithic at MVP but structured to extract services cleanly in V2 if needed.

---

## Architectural Style

**Pattern:** Modular Monolith  
**Why not microservices?** At MVP scale, microservices introduce deployment complexity, network latency, and operational overhead with no benefit. The monolith is organized into domain modules that can be independently extracted later if necessary.

**Laravel Application Type:** Inertia.js + React SPA  
Inertia replaces traditional API + client separation. The backend returns Inertia responses (component + props) rather than JSON. This simplifies state management and eliminates the need for a separate REST API at MVP.

---

## Module Structure

The application is organized into **domain modules** inside `app/`, replacing the traditional flat controller structure.

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/                    → Registration, login, password reset
│   │   ├── Couple/                  → Couple creation, invitation, leaving
│   │   ├── Expenses/
│   │   │   ├── PersonalExpenseController
│   │   │   ├── SharedExpenseController
│   │   │   └── BalanceController
│   │   ├── Savings/
│   │   │   ├── SavingsFundController
│   │   │   ├── ContributionController
│   │   │   ├── GoalController
│   │   │   └── GoalContributionController
│   │   ├── Wedding/
│   │   │   └── ChecklistController
│   │   ├── Settings/
│   │   │   ├── ProfileController
│   │   │   ├── CoupleSettingsController
│   │   │   └── SecurityController
│   │   └── DashboardController
│   │
│   ├── Middleware/
│   │   ├── HasActiveCouple          → Redirects to onboarding if no couple
│   │   ├── CoupleActive             → Blocks dissolved couple access
│   │   └── EnsureCoupleScope        → Adds couple context to request
│   │
│   └── Requests/                    → Form Request classes per action
│       ├── Expenses/
│       ├── Savings/
│       ├── Wedding/
│       └── Couple/
│
├── Models/
│   ├── User
│   ├── Couple
│   ├── CoupleInvitation
│   ├── PersonalExpense
│   ├── SharedExpense
│   ├── SharedExpenseAuditLog
│   ├── Settlement
│   ├── SavingsFund
│   ├── SavingsContribution
│   ├── SavingsGoal
│   ├── GoalContribution
│   ├── ChecklistItem
│   ├── ActivityLog
│   └── Notification
│
├── Services/                        → Business logic layer
│   ├── CoupleService
│   ├── InvitationService
│   ├── ExpenseService
│   ├── BalanceCalculatorService
│   ├── SavingsService
│   ├── GoalService
│   ├── ChecklistService
│   ├── ActivityLogService
│   └── NotificationService
│
├── Actions/                         → Single-responsibility action classes
│   ├── Couple/
│   │   ├── CreateCouple
│   │   ├── SendCoupleInvitation
│   │   ├── AcceptCoupleInvitation
│   │   └── LeaveCouple
│   ├── Expenses/
│   │   ├── CreatePersonalExpense
│   │   ├── CreateSharedExpense
│   │   ├── UpdateSharedExpense
│   │   └── SettleBalance
│   ├── Savings/
│   │   ├── AddContribution
│   │   ├── CreateGoal
│   │   └── AddGoalContribution
│   └── Checklist/
│       ├── SeedDefaultChecklist
│       └── CompleteChecklistItem
│
├── Policies/                        → Laravel authorization policies
│   ├── PersonalExpensePolicy
│   ├── SharedExpensePolicy
│   ├── SavingsGoalPolicy
│   └── ChecklistItemPolicy
│
├── Events/                          → Domain events
│   ├── CoupleFormed
│   ├── InvitationAccepted
│   ├── SharedExpenseCreated
│   ├── ContributionAdded
│   ├── SavingsMilestoneReached
│   ├── GoalCompleted
│   └── ChecklistItemCompleted
│
├── Listeners/                       → Event handlers
│   ├── LogActivityOnSharedExpense
│   ├── LogActivityOnContribution
│   ├── NotifyPartnerOnSharedExpense
│   ├── NotifyPartnerOnContribution
│   ├── SeedChecklistOnCoupleFormed
│   └── CelebrateMilestone
│
├── Jobs/                            → Queued jobs
│   ├── SendInvitationEmail
│   ├── SendNotificationEmail
│   └── ProcessMilestoneReward
│
├── Notifications/                   → Laravel notification classes
│   ├── CoupleInvitationSent
│   ├── PartnerJoined
│   ├── SharedExpenseAdded
│   ├── ContributionAdded
│   └── MilestoneReached
│
└── Resources/                       → Inertia response data shaping
    ├── UserResource
    ├── CoupleResource
    ├── PersonalExpenseResource
    ├── SharedExpenseResource
    ├── SavingsOverviewResource
    ├── SavingsGoalResource
    └── ChecklistResource
```

---

## Service Layer Design

Services contain the complex business logic that doesn't belong in controllers or models.

### `BalanceCalculatorService`

Responsible for calculating the running balance between partners.

**Methods:**
- `calculateBalance(Couple $couple, ?Settlement $sinceSettlement = null): BalanceResult`
- `getPartnerOwes(Couple $couple): array` — Returns `['amount', 'owes', 'owed_by']`
- `calculateSettlementAmount(Couple $couple): int` — Returns cents

**BalanceResult Value Object:**
```
{
  partner_a_id: int,
  partner_b_id: int,
  partner_a_paid_total: int,         // Total cents paid by A
  partner_b_paid_total: int,
  partner_a_share_total: int,        // Total cents A is responsible for
  partner_b_share_total: int,
  net_balance: int,                  // Positive = A owes B, Negative = B owes A
  balance_holder_id: int|null,       // Who is owed money
  balance_payer_id: int|null,        // Who owes money
  since_date: ?Carbon,               // Start of calculation window
}
```

### `SavingsService`

**Methods:**
- `getFundSummary(Couple $couple): SavingsSummary`
- `getPartnerContributions(Couple $couple): array`
- `getProjectedCompletionDate(Couple $couple): ?Carbon`
- `checkMilestones(Couple $couple): array` — Returns newly crossed milestones

### `ActivityLogService`

**Methods:**
- `log(Couple $couple, User $actor, string $action, ?Model $subject = null, array $metadata = []): void`
- `getRecentActivity(Couple $couple, int $limit = 15): Collection`

---

## Authentication Model

### Session-Based Authentication
Twogether uses **Laravel's built-in session-based authentication** (not API tokens or JWT). This is appropriate for a web application served via Inertia.js.

**Auth flow:**
1. User submits login form
2. Laravel validates credentials
3. Session created with `Auth::login()`
4. Session ID stored in HttpOnly, Secure cookie
5. All subsequent requests authenticated via session middleware

**Session configuration:**
- Driver: `database` (for persistence across deployments; Redis in V2)
- Lifetime: 120 minutes (default), extended with remember-me to 30 days
- Cookie: HttpOnly, Secure (HTTPS), SameSite=Lax

### Password Reset
Standard Laravel password reset flow via `password_reset_tokens` table. Tokens expire in 60 minutes.

---

## Authorization Model

### Laravel Policies

Authorization is handled through **Laravel Policies** rather than inline checks.

**Policy rules:**

`PersonalExpensePolicy`
- `view(User $user, PersonalExpense $expense)`: owner OR (partner AND is_visible_to_partner)
- `update(User $user, PersonalExpense $expense)`: owner only
- `delete(User $user, PersonalExpense $expense)`: owner only

`SharedExpensePolicy`
- `view(User $user, SharedExpense $expense)`: must be in same couple
- `update(User $user, SharedExpense $expense)`: must be in same couple
- `delete(User $user, SharedExpense $expense)`: must be in same couple

`SavingsGoalPolicy`
- All CRUD: must be in same couple as goal

`ChecklistItemPolicy`
- All CRUD: must be in same couple as item

### Couple Scope Middleware

`EnsureCoupleScope` middleware attaches the current user's couple to the request object:

```
$request->couple = $request->user()->couple;
```

All subsequent controllers and services receive the couple from `$request->couple`, preventing any possibility of accessing another couple's data by manipulating IDs.

---

## Validation Strategy

All input validation is handled by **Laravel Form Request classes** — never inline in controllers.

**Validation principles:**
1. All monetary amounts are validated as positive integers (representing cents) at the API layer
2. Split percentages must sum to 100
3. Dates are validated as valid dates in ISO format
4. Enum fields validated against defined allowed values
5. Text fields have max length validation (prevent storage abuse)
6. Email fields are normalized (lowercased) before storage

**Error responses:** Inertia handles validation errors by returning them to the same page component. React components read `errors` from Inertia's shared props.

---

## API Boundaries (Inertia Props)

Since Inertia replaces traditional REST APIs, controllers return **Inertia render responses** with typed prop shapes. These form the API contract between backend and frontend.

### Dashboard Controller Response
```
{
  couple: CoupleResource,
  countdown: { days: int, date: string|null },
  balance: BalanceResult,
  savings_summary: SavingsSummary,
  top_goals: GoalResource[],
  recent_activity: ActivityItem[],
  checklist_summary: { total: int, completed: int, overdue: int }
}
```

### Shared Expenses Controller Response
```
{
  expenses: PaginatedResource<SharedExpenseResource>,
  balance: BalanceResult,
  filters: { categories: string[], date_range: object }
}
```

### Savings Overview Response
```
{
  fund: SavingsFundResource,
  contributions: ContributionResource[],
  partner_stats: { partner_a: PartnerContribStats, partner_b: PartnerContribStats },
  milestones: MilestoneStatus[]
}
```

---

## Event-Driven Architecture

Domain events decouple business actions from side effects.

**Event → Listeners:**

| Event | Listeners |
|-------|-----------|
| `CoupleFormed` | `SeedChecklistOnCoupleFormed`, `SendWelcomeEmail` |
| `InvitationAccepted` | `NotifyInviter`, `LogActivity` |
| `SharedExpenseCreated` | `LogActivity`, `NotifyPartner`, `AuditLog` |
| `SharedExpenseUpdated` | `LogActivity`, `AuditLog` |
| `ContributionAdded` | `LogActivity`, `NotifyPartner`, `CheckMilestones` |
| `SavingsMilestoneReached` | `NotifyBothPartners`, `LogActivity` |
| `GoalCompleted` | `NotifyBothPartners`, `LogActivity`, `MarkGoalComplete` |
| `ChecklistItemCompleted` | `LogActivity`, `CheckAllComplete` |

All listeners that send notifications or emails are **queued** (implement `ShouldQueue`).

---

## Queue System

**Driver:** Database queue (MVP) → Redis (V1.5)

**Queues:**
- `default` — General async tasks
- `notifications` — Email and in-app notification dispatch
- `high` — Time-sensitive operations (invitation expiry checks)

**Failed Job handling:** All failed jobs stored in `failed_jobs` table with payload for retry.

---

## Security Architecture Summary

(See full detail in `11-security-considerations.md`)

- Session auth with HttpOnly cookies
- CSRF on all state-changing routes
- Policy-based authorization
- Couple scope enforced in middleware
- All financial amounts validated as integers
- Soft deletes preserve audit trails
- All sensitive changes emit audit log events

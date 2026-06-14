# Prompt 05 — App Shell, Navigation & Dashboard

## Context
Couple space and onboarding are complete from Prompt 04. Now build the main application shell (navigation + layout) and the dashboard — the heart of the daily experience.

Read `04-information-architecture.md`, `07-design-system.md`, and `05-feature-specifications.md` (FEAT-09 Activity Feed) before starting.

---

## Backend

### `DashboardController`
```
GET /dashboard
Requires: auth + HasActiveCouple middleware

Gather and return these props:
{
  couple: CoupleResource,         // name, wedding_date, currency_code, both partners
  countdown: {
    days: int|null,               // null if no wedding date
    date: string|null,            // formatted wedding date
    message: string               // "X days to go!" or "Set your wedding date"
  },
  balance: {
    net_cents: int,               // positive = auth user is owed, negative = auth user owes
    owed_by_name: string|null,    // who owes
    owed_to_name: string|null,    // who is owed
    is_settled: bool              // if balance == 0
  },
  savings_summary: {
    total_saved_cents: int,
    target_cents: int|null,
    progress_pct: float,
    my_contribution_cents: int,
    partner_contribution_cents: int,
  },
  top_goals: GoalResource[],      // max 3, active goals, highest progress first
  recent_activity: ActivityItem[], // last 8 activity log entries
  checklist_summary: {
    total: int,
    completed: int,
    overdue: int,
    pct: float
  }
}
```

Use eager loading to avoid N+1 queries. All monetary calculations done in PHP service classes (BalanceCalculatorService, SavingsService).

### `Services/BalanceCalculatorService`
```php
public function getBalanceSummary(Couple $couple, User $viewingAs): array
// Returns the balance props shape above
// Uses last settlement date as starting point if settlements exist
// Positive net_cents = viewing user is owed money
// Negative net_cents = viewing user owes money
```

### `Services/SavingsService`
```php
public function getFundSummary(Couple $couple, User $viewingAs): array
// Returns savings_summary props shape
// Calculates per-user contribution totals
```

### `Services/ActivityLogService`
```php
public function log(Couple $couple, User $actor, string $action, ?Model $subject = null, array $metadata = []): void

public function getRecent(Couple $couple, int $limit = 8): Collection
// Returns ActivityLog collection, with actor relationship eager loaded
// Format occurred_at as human-readable relative time ("2 hours ago", "yesterday")
```

### `Resources/` (Inertia Resource classes)

Create `CoupleResource`, `UserResource`, `GoalResource`, `ActivityResource` as plain PHP classes (not Laravel API Resources — these return arrays for Inertia props):

```php
// CoupleResource::make($couple, $viewingUser)
// Returns:
[
  'uuid' => ...,
  'name' => ...,
  'wedding_date' => $couple->wedding_date?->format('Y-m-d'),
  'wedding_date_formatted' => $couple->wedding_date?->format('d MMMM Y'),  // in locale
  'currency_code' => ...,
  'partner_a' => ['uuid', 'display_name', 'avatar_url'],
  'partner_b' => ['uuid', 'display_name', 'avatar_url'] | null,
  'status' => ...,
  'is_me_partner_a' => $viewingUser->id === $couple->partner_a_id,
]
```

---

## React Components — Organisms (Layout)

### `organisms/layout/AppShell.tsx`

The master layout wrapper for all authenticated pages with an active couple.
```tsx
// Props: children
// Structure:
// - Desktop (lg+): Sidebar (fixed left, 240px) + main content (margin-left 240px)
// - Mobile (< lg): Main content full width + BottomNav (fixed bottom)
// - Header bar (desktop: inside sidebar header, mobile: top bar)
// - Toast provider wrapping everything
// - Scroll container: main area only, not sidebar
```

### `organisms/layout/Sidebar.tsx`

Desktop sidebar navigation:
```tsx
// TOP SECTION:
//   Couple avatar/icon (24x24 circle) + Couple name (truncated)
//   Small "Active" green dot if partner online (future — show static for now)

// NAV ITEMS (with icons from lucide-react):
//   Home → /dashboard          (LayoutDashboard icon)
//   Expenses → /expenses/shared (CreditCard icon)
//   Savings → /savings          (PiggyBank icon)
//   Wedding → /wedding          (Heart icon)

// ACTIVE STATE:
//   Pink-50 background, pink-500 text and icon, 3px pink-500 left border
// INACTIVE: neutral-600 icon, neutral-700 text
// HOVER: neutral-50 background (transition 150ms)

// BOTTOM SECTION:
//   User avatar + display_name
//   Settings gear icon → /settings/profile
//   Logout button (with confirmation? — no, just logout)
```

### `organisms/layout/BottomNav.tsx`

Mobile bottom navigation:
```tsx
// Fixed bottom, white bg, border-top neutral-100
// Height: 64px (includes safe-area-inset-bottom for iOS)
// 4 items: icon + label
// Same 4 nav items as sidebar
// Active: pink-500 icon + label, slight scale(1.05)
// Inactive: neutral-400 icon + neutral-500 label
```

### `organisms/layout/Header.tsx`

Top header (mobile only — on desktop the sidebar handles branding):
```tsx
// Height: 56px
// Left: Twogether logo (small)
// Center: Current page title (passed as prop)
// Right: Notification bell icon (badge count) + User avatar (links to profile)
```

---

## React Components — Dashboard Organisms

### `organisms/dashboard/CountdownCard.tsx`

The hero element of the dashboard. This should be the most visually striking component.
```tsx
// Props: { days: number | null, date: string | null, coupleNames: string }

// DESIGN — Full-width card with pink gradient background (pink-500 → pink-600)
// White text throughout

// Layout:
// Left: 
//   - Small label: "Days until your wedding" (white/70 opacity, caption size)
//   - HUGE number: days remaining (display size, 4-5rem, white, tabular-nums)
//   - Wedding date formatted: "Saturday, 14 December 2025" (white/80)
// Right (desktop): 
//   - Abstract illustration or large heart/ring emoji treatment
//   - Weeks and months as secondary stat chips (white/60 bg, rounded-full)

// Special states:
// - No date set: Soft pink card, prompt "Set your wedding date →" (links to /settings/couple)
// - Today: Special "Today is the day! 💍" full celebration layout
// - Past: "You're married! Congratulations 🎉" with different illustration

// Border-radius: 2xl (24px)
// Shadow: shadow-pink-md
```

### `organisms/dashboard/BalanceSummaryCard.tsx`

```tsx
// Props: { netCents: number, owedByName: string|null, owedToName: string|null, isSettled: boolean, currencyCode: string }

// DESIGN — Standard white card

// States:
// SETTLED: 
//   Green checkmark icon + "You're all square ✓" + "No balance between you right now"
// AUTH_USER_IS_OWED (net > 0):
//   "{PartnerName} owes you"
//   Large pink amount: formatCurrency(netCents)
//   Small CTA: "Settle up →" (ghost button)
// AUTH_USER_OWES (net < 0):
//   "You owe {PartnerName}"
//   Large pink amount: formatCurrency(Math.abs(netCents))
//   Note: "Based on shared expenses"
```

### `organisms/dashboard/SavingsSummaryCard.tsx`

```tsx
// Props: SavingsSummary + top_goals

// Top section:
//   Total saved (large pink number)
//   Target amount (if set): "of Rp X,XXX,XXX"
//   MilestoneProgress component (progress bar with 25/50/75/100% markers)

// Partner contributions section (if both partners active):
//   Two small avatar+name+amount chips side by side

// Goals preview (up to 3):
//   Small goal cards: name + compact progress bar + %
//   "View all goals →" link

// CTA: "+ Add Contribution" button (pink primary)
```

### `organisms/dashboard/ActivityFeed.tsx`

```tsx
// Props: { activities: ActivityItem[] }

// Section header: "Recent Activity" + timestamp of last activity (optional)

// Each ActivityItem:
//   Left: Partner avatar (small, 32px)
//   Middle: Action description (e.g., "Reza added a shared expense · Rp 150,000")
//   Right: Relative time ("2h ago", "Yesterday")

// Activity descriptions by action type:
//   'expense.shared.created' → "[Name] added a shared expense · [amount]"
//   'expense.shared.updated' → "[Name] updated a shared expense"
//   'savings.contribution.added' → "[Name] saved [amount] 💰"
//   'savings.goal.created' → "[Name] created a new goal: [goal name]"
//   'checklist.item.completed' → "[Name] completed: [task name] ✓"
//   'couple.formed' → "You're now planning together! 🎉"
//   'savings.milestone.reached' → "You've saved [X]% of your goal! 🎉"

// Empty state: 
//   Small illustration + "No activity yet — start by adding an expense or savings contribution"

// Max 8 items shown. "View all" not needed at MVP.
```

### `organisms/dashboard/QuickActions.tsx`

```tsx
// Floating action buttons (bottom-right on desktop, above bottom nav on mobile)
// Or inline row of action buttons on mobile

// 3 actions:
//   "+ Expense" → opens AddSharedExpenseModal
//   "+ Savings" → opens AddContributionModal  
//   "+ Task" → opens AddChecklistItemModal

// On desktop: Expandable FAB — main "+" button that expands to 3 options
// On mobile: Horizontal row of 3 pill buttons above the content
```

### `organisms/dashboard/ChecklistSummaryCard.tsx`

```tsx
// Props: { total: number, completed: number, overdue: number, pct: number }

// Circular progress indicator (donut) — pink fill
// Center: "[pct]%" 
// Below donut: "[completed] of [total] tasks done"
// If overdue > 0: warning badge "[overdue] overdue"
// CTA: "View Checklist →"
```

---

## Page: `resources/js/pages/Dashboard.tsx`

```tsx
// Receives all dashboard props from DashboardController
// Uses AppShell as wrapper
// Grid layout:
//   Desktop (lg): 
//     Row 1: CountdownCard (full width)
//     Row 2: BalanceSummaryCard (1/3) + SavingsSummaryCard (2/3)
//     Row 3: ActivityFeed (2/3) + ChecklistSummaryCard (1/3)
//   Mobile:
//     Stacked single column: Countdown → Savings → Balance → Checklist Summary → Activity

// Quick Actions component positioned appropriately
```

---

## Acceptance Criteria
- [ ] Sidebar renders on desktop (lg+), BottomNav renders on mobile
- [ ] Active nav item highlighted correctly on each route
- [ ] CountdownCard shows correct days remaining
- [ ] CountdownCard special states work (no date, today, past)
- [ ] BalanceSummaryCard correctly shows who owes whom (test both directions)
- [ ] SavingsSummaryCard shows progress bar and partner contributions
- [ ] ActivityFeed renders action descriptions correctly for each action type
- [ ] QuickActions open the correct modals (modals can be stubs for now)
- [ ] Dashboard layout is responsive (mobile stacked, desktop grid)
- [ ] No N+1 queries on dashboard load (verify with Laravel Debugbar or telescope)
- [ ] Dashboard loads in < 500ms on local development

## Notes
- The CountdownCard is the emotional anchor of the whole product — make it beautiful
- Use Tailwind's `gap` and `grid` utilities for the dashboard layout
- Modals referenced (Add Expense, Add Contribution, Add Task) are built in later prompts — stub them as `<div>Modal coming soon</div>` for now
- Commit message: `feat: app shell navigation and dashboard`

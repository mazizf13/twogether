# Prompt 06 — Expenses (Personal, Shared & Balance)

## Context
App shell and dashboard are complete from Prompt 05. Now build the full expenses system — the most-used feature in the product.

Read `05-feature-specifications.md` (FEAT-03, FEAT-04), `06-business-rules.md` (Sections 2, 3, 5), and `07-design-system.md` before starting.

---

## Expense Categories

Define this as a constant in `app/Enums/ExpenseCategory.php` (or a simple PHP constant class):

```php
const PERSONAL_CATEGORIES = [
  'food_dining'     => 'Food & Dining',
  'transportation'  => 'Transportation',
  'shopping'        => 'Shopping',
  'entertainment'   => 'Entertainment',
  'health'          => 'Health',
  'education'       => 'Education',
  'bills_utilities' => 'Bills & Utilities',
  'wedding'         => 'Wedding',
  'other'           => 'Other',
];

const SHARED_CATEGORIES = [
  'venue'           => 'Venue',
  'catering'        => 'Catering',
  'photography'     => 'Photography',
  'attire'          => 'Attire',
  'invitations'     => 'Invitations',
  'decorations'     => 'Decorations',
  'music'           => 'Music',
  'honeymoon'       => 'Honeymoon',
  'rings_jewelry'   => 'Rings & Jewelry',
  'food_dining'     => 'Food & Dining',
  'transportation'  => 'Transportation',
  'accommodation'   => 'Accommodation',
  'other'           => 'Other',
];
```

---

## Backend — Personal Expenses

### `Expenses/PersonalExpenseController`
```
GET  /expenses/personal
  Auth + HasActiveCouple
  Props: {
    expenses: PersonalExpenseResource[] (paginated, 20/page),
    summary: { total_cents: int, by_category: [{ category, total_cents, count }] },
    filters: { categories: string[], months: string[] },
    active_filters: { category: string|null, month: string|null }
  }
  Apply filters from request query params

POST /expenses/personal
  Validate:
    amount_cents: required, integer, min:1, max:9999999999
    category: required, in:personal_categories
    description: nullable, string, max:500
    expense_date: required, date
    is_visible_to_partner: boolean, default false
  Create PersonalExpense (couple_id from middleware, user_id from auth)
  Log activity: 'expense.personal.created' (only if is_visible_to_partner = true)
  Return: redirect back with success flash OR return JSON for modal

PUT  /expenses/personal/{expense}
  Policy: owner only
  Same validation as POST (amount, category, description, date, is_visible_to_partner)
  Log if visibility changed: 'expense.personal.visibility_changed'

DELETE /expenses/personal/{expense}
  Policy: owner only
  Soft delete
  Flash: "Expense deleted"
```

### `Policies/PersonalExpensePolicy`
```php
public function view(User $user, PersonalExpense $expense): bool
  // Owner OR (same couple AND is_visible_to_partner)

public function update(User $user, PersonalExpense $expense): bool
  // Owner only

public function delete(User $user, PersonalExpense $expense): bool
  // Owner only
```

---

## Backend — Shared Expenses

### `Expenses/SharedExpenseController`
```
GET  /expenses/shared
  Props: {
    expenses: SharedExpenseResource[] (paginated, 20/page),
    balance: BalanceSummary,
    couple: CoupleResource (partner info for "paid by" labels),
    filters: { categories, months, paid_by }
    active_filters: { ... }
  }

POST /expenses/shared
  Validate:
    amount_cents: required, integer, min:1
    category: required, in:shared_categories
    description: nullable, string, max:500
    expense_date: required, date
    paid_by_id: required, in:[partner_a_id, partner_b_id]
    partner_a_split_pct: required, numeric, min:0, max:100
    partner_b_split_pct: required, numeric, min:0, max:100
  Custom validation: partner_a_split_pct + partner_b_split_pct == 100
  Create SharedExpense
  Create SharedExpenseAuditLog (action: 'created', new_data: expense attributes)
  Log activity: 'expense.shared.created' with metadata {amount_cents, category}
  Dispatch NotifyPartnerOnSharedExpense job

PUT  /expenses/shared/{expense}
  Policy: same couple
  Validate same fields
  Before update: save old data for audit
  Update SharedExpense
  Create SharedExpenseAuditLog (action: 'updated', previous_data: old, new_data: new)
  Log activity: 'expense.shared.updated'

DELETE /expenses/shared/{expense}
  Policy: same couple
  Capture current data for audit
  Soft delete
  Create SharedExpenseAuditLog (action: 'deleted', previous_data: old attributes)
  Log activity: 'expense.shared.deleted'
```

### Balance Controller
```
GET  /expenses/balance
  Props: { balance: DetailedBalanceSummary, settlements: SettlementResource[] (last 5) }

POST /expenses/balance/settle
  Validate: amount_cents (required, int, min:1), settlement_date (required, date), notes (nullable)
  Create Settlement record
  Log activity: 'balance.settled'
  Flash: "Balance settled successfully"
```

### `Services/BalanceCalculatorService` (full implementation)
```php
public function calculateBalance(Couple $couple): BalanceResult
  // Get last settlement date (if any)
  // Query all shared_expenses since last settlement, not soft-deleted
  // For each expense:
  //   partner_a_share = amount_cents * (partner_a_split_pct / 100)
  //   partner_b_share = amount_cents * (partner_b_split_pct / 100)
  //   if paid_by_id == partner_a_id: partner_a_paid += amount_cents
  //   else: partner_b_paid += amount_cents
  // net_balance = (partner_a_paid - partner_a_share) - (partner_b_paid - partner_b_share)
  // Return BalanceResult value object
```

---

## React — Atoms & Molecules

### `atoms/CategoryIcon.tsx`
```tsx
// Props: { category: string, size?: 'sm'|'md'|'lg' }
// Maps category keys to lucide-react icons:
//   venue → Building2, catering → Utensils, photography → Camera
//   attire → Shirt, music → Music, rings → Diamond
//   food_dining → UtensilsCrossed, transportation → Car
//   shopping → ShoppingBag, health → Heart, etc.
// Returns icon wrapped in a small colored circle
// Color of circle: different soft tint per category (wedding categories = pink tints)
```

### `atoms/CurrencyAmount.tsx`
```tsx
// Props: { cents: number, currencyCode: string, size?: 'sm'|'md'|'lg'|'display', 
//          color?: 'default'|'pink'|'success'|'danger', showSign?: boolean }
// Renders formatted currency using formatCurrency()
// tabular-nums font-feature
// 'display' size: 2.5rem+, bold
```

### `molecules/AmountInput.tsx`
```tsx
// Props: { value, onChange, currencyCode, error? }
// Currency code prefix (e.g., "Rp") + right-aligned number input
// Stores as cents internally, displays as formatted number
// On blur: format with thousands separator
// Clear button (X) when value > 0
```

### `molecules/SplitSlider.tsx`
```tsx
// Props: { partnerAName, partnerBName, partnerASplit, onChange }
// Shows: [PartnerA] [======|=====] [PartnerB]
// Slider handle in the middle
// Both names shown with their percentage
// Quick preset buttons below: "50/50" | "You pay more" | "They pay more" | "Custom"
// 50/50 preset is the default, selects cleanly to 50%
```

### `molecules/ExpenseRow.tsx`
```tsx
// Props: { expense: PersonalExpense | SharedExpense, type: 'personal'|'shared', 
//          currencyCode, onEdit, onDelete, couplePartner? }
// Layout: CategoryIcon | Description + date | Amount + paid-by badge
// For shared: show "Paid by [Name]" badge + split indicator
// For personal: show category label + optional "Visible to partner" eye icon
// Hover: subtle highlight, show edit/delete action buttons (or via ... menu)
// Tap/click: opens edit modal
```

### `molecules/BalanceBadge.tsx`
```tsx
// Props: { netCents: number, viewerOwes: boolean, partnerName: string, currencyCode: string }
// Compact: "[Name] owes you Rp X" or "You owe [Name] Rp X" or "Settled ✓"
// Color: green for settled, pink for owed to you, amber for you owe
```

---

## React — Modals

### `modals/AddPersonalExpenseModal.tsx`
```tsx
// Dialog with form:
// - Amount input (AmountInput molecule)
// - Category select (CategorySelect with icons)
// - Description (optional text input)
// - Date picker (default today)
// - "Share with partner" toggle switch (with label: "Your partner will see this expense")
// Footer: Cancel | Add Expense (pink primary)
// On submit: Inertia.post('/expenses/personal', data, { preserveScroll: true, onSuccess: close modal })
```

### `modals/AddSharedExpenseModal.tsx`
```tsx
// Dialog with form:
// - Amount input
// - Category select (shared categories)
// - Description (optional)
// - Date picker
// - "Who paid?" - Radio/Select: You | Partner
// - SplitSlider molecule
// Footer: Cancel | Add Expense
// Show calculated amounts below split slider:
//   "You owe: Rp X · [Partner] owes: Rp Y"
```

### `modals/EditSharedExpenseModal.tsx`
```tsx
// Same as Add but pre-filled with existing data
// Title: "Edit Expense"
// Note at bottom: "Changes are recorded in the audit trail"
```

### `modals/SettleUpModal.tsx`
```tsx
// Shows current balance summary at top
// "Who's paying?" (pre-filled based on who owes)
// Amount (pre-filled with balance amount, editable)
// Date (default today)
// Notes (optional)
// Footer: Cancel | Confirm Settlement
```

### `modals/ConfirmDeleteModal.tsx`
```tsx
// Generic reusable confirmation modal
// Props: { title, description, onConfirm, onCancel, isLoading }
// Red/danger variant button for confirm
// "This action cannot be undone."
```

---

## React — Pages

### `pages/Expenses/Personal.tsx`
```tsx
// AppShell wrapper
// Page header: "My Expenses" + "+ Add Expense" button
// Filter row: Month select + Category select (pills/chips style)
// Expense summary cards (total + top categories) - shown above list
// ExpenseList: grouped by month, ExpenseRow for each
// Empty state: "No personal expenses yet. Add your first one!"
// Modals: AddPersonalExpenseModal, EditExpenseModal (reuses add with prefill), ConfirmDeleteModal
```

### `pages/Expenses/Shared.tsx`
```tsx
// AppShell wrapper  
// Tabs: "Shared" (active) | "Personal" | "Balance" (use shadcn Tabs)
// Page header: "Shared Expenses" + "+ Add Expense" button
// BalanceBadge (compact) shown in header area
// Filter row: Month | Category | Paid by
// SharedExpense list grouped by month
// Empty state: "No shared expenses yet — add your first one together!"
```

### `pages/Expenses/Balance.tsx`
```tsx
// AppShell wrapper
// Tabs: "Shared" | "Personal" | "Balance" (active)
// Large BalanceSummaryCard (full detail version)
//   Shows: total each partner paid, each partner's calculated share, net balance
//   "Settle Up" button if balance != 0
// Recent Settlements list (last 5)
// SettleUpModal
```

---

## Acceptance Criteria
- [ ] Can add a personal expense — appears in list immediately
- [ ] Personal expense is NOT visible to partner by default
- [ ] Personal expense marked visible to partner IS visible to partner (test with 2 accounts)
- [ ] Can edit and delete own personal expense
- [ ] Cannot edit/delete partner's personal expense (policy test)
- [ ] Can add a shared expense — visible to both partners immediately
- [ ] Split slider defaults to 50/50 and updates calculated amounts in real time
- [ ] Split percentages that don't sum to 100 are rejected with validation error
- [ ] Balance calculation is correct: test with several expenses with varied splits
- [ ] Settle up creates a settlement record and resets balance calculation
- [ ] Shared expense edit creates an audit log entry (verify in DB)
- [ ] Shared expense delete soft-deletes (verify deleted_at is set, not hard-deleted)
- [ ] Category icons render for all categories
- [ ] Amount input correctly converts between display (formatted) and storage (cents)
- [ ] Filters work: filter by category, by month
- [ ] Pagination works (create 25+ expenses to test)
- [ ] Empty states render correctly

## Notes
- Currency is always stored as integers (cents). Rp 150,000 = 15000000 cents (IDR has no subdivision — use the smallest unit, or just store the raw IDR value × 100 for consistency with other currencies)
- Decision: For IDR, store the face value × 100 (Rp 150,000 = 15,000,000 in amount_cents). This is consistent with other currencies.
- The SplitSlider is a key UX element — make it intuitive and tactile
- Commit message: `feat: personal expenses, shared expenses, and balance calculator`

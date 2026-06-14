# 10 — Frontend Architecture

---

## Overview

Twogether's frontend is built with **React** (via **Inertia.js**), **shadcn/ui** (pink theme), and organized using **Atomic Design** methodology. The stack is TypeScript-first, component-driven, and designed to be consistent, scalable, and delightful.

---

## Technology Stack

| Tool | Purpose |
|------|---------|
| React 18+ | UI framework |
| Inertia.js | Laravel ↔ React bridge (no separate API) |
| TypeScript | Type safety throughout |
| Tailwind CSS 3 | Utility-first styling |
| shadcn/ui | Base component library (pink theme) |
| Recharts | Chart library (via shadcn chart) |
| Radix UI | Accessible primitives (via shadcn) |
| Lucide React | Icon library |
| React Hook Form | Form state management |
| Zod | Schema validation (frontend) |
| date-fns | Date utilities |
| clsx / cn | Conditional class utilities |

---

## Atomic Design Structure

The component library follows **Atomic Design** — components are organized from smallest to largest, each layer composed of the layer below it.

```
resources/
├── js/
│   ├── app.tsx                       → Inertia bootstrap
│   ├── ssr.tsx                       → SSR entry (if enabled)
│   │
│   ├── types/                        → Global TypeScript types
│   │   ├── index.ts                  → User, Couple, common types
│   │   ├── expenses.ts
│   │   ├── savings.ts
│   │   ├── wedding.ts
│   │   └── inertia.ts                → Inertia shared props types
│   │
│   ├── lib/                          → Utilities
│   │   ├── utils.ts                  → cn(), formatCurrency(), formatDate()
│   │   ├── currency.ts               → Currency formatting helpers
│   │   ├── date.ts                   → Date helpers (countdown calc, etc.)
│   │   └── validation.ts             → Shared Zod schemas
│   │
│   ├── hooks/                        → Custom React hooks
│   │   ├── use-couple.ts             → Access couple from Inertia shared props
│   │   ├── use-currency.ts           → Format amount with couple's currency
│   │   ├── use-countdown.ts          → Wedding countdown calculation
│   │   ├── use-form-errors.ts        → Map Inertia errors to form fields
│   │   └── use-activity.ts           → Activity feed hook
│   │
│   ├── components/                   → ATOMIC DESIGN LAYERS
│   │   │
│   │   ├── atoms/                    → Base building blocks
│   │   │   ├── ui/                   → Re-exported & extended shadcn components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   │
│   │   │   ├── CurrencyAmount.tsx    → Formatted money display
│   │   │   ├── DateDisplay.tsx       → Formatted date display
│   │   │   ├── CategoryIcon.tsx      → Expense category icon
│   │   │   ├── PartnerAvatar.tsx     → Partner avatar with name
│   │   │   ├── ProgressBar.tsx       → Custom branded progress bar
│   │   │   ├── MilestoneMarker.tsx   → Savings milestone dot
│   │   │   └── LoadingSpinner.tsx    → Loading state atom
│   │   │
│   │   ├── molecules/                → Combinations of atoms
│   │   │   ├── FormField.tsx         → Label + Input + Error message
│   │   │   ├── AmountInput.tsx       → Currency prefix + number input
│   │   │   ├── SplitSlider.tsx       → 50/50 split ratio control
│   │   │   ├── DatePicker.tsx        → shadcn Calendar integration
│   │   │   ├── CategorySelect.tsx    → Expense category dropdown
│   │   │   ├── PartnerSelect.tsx     → Select which partner
│   │   │   ├── StatCard.tsx          → Label + Big number + optional trend
│   │   │   ├── GoalCard.tsx          → Savings goal card with progress
│   │   │   ├── ExpenseRow.tsx        → Single expense list item
│   │   │   ├── ContributionRow.tsx   → Single contribution list item
│   │   │   ├── ChecklistRow.tsx      → Single checklist item with checkbox
│   │   │   ├── ActivityItem.tsx      → Single activity feed entry
│   │   │   ├── BalanceBadge.tsx      → "You owe / You're owed" display
│   │   │   ├── MilestoneProgress.tsx → Savings progress with milestones
│   │   │   └── EmptyState.tsx        → Empty state with illustration + CTA
│   │   │
│   │   ├── organisms/                → Complete UI sections
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx       → Desktop sidebar navigation
│   │   │   │   ├── BottomNav.tsx     → Mobile bottom navigation
│   │   │   │   ├── Header.tsx        → Top header bar
│   │   │   │   └── AppShell.tsx      → Full layout wrapper
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── CountdownCard.tsx → Wedding countdown feature card
│   │   │   │   ├── BalanceSummaryCard.tsx
│   │   │   │   ├── SavingsSummaryCard.tsx
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   └── QuickActions.tsx  → Floating action buttons
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   ├── BalancePanel.tsx
│   │   │   │   ├── ExpenseFilters.tsx
│   │   │   │   ├── ExpenseSummaryChart.tsx
│   │   │   │   └── SettleUpPanel.tsx
│   │   │   │
│   │   │   ├── savings/
│   │   │   │   ├── SavingsOverview.tsx
│   │   │   │   ├── ContributionHistory.tsx
│   │   │   │   ├── GoalsGrid.tsx
│   │   │   │   └── GoalDetail.tsx
│   │   │   │
│   │   │   └── wedding/
│   │   │       ├── WeddingHub.tsx
│   │   │       ├── ChecklistPanel.tsx
│   │   │       ├── ChecklistCategoryGroup.tsx
│   │   │       └── ChecklistProgress.tsx
│   │   │
│   │   ├── templates/                → Page layout shells
│   │   │   ├── AuthLayout.tsx        → Centered card layout for auth pages
│   │   │   ├── AppLayout.tsx         → Sidebar + content area
│   │   │   ├── OnboardingLayout.tsx  → Wizard-style layout
│   │   │   └── SettingsLayout.tsx    → Settings sidebar + content
│   │   │
│   │   └── modals/                   → Modal dialogs (overlay layer)
│   │       ├── AddPersonalExpenseModal.tsx
│   │       ├── AddSharedExpenseModal.tsx
│   │       ├── AddContributionModal.tsx
│   │       ├── AddGoalModal.tsx
│   │       ├── AddChecklistItemModal.tsx
│   │       ├── EditExpenseModal.tsx
│   │       ├── SettleUpModal.tsx
│   │       ├── ConfirmDeleteModal.tsx
│   │       └── MilestoneModal.tsx    → Celebration overlay
│   │
│   └── pages/                        → INERTIA PAGE COMPONENTS (top-level)
│       ├── Auth/
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── ForgotPassword.tsx
│       │   └── ResetPassword.tsx
│       ├── Couple/
│       │   ├── AcceptInvitation.tsx
│       │   └── Onboarding.tsx
│       ├── Dashboard.tsx
│       ├── Expenses/
│       │   ├── Personal.tsx
│       │   ├── Shared.tsx
│       │   └── Balance.tsx
│       ├── Savings/
│       │   ├── Overview.tsx
│       │   └── GoalDetail.tsx
│       ├── Wedding/
│       │   ├── Hub.tsx
│       │   └── Checklist.tsx
│       └── Settings/
│           ├── Profile.tsx
│           ├── Couple.tsx
│           ├── Notifications.tsx
│           └── Security.tsx
```

---

## Routing Strategy

Inertia.js handles routing server-side. The React frontend does **not** manage routes independently. Laravel defines all routes and returns the appropriate page component + props via Inertia.

**Client-side navigation:** `router.visit()` and `<Link>` from `@inertiajs/react` trigger Inertia page visits — fetching only the new component + props, not reloading the entire page. This creates SPA-like behavior without client-side route configuration.

**Shared data (global props):** Available on every page via `usePage().props`:
```typescript
interface SharedProps {
  auth: {
    user: User | null;
    couple: Couple | null;
  };
  flash: {
    success?: string;
    error?: string;
  };
  errors: Record<string, string>;
}
```

---

## State Management Strategy

Since Inertia provides page-level props from the server, there is **minimal need for global client state**. The architecture is intentionally simple.

### State Layers

| Layer | Tool | Use |
|-------|------|-----|
| Server state | Inertia props | All data from backend |
| Form state | React Hook Form | Form field values, errors, submission |
| UI state | React useState | Modals open/close, active tabs, filters |
| Shared UI state | React Context (minimal) | Theme, toast system |

### What We DO NOT use
- Redux (overkill for this architecture)
- React Query / SWR (redundant — Inertia handles data fetching)
- Zustand (not needed at this scale)

### Local UI State Examples
- `isModalOpen: boolean` — inside page components
- `activeTab: 'shared' | 'personal'` — tab state
- `filters: FilterState` — local filter state before applying

### Form Handling Pattern
```
1. React Hook Form registers fields
2. Zod schema validates on submit
3. Inertia `useForm` submits to backend
4. Backend returns validation errors OR redirect + flash
5. Inertia automatically maps errors to form fields
```

---

## Component Hierarchy (Atomic Design in Practice)

### Example: Add Shared Expense Modal

```
Modal (AddSharedExpenseModal) [modal layer]
  └── Dialog [shadcn/ui — atom]
        ├── DialogHeader [atom]
        │     └── H3 "Add Shared Expense"
        └── form
              ├── FormField [molecule]
              │     ├── Label "Amount" [atom]
              │     ├── AmountInput [molecule]
              │     │     ├── CurrencyPrefix "Rp" [atom]
              │     │     └── Input (type="number") [atom]
              │     └── error message [atom]
              │
              ├── FormField [molecule]
              │     ├── Label "Category" [atom]
              │     └── CategorySelect [molecule]
              │
              ├── FormField [molecule]
              │     ├── Label "Paid by" [atom]
              │     └── PartnerSelect [molecule]
              │
              ├── SplitSlider [molecule]
              │     ├── Label "How to split" [atom]
              │     ├── Slider [atom]
              │     └── split percentage display [atom]
              │
              └── DialogFooter [atom]
                    ├── Button "Cancel" (ghost) [atom]
                    └── Button "Add Expense" (primary) [atom]
```

---

## Design System Integration

shadcn/ui components are installed locally (not a package dependency) into `components/atoms/ui/`. This means:

1. Components are fully customizable — no version-lock issues
2. Pink theme tokens are applied via CSS variables in `app.css`
3. Tailwind config extends shadcn's design tokens

### CSS Variables (Pink Theme in `app.css`)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 20 14.3% 4.1%;
  --primary: 322.7 73.8% 46.1%;        /* pink-600 equivalent */
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 60 4.8% 95.9%;
  --muted: 60 4.8% 95.9%;
  --accent: 12 6.5% 15.1%;
  --ring: 322.7 73.8% 46.1%;           /* Focus ring = pink */
  --radius: 0.75rem;                    /* 12px base radius */
}
```

---

## Performance Strategy

1. **Inertia partial reloads:** Only reload the data that changed (e.g., after adding an expense, only reload the expense list — not the whole page)
2. **Lazy loading heavy components:** Charts, modals loaded lazily with `React.lazy()`
3. **Skeleton loading states:** Every data-dependent component shows a skeleton while loading
4. **Virtualized lists:** Long expense lists and checklists use windowing (react-virtual) in V1.5
5. **Debounced search/filter:** Filter inputs are debounced 300ms before triggering Inertia reload

---

## TypeScript Type Strategy

All Inertia page props and API response shapes are fully typed. Types are co-located in `types/` and exported centrally.

```typescript
// types/index.ts
export interface User {
  id: number;
  uuid: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  couple_id: number | null;
}

export interface Couple {
  id: number;
  uuid: string;
  name: string;
  partner_a: PartnerSummary;
  partner_b: PartnerSummary | null;
  wedding_date: string | null;
  currency_code: string;
  status: 'pending' | 'active' | 'dissolved';
}

export interface Money {
  amount_cents: number;
  currency_code: string;
  formatted: string;  // Pre-formatted by backend Resource
}
```

All monetary values come from the backend pre-formatted via Laravel Resources, preventing formatting inconsistencies between views.

---

## Responsiveness Strategy

| Breakpoint | Layout |
|-----------|--------|
| `< 640px` | Mobile: Bottom navigation, stacked single-column layout |
| `640–1024px` | Tablet: Collapsible sidebar, 2-column grids |
| `> 1024px` | Desktop: Full sidebar, 3-column grids, richer data views |

Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) are used throughout. The AppShell organism handles the navigation switch between Sidebar (desktop) and BottomNav (mobile).

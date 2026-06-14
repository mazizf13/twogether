# Prompt 10 — Polish, Empty States, Toasts, Loading States & Final QA

## Context
All core features are complete from Prompts 01–09. This final prompt covers the polish layer that separates a good product from a great one: empty states, loading skeletons, toast notifications, global error handling, accessibility improvements, and a complete QA pass.

Read `07-design-system.md` thoroughly before starting — particularly the Empty States and Component States sections.

---

## 1. Toast Notification System

### Setup
Use `shadcn/ui` Sonner or Toaster component. Configure in `AppShell.tsx`:
```tsx
// Add <Toaster position="top-right" richColors expand={false} /> to AppShell
// On mobile: position="bottom-center"
```

### Toast Utility Hook
Create `hooks/use-toast-flash.ts`:
```ts
// Reads Inertia's shared flash props on page load/navigation
// Auto-shows toast for flash.success and flash.error
// Called in AppShell so it runs on every page

// Toast variants:
// success: green icon + message (auto-dismiss 3s)
// error: red icon + message (auto-dismiss 5s)
// info: pink/neutral icon (auto-dismiss 3s)
```

### Toast Triggers (ensure these work throughout the app)
| Action | Toast |
|--------|-------|
| Personal expense added | "Expense logged ✓" |
| Shared expense added | "Shared expense added ✓" |
| Shared expense edited | "Expense updated ✓" |
| Expense deleted | "Expense deleted" |
| Contribution added | "Contribution added! 💰" |
| Goal created | "New goal created ✓" |
| Goal contribution added | "Contribution added ✓" |
| Checklist item added | "Task added ✓" |
| Checklist item completed | "Task complete! ✓" |
| Profile updated | "Profile saved ✓" |
| Couple settings updated | "Settings saved ✓" |
| Password updated | "Password updated ✓" |
| Settlement recorded | "Balance settled ✓" |

---

## 2. Loading Skeletons

Create `atoms/Skeleton*.tsx` components for every major content section.

### `atoms/SkeletonExpenseRow.tsx`
```tsx
// Mimics ExpenseRow layout
// CategoryIcon placeholder (circle, 40px) + 2 text lines + amount placeholder
// Use shadcn Skeleton component with pulse animation
```

### `atoms/SkeletonGoalCard.tsx`
```tsx
// Mimics GoalCard layout
// Icon circle + title line + progress bar placeholder + stats lines
```

### `atoms/SkeletonStatCard.tsx`
```tsx
// Mimics StatCard layout
// Label line + large number placeholder
```

### `atoms/SkeletonChecklistRow.tsx`
```tsx
// Checkbox + text line + badge placeholder
```

### `atoms/SkeletonActivityItem.tsx`
```tsx
// Avatar circle + 2 text lines
```

### Usage Pattern
Every page that loads data shows skeletons while Inertia is navigating:
```tsx
// Use Inertia's useForm loading state OR
// Use CSS: when .inertia-loading class is present on body (Inertia adds this)
// Show skeleton placeholders instead of empty white space
```

---

## 3. Empty States

Create a reusable `molecules/EmptyState.tsx`:
```tsx
// Props: { illustration: ReactNode, title: string, description: string, action?: { label, onClick } }
// Centered layout, max-width 320px
// Illustration: SVG illustrations (create simple, on-brand SVGs for each context)
// Title: H3, neutral-700
// Description: body-small, neutral-500
// Action: pink primary button (optional)
```

### Illustrations needed (simple SVG, on-brand, pink palette)
Create these as React SVG components in `atoms/illustrations/`:

1. **`IllustrationNoExpenses.tsx`** — Simple wallet with a heart
2. **`IllustrationNoSavings.tsx`** — Piggy bank with a tiny coin
3. **`IllustrationNoGoals.tsx`** — Star/target with arrow
4. **`IllustrationNoActivity.tsx`** — Two chat bubbles, empty
5. **`IllustrationWaiting.tsx`** — Two people facing each other with a heart between them (for "waiting for partner")
6. **`IllustrationAllDone.tsx`** — Checkmark in a circle with confetti sparkles

### Empty State Copy (per context)

| Context | Title | Description | Action |
|---------|-------|-------------|--------|
| No personal expenses | "No expenses yet" | "Start tracking your spending to see where your money goes." | "Add Expense" |
| No shared expenses | "Nothing shared yet" | "Add your first shared expense and start planning together." | "Add Shared Expense" |
| No savings contributions | "Start saving together" | "Make your first contribution to your wedding fund." | "Add Contribution" |
| No savings goals | "No goals yet" | "Break your savings into specific goals — venue, honeymoon, rings..." | "Create Goal" |
| No checklist items (impossible normally) | "Your checklist is empty" | "Add your first task to get started." | "Add Task" |
| No activity | "No activity yet" | "Your couple activity will appear here as you start planning." | — |
| Partner not joined | "Waiting for your partner" | "We've sent [email] an invitation. Once they join, your journey begins!" | "Resend invitation" |

---

## 4. Error Handling

### 404 Page (`pages/errors/NotFound.tsx`)
```tsx
// Large "404" in pink gradient text
// "This page doesn't exist"
// Subtext: "It might have been moved or deleted."
// CTA: "← Go Home"
// Branded, warm design — not a scary error page
```

### 500 Page (`pages/errors/ServerError.tsx`)
```tsx
// Icon: a gentle broken heart (SVG)
// "Something went wrong"
// "We're on it — please try again in a moment."
// "Your data is safe." (reassurance for a finance product)
// CTA: "Try again" + "Go Home"
```

### Form Error Global Handler
In the Inertia setup, handle unexpected errors:
```tsx
// If Inertia gets a non-Inertia response (server error during navigation):
// Show a full-page error state instead of a broken blank page
```

### Network Error Toast
```tsx
// If a form submission fails due to network error:
// Show error toast: "Connection lost. Please check your internet and try again."
```

---

## 5. Accessibility Audit

Go through every page and component and verify:

### Focus Management
- [ ] All interactive elements receive visible focus ring (pink outline, 2px offset)
- [ ] Modals: focus moves to first focusable element when opened
- [ ] Modals: focus returns to trigger element when closed
- [ ] Modals: Tab key cycles within modal (focus trap)
- [ ] Modals: Escape key closes modal

### ARIA Labels
- [ ] All icon-only buttons have `aria-label`
- [ ] Form inputs have associated `<label>` elements (not just placeholders)
- [ ] Error messages are linked to inputs via `aria-describedby`
- [ ] Progress bars have `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] The countdown number has `aria-label="X days until your wedding"`
- [ ] Navigation landmark: `<nav>` for sidebar and bottom nav
- [ ] Main content wrapped in `<main>`

### Color Contrast
- [ ] All text on white backgrounds: minimum 4.5:1 contrast ratio
- [ ] Pink-500 on white: verify passes AA for large text (18px+ or 14px+ bold)
- [ ] Pink-600 on white: verify passes AA for body text
- [ ] White text on pink-500 background: verify passes AA

### Keyboard Navigation
- [ ] Can complete the full add expense flow without a mouse
- [ ] Can navigate the checklist and check items with keyboard
- [ ] Can open and close all modals with keyboard

---

## 6. Responsive Design QA

Test at these breakpoints:
- **375px** (iPhone SE) — minimum supported
- **390px** (iPhone 14)
- **768px** (iPad)
- **1024px** (laptop)
- **1280px** (desktop)
- **1440px** (wide desktop)

### Checklist per breakpoint:
- [ ] Navigation switches correctly (bottom nav vs sidebar)
- [ ] Dashboard grid layout correct
- [ ] Modals don't overflow the viewport
- [ ] Cards don't overflow or clip content
- [ ] Amount inputs are large enough to tap on mobile
- [ ] Touch targets are ≥ 44px × 44px
- [ ] SplitSlider is usable on touch devices
- [ ] Date pickers work on mobile

---

## 7. Performance Checklist

- [ ] No N+1 queries on any page (check with Laravel Telescope or Debugbar)
- [ ] Dashboard query count: aim for < 6 queries total
- [ ] Images: all avatars use proper dimensions (not full-size images scaled down in CSS)
- [ ] Recharts only loaded on pages that use charts (lazy load with `React.lazy`)
- [ ] MilestoneModal only rendered when needed (conditional render, not hidden with CSS)
- [ ] Large lists (expenses, contributions) paginate at 20 items

---

## 8. Mobile UX Improvements

### Bottom Sheet Pattern for Modals (Mobile)
On mobile (< 640px), convert Dialog modals to bottom sheets:
```tsx
// Use shadcn Sheet with side="bottom" on mobile
// Full-width, slides up from bottom
// Handle bar at top (drag indicator)
// Rounded top corners only (radius 24px top, 0 bottom)
```

### Pull-to-Refresh
Not needed for MVP — Inertia navigation handles data freshness.

### Quick Actions (Mobile)
The QuickActions component on dashboard should be a sticky row above the bottom nav on mobile:
```tsx
// Fixed position: bottom: 64px (above bottom nav)
// Three pill buttons: "+ Expense" | "+ Savings" | "+ Task"
// Pink-50 background, pink-500 text, rounded-full
// Subtle drop shadow
```

---

## 9. Missing Small Features (Complete These)

### `atoms/PartnerAvatar.tsx`
```tsx
// Shows avatar image or initials fallback
// Props: { user: { display_name, avatar_url }, size: 'xs'|'sm'|'md'|'lg', showName?: boolean }
// Initials avatar: first letter of display_name, pink-500 background, white text
// Tooltip on hover: full display_name
```

### `atoms/DateDisplay.tsx`
```tsx
// Props: { date: string, format?: 'short'|'medium'|'long'|'relative' }
// 'short': "14 Dec" 
// 'medium': "14 December 2025"
// 'long': "Saturday, 14 December 2025"
// 'relative': "2 days ago", "in 3 days", "today"
```

### Inertia Progress Bar
Configure the Inertia progress bar (already set to pink in Prompt 01) to show on page navigation. Verify it's visible during slower navigations.

### `hooks/use-countdown.ts`
```ts
// Takes weddingDate (string | null)
// Returns { days, weeks, months, state, isToday, isPast, isSoon }
// Recalculates at midnight using setInterval
// Used in CountdownCard and WeddingHub
```

---

## 10. Final Integration Testing

### User Journey Test 1: Complete New Couple Flow
1. Register as User A
2. Create couple space, invite User B's email
3. Register as User B, accept invitation
4. Complete onboarding (set wedding date, budget)
5. Verify: checklist seeded, countdown correct, savings fund created

### User Journey Test 2: Expense Tracking
1. Log a personal expense (verify not visible to partner)
2. Log a personal expense with "visible to partner" ON (verify visible)
3. Log a shared expense (50/50 split, User A paid)
4. Log a shared expense (70/30 split, User B paid)
5. Verify balance calculation is correct (manually calculate expected balance)
6. Settle up — verify balance resets

### User Journey Test 3: Savings
1. Add contribution to main fund (Rp 250,000)
2. Add more contributions to reach 25% milestone
3. Verify milestone celebration appears
4. Create a savings goal
5. Add contributions to goal until 100%
6. Verify goal completion celebration

### User Journey Test 4: Checklist
1. View default checklist items (seeded on couple creation)
2. Complete several items — verify checkmarks
3. Add a custom item
4. Filter by "My Tasks"
5. Filter by "Overdue" (set due dates in the past on some items first)

### User Journey Test 5: Settings & Edge Cases
1. Update display name — verify change in sidebar
2. Change wedding date — verify countdown updates
3. Change password — verify new password works
4. Test Leave Couple (with both accounts)
5. Verify: after leaving, cannot access /dashboard or /expenses

---

## Acceptance Criteria
- [ ] All toasts appear correctly for all actions
- [ ] All empty states render with correct copy and CTAs
- [ ] 404 page renders for unknown routes
- [ ] 500 page renders for server errors
- [ ] All modals are keyboard accessible (focus trap, escape close)
- [ ] All interactive elements have visible focus indicators
- [ ] No missing aria-labels on icon-only buttons
- [ ] Product works at 375px viewport width
- [ ] Bottom sheet pattern works on mobile for modals
- [ ] No N+1 queries on dashboard
- [ ] All 5 user journey tests pass end-to-end

## Notes
- This prompt is about quality, not features — take the time to get every detail right
- The empty states and loading states are seen frequently by new users — they set the first impression
- A bug-free, polished MVP is infinitely better than a feature-rich buggy one
- Commit message: `feat: polish layer — empty states, skeletons, toasts, accessibility, and QA`

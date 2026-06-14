# Prompt 07 — Wedding Savings, Goals & Contributions

## Context
Expenses are complete from Prompt 06. Now build the savings system — the most emotionally motivating part of the product.

Read `05-feature-specifications.md` (FEAT-05, FEAT-06), `06-business-rules.md` (Section 6), and `07-design-system.md` before starting. Pay special attention to milestone celebrations.

---

## Backend

### `Services/SavingsService`

```php
class SavingsService
{
    public function getFundSummary(Couple $couple, User $viewingAs): array
        // Returns:
        [
          'total_saved_cents' => int,           // sum of all savings_contributions
          'target_cents' => int|null,            // from savings_fund
          'progress_pct' => float,               // 0-100
          'my_contribution_cents' => int,
          'partner_contribution_cents' => int,
          'my_contribution_pct' => float,
          'partner_contribution_pct' => float,
          'projected_completion_date' => string|null,  // formatted date or null
          'milestones_reached' => int[],         // [25, 50] if those are crossed
        ]

    public function getProjectedCompletionDate(Couple $couple): ?Carbon
        // If < 2 contributions or no target: return null
        // avg_weekly_contribution = total_saved / weeks_since_first_contribution
        // if avg == 0: return null
        // weeks_remaining = (target - total_saved) / avg_weekly_contribution
        // return now()->addWeeks(ceil(weeks_remaining))

    public function checkMilestones(Couple $couple): array
        // Returns array of newly crossed milestones: [25, 50, 75, 100]
        // "Newly crossed" = milestone was not crossed before the latest contribution
        // Store crossed milestones on savings_fund (add milestones_reached JSON column)
        // OR check if total before latest contribution was below threshold and now above

    public function getGoalSummary(SavingsGoal $goal): array
        // Returns:
        [
          'total_saved_cents' => int,         // sum of goal_contributions
          'target_cents' => int,
          'progress_pct' => float,
          'my_contribution_cents' => int,
          'partner_contribution_cents' => int,
          'is_completed' => bool,
          'overdue' => bool,                  // deadline passed and not completed
        ]
}
```

### Controllers

**`Savings/SavingsFundController`**
```
GET /savings
  Props: {
    fund: SavingsFundResource,
    summary: SavingsSummary (from SavingsService),
    contributions: ContributionResource[] (last 10, with contributor info),
    goals: GoalResource[] (active goals with their summaries),
    couple: CoupleResource
  }

POST /savings/fund/target
  Update target_amount_cents on savings_fund
  Validate: target_amount_cents (required, integer, min:1)
  Create savings_fund if doesn't exist
```

**`Savings/ContributionController`**
```
POST /savings/contributions
  Validate:
    amount_cents: required, integer, min:1
    contribution_date: required, date
    notes: nullable, string, max:300
  Create SavingsContribution (couple_id, user_id from auth)
  
  After creation:
    Check milestones via SavingsService::checkMilestones()
    If new milestones crossed: fire SavingsMilestoneReached event(s)
    Log activity: 'savings.contribution.added' with {amount_cents}
  
  Return: redirect back OR Inertia response with updated fund summary

DELETE /savings/contributions/{contribution}
  Policy: owner only, within 24h of creation (MVP: owner only, no time limit)
  Soft delete
  Log activity: 'savings.contribution.deleted'
```

**`Savings/GoalController`**
```
GET /savings/goals
  Props: { goals: GoalResource[] (with summaries), couple: CoupleResource }

POST /savings/goals
  Validate:
    name: required, string, max:200
    target_amount_cents: required, integer, min:1
    deadline: nullable, date
    description: nullable, string
    color: nullable, string, max:20
    icon: nullable, string, max:50
  Create SavingsGoal
  Log activity: 'savings.goal.created'

GET /savings/goals/{goal}
  Policy: same couple
  Props: {
    goal: GoalResource (full detail),
    summary: GoalSummary,
    contributions: GoalContributionResource[] (all, with contributor info)
  }

PUT /savings/goals/{goal}
  Policy: same couple
  Validate same fields
  Business rule: cannot reduce target below amount already saved
    → if new_target < total_saved: return validation error "Target cannot be less than amount already saved (Rp X)"
  Update goal
  Log activity: 'savings.goal.updated'

DELETE /savings/goals/{goal}  (archive, not delete)
  Policy: same couple
  Update status to 'archived'
  Log activity: 'savings.goal.archived'
```

**`Savings/GoalContributionController`**
```
POST /savings/goals/{goal}/contributions
  Validate: amount_cents (required, min:1), contribution_date (required, date), notes (nullable, max:300)
  Create GoalContribution
  
  Check if goal is now completed (total >= target):
    If yes: update goal status to 'completed', completed_at = now()
    Fire GoalCompleted event
  
  Log activity: 'savings.goal.contribution.added' with {goal_name, amount_cents}

DELETE /savings/goals/{goal}/contributions/{contribution}
  Policy: owner only
  Soft delete
  If goal was 'completed' and total after deletion < target: revert to 'active'
```

### Events & Listeners

**`Events/SavingsMilestoneReached`**
```php
// Properties: Couple $couple, int $milestone (25/50/75/100), int $totalSavedCents
```

**`Listeners/NotifyBothPartnersOnMilestone`** (queued)
```
Send in-app notification to both partners
Log activity: 'savings.milestone.reached' with {milestone_pct, total_saved_cents}
```

**`Events/GoalCompleted`**
```php
// Properties: SavingsGoal $goal, Couple $couple
```

---

## React — Molecules

### `molecules/MilestoneProgress.tsx`
```tsx
// Props: { progressPct: number, totalCents: number, targetCents: number|null, currencyCode: string }

// Visual:
// Progress bar (full width, height 16px, rounded-full, pink-500 fill, pink-100 track)
// 4 milestone markers at 25%, 50%, 75%, 100%:
//   Each marker: small diamond shape (◆) positioned at correct % along the bar
//   Color: pink-500 if reached (progressPct >= marker), neutral-300 if not
//   On hover: tooltip showing milestone % and amount

// Below bar:
//   Left: "Rp X,XXX,XXX saved" (pink-600, font-semibold)
//   Right: "Rp X,XXX,XXX remaining" (neutral-500) OR "Goal reached! 🎉" if 100%

// If no target: show bar without markers, just "Rp X saved so far"
```

### `atoms/MilestoneModal.tsx` (Celebration Overlay)
```tsx
// Full-screen celebration modal for milestone events
// Props: { milestone: 25|50|75|100, totalCents: number, currencyCode: string, onClose }

// Design:
// Dark overlay with confetti/sparkle animation (CSS-only or simple canvas)
// Large centered card (white, rounded-3xl, shadow-xl):
//   Large emoji/illustration: 🎉 or 💍 or 🎊
//   Heading: based on milestone:
//     25% → "You're on your way! 🌟"
//     50% → "Halfway there! 🎊"  
//     75% → "Almost there! 💫"
//     100% → "You did it! 🎉"
//   Subtext: "You've saved [X]% of your wedding fund — Rp X,XXX,XXX"
//   Pink primary button: "Keep going! →"

// Auto-show when milestone prop changes (triggered by contribution response)
// Can be dismissed
```

### `molecules/GoalCard.tsx`
```tsx
// Props: { goal: SavingsGoal & GoalSummary, currencyCode, onContribute, onEdit }

// Card with:
// Top: Goal icon (or emoji) + goal name + status badge ('Active'|'Completed'|'Overdue')
// Middle: Progress bar (compact, height 8px)
//   Rp X saved / Rp Y target
//   Progress %
// Bottom: 
//   Deadline chip (if set): "Due [date]" — red if overdue
//   Contributor avatars (small, stacked — show both partners if both contributed)
//   "+ Contribute" button (ghost/outline, small)

// Completed state: full pink card, white text, checkmark icon, confetti dots
// Archived state: muted/grayed out
// Click on card → navigate to goal detail page
```

### `molecules/ContributionRow.tsx`
```tsx
// Props: { contribution, partnerName, currencyCode, canDelete, onDelete }
// Layout: Avatar + Name | Date + Note | Amount + delete button (if canDelete)
// Subtle separator between rows
// Delete button: only shown for own contributions (small trash icon, danger color)
```

---

## React — Modals

### `modals/AddContributionModal.tsx`
```tsx
// Title: "Add to Wedding Savings"
// Partner avatar + name shown at top ("Saving as [Name]")
// Fields:
//   Amount (AmountInput)
//   Date (date picker, default today)
//   Note (optional text, placeholder: "Bonus from work 💪")
// Shows current progress and what it will be after this contribution:
//   "After this contribution: [X]% saved" (animated update as amount changes)
// Submit: "Add Contribution" (pink primary)
```

### `modals/AddGoalModal.tsx`
```tsx
// Title: "New Savings Goal"
// Fields:
//   Goal name (text, placeholder: "Venue Deposit", "Honeymoon", "Wedding Rings...")
//     Show quick-pick suggestion chips below: [Venue] [Honeymoon] [Rings] [Photography] [Catering]
//     Clicking a chip fills the name
//   Target amount (AmountInput)
//   Deadline (date picker, optional)
//   Description/notes (optional textarea)
//   Color selection (optional — 6 color swatches: pink shades + neutral)
// Submit: "Create Goal"
```

### `modals/AddGoalContributionModal.tsx`
```tsx
// Similar to AddContributionModal but:
// Title: "Add to [Goal Name]"
// Shows goal progress at top (compact progress bar)
// Shows "After this: [X]% complete"
// If this contribution completes the goal: show "🎉 This will complete your goal!"
```

---

## React — Pages

### `pages/Savings/Overview.tsx`
```tsx
// AppShell wrapper
// Tabs: "Overview" (active) | "Goals"

// Section 1 — Fund Overview (full-width card)
//   Large total: "Rp X,XXX,XXX saved"
//   MilestoneProgress bar
//   Projected completion date (if calculable)
//   "+ Add Contribution" button (pink, prominent)
//   Partner contribution breakdown:
//     Two rows: [Avatar] [Name]: Rp X (X%)

// Section 2 — Recent Contributions
//   Last 10 contributions, ContributionRow for each
//   "No contributions yet — be the first to save!" empty state

// Modals: AddContributionModal, MilestoneModal (auto-shown on milestone)
// Listen for 'milestone_reached' in Inertia flash data to trigger MilestoneModal
```

### `pages/Savings/Goals.tsx` (sub-route via tabs on savings page)
```tsx
// Tab "Goals" active
// "+ New Goal" button (top right)
// Grid of GoalCards (2 columns on md+, 1 column mobile)
// Active goals first, then completed, then archived (with "Archived" section separator)
// Each card: GoalCard molecule with onContribute → AddGoalContributionModal
// Empty state: "No goals yet — create your first savings goal!"
// Modals: AddGoalModal, AddGoalContributionModal
```

### `pages/Savings/GoalDetail.tsx`
```tsx
// Full page for a single goal
// Back link: "← All Goals"
// Hero card: Goal name + icon + large progress (MilestoneProgress variant)
// Stats row: Total saved | Target | Remaining | Days to deadline
// "+ Add Contribution" button
// Contribution history: Full list of all contributions (ContributionRow)
//   Grouped by month
//   Both partners' contributions shown, interleaved chronologically
// Edit/Archive actions (⋮ menu top right of page)
```

---

## Acceptance Criteria
- [ ] Can add a contribution — savings total updates immediately
- [ ] Milestone celebration modal appears when 25%, 50%, 75%, 100% is first crossed
- [ ] Milestone modal does NOT re-appear after being dismissed (milestone already crossed)
- [ ] Partner contributions shown with correct percentages
- [ ] Projected completion date shown and updates with new contributions
- [ ] Can create a savings goal with all optional fields
- [ ] Quick-pick goal name chips fill the name field
- [ ] Goal progress bar animates on contribution
- [ ] Goal completion triggers "Goal Complete!" celebration state on the card
- [ ] Reducing goal target below saved amount is blocked with clear error
- [ ] Goal contribution history shows both partners' contributions in chronological order
- [ ] Archiving a goal moves it to archived section (not deleted)
- [ ] Goal detail page renders correctly with full history
- [ ] Amount input on AddContributionModal shows live progress update as amount is typed
- [ ] Deleting a contribution that caused goal completion reverts goal to 'active'

## Notes
- Milestone celebrations are the single most important emotional moment in the savings feature — they must feel GREAT
- The MilestoneModal should be shown only once per milestone crossing — store which milestones have been seen in the flash response or in local component state
- Commit message: `feat: wedding savings fund, goals, contributions, and milestone celebrations`

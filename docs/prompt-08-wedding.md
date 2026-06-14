# Prompt 08 — Wedding Countdown & Checklist

## Context
Savings system is complete from Prompt 07. Now build the Wedding section — the countdown and the preparation checklist.

Read `05-feature-specifications.md` (FEAT-07, FEAT-08), `06-business-rules.md` (Section 7), and `03-user-flows.md` (Flow 06) before starting.

---

## Backend

### `Wedding/ChecklistController`

```
GET  /wedding
  Props: {
    couple: CoupleResource,
    countdown: CountdownResource,
    checklist_summary: { total, completed, overdue, pct, by_category: CategorySummary[] }
  }

GET  /wedding/checklist
  Props: {
    couple: CoupleResource,
    countdown: CountdownResource,
    items: ChecklistItemResource[] (all non-deleted, grouped by category in backend),
    categories: string[],                // unique categories for filter
    filters: { status, assigned_to, category }
  }
  Apply filters from query params

POST /wedding/checklist
  Validate:
    title: required, string, max:300
    category: required, string, max:100
    assigned_to: required, in:['partner_a', 'partner_b', 'both']
    due_date: nullable, date
    description: nullable, string
  Create ChecklistItem (couple_id, created_by_id from auth, is_system_default: false)
  Auto sort_order: max current + 1
  Log activity: 'checklist.item.created'

PUT  /wedding/checklist/{item}
  Policy: same couple
  Validate same fields as POST
  Allow updating status: in:['todo', 'done']
  If status changing to 'done': set completed_by_id, completed_at
  If status changing to 'todo': clear completed_by_id, completed_at
  Log activity: 'checklist.item.completed' (only if status → done)
  
  Check if all items are now complete:
    If count(todo) == 0: fire AllChecklistItemsCompleted event (V1.5)

DELETE /wedding/checklist/{item}
  Policy: same couple
  Soft delete
```

### `Resources/CountdownResource`
```php
public static function make(?Carbon $weddingDate): array
{
    if (!$weddingDate) {
        return ['days' => null, 'date_formatted' => null, 'state' => 'no_date'];
    }
    
    $today = Carbon::today();
    $days = $today->diffInDays($weddingDate, false); // negative if past
    
    return [
        'days' => abs((int) $days),
        'weeks' => (int) abs($today->diffInWeeks($weddingDate)),
        'months' => (int) abs($today->diffInMonths($weddingDate)),
        'date_formatted' => $weddingDate->format('l, d F Y'),
        'date_iso' => $weddingDate->format('Y-m-d'),
        'state' => match(true) {
            $days > 0 => 'upcoming',
            $days == 0 => 'today',
            default => 'past',
        },
        'is_soon' => $days > 0 && $days <= 30,  // within 30 days
    ];
}
```

### `Resources/ChecklistItemResource`
```php
// Returns per item:
[
  'id' => ..., 'uuid' => ...,
  'title' => ...,
  'category' => ...,
  'description' => ...,
  'assigned_to' => ...,      // 'partner_a' | 'partner_b' | 'both'
  'assigned_to_label' => ..., // Human-readable: "Reza", "Dinda", "Both"
  'due_date' => ...,
  'due_date_formatted' => ...,
  'status' => ...,           // 'todo' | 'done'
  'is_overdue' => ...,       // due_date < today && status == 'todo'
  'completed_by' => ...,     // { display_name, avatar_url } | null
  'completed_at' => ...,
  'is_system_default' => ...,
  'can_delete' => ...,       // both partners can delete any item
]
```

### Grouping logic (in Controller)
```php
// Group checklist items by category in PHP before returning as props
// Structure: [{ category: string, items: ChecklistItemResource[], completed_count, total_count }]
// Sort categories: Planning first, then alphabetical
// Within each category: todo items first (sorted by due_date asc, nulls last), then done items
```

---

## React — Molecules

### `molecules/ChecklistRow.tsx`
```tsx
// Props: { item: ChecklistItem, couple: Couple, onToggle, onEdit, onDelete }

// Layout:
// [Checkbox] [CategoryIcon tiny] [Title] ... [Assigned badge] [Due date] [⋮ menu]

// Checkbox: shadcn Checkbox, pink accent when checked
// Title: 
//   - Todo: neutral-800, font-medium
//   - Done: neutral-400, line-through, italic
// Assigned badge: 
//   - "Both" → neutral badge
//   - Partner name → colored badge (partner A: pink, partner B: rose)
// Due date chip:
//   - Future: neutral-500, small
//   - Overdue (todo): danger-text background, red text, warning icon
//   - Completed: hidden
// ⋮ menu (kebab): Edit | Delete
// Transition: smooth strikethrough animation on completion (CSS transition)
// Hover: subtle pink-50 background on the row
```

### `molecules/ChecklistCategoryGroup.tsx`
```tsx
// Props: { category: string, items: ChecklistItem[], completedCount, totalCount, onItemToggle, onItemEdit, onItemDelete }

// Category header:
//   Category name (H4, font-semibold) + completion badge "[X/Y]"
//   If all done: "✓ All done!" badge (green)
//   Collapse/expand toggle (chevron)

// Items list below (collapsible with animation)
// Section has subtle top border separator
```

### `organisms/wedding/ChecklistProgress.tsx`
```tsx
// Props: { total, completed, overdue, pct }

// Donut chart (SVG-based, not Recharts — simpler):
//   Outer ring: completed (pink-500), remaining (pink-100)
//   Center: "{pct}%", subtitle: "complete"
// Right of donut:
//   "[completed] of [total] tasks done"
//   If overdue > 0: amber badge "⚠ [overdue] overdue"
//   If pct == 100: "🎉 All tasks complete!" (green, celebratory)
```

---

## React — Modals

### `modals/AddChecklistItemModal.tsx`
```tsx
// Title: "Add Task"
// Fields:
//   Task name (text, required, placeholder: "What needs to be done?")
//   Category (select with existing categories + "Add new category" option)
//     Existing: Planning, Venue, Catering, Attire, Photography, Invitations, 
//               Music, Legal, Honeymoon, Decorations, Guests, Ceremony, Other
//   Assign to (radio buttons with avatars):
//     [PartnerA avatar] [PartnerA name] | [PartnerB avatar] [PartnerB name] | [Both icon] Both
//   Due date (date picker, optional)
//   Notes (optional textarea)
// Footer: Cancel | Add Task

// Category with "Add new category": shows a small inline text input
```

### `modals/EditChecklistItemModal.tsx`
```tsx
// Same as Add but:
// Title: "Edit Task"
// All fields pre-filled
// Additional: Status toggle (Mark as done / Mark as to-do)
// If completed: show "Completed by [Name] on [date]" info line
```

---

## React — Pages

### `pages/Wedding/Hub.tsx`

The wedding overview page. Emotionally the most important page after the dashboard.

```tsx
// AppShell wrapper
// Large CountdownCard (reuse from dashboard, but larger/more prominent variant)
// 
// Below the countdown:
//   Two columns (desktop) / stacked (mobile):
//   
//   Left column:
//     "Your Checklist" summary card:
//       ChecklistProgress donut component
//       Category breakdown: each category name + mini progress bar
//       "View Full Checklist →" button
//   
//   Right column:
//     "Wedding Savings" summary (compact version of savings overview)
//     Shows: total saved, progress, link to savings
//     "+ Add Contribution" quick action
//
// Design notes:
//   Pink gradient header section with CountdownCard floating over it
//   White card sections below
//   Should feel like a personal wedding planning dashboard
```

### `pages/Wedding/Checklist.tsx`

```tsx
// AppShell wrapper
// Header: "Wedding Checklist" + ChecklistProgress component (compact)
// 
// Toolbar:
//   Filter tabs (shadcn Tabs, pill variant):
//     All | To Do | Completed | Overdue | My Tasks
//   Category filter (select dropdown — "All categories" default)
//   "+ Add Task" button (pink primary)
//
// Main content:
//   ChecklistCategoryGroups — one per category
//   Each group: ChecklistCategoryGroup molecule
//   
// Empty states:
//   No tasks at all: Should not happen (default template), but handle gracefully
//   No tasks matching filter: "No tasks match your filters. [Clear filters]"
//   All completed (pct == 100):
//     Full celebration state: 🎉
//     Large "Everything's ready!" heading
//     "Your wedding checklist is complete. You're all set!" 
//     Keep the list visible below (strikethrough completed items)
//
// Modals: AddChecklistItemModal, EditChecklistItemModal, ConfirmDeleteModal
//
// Real-time feel: When one partner completes an item, the other partner's view 
//   updates on next page visit (MVP) — Inertia router.reload() after actions
```

---

## Checklist All-Complete Celebration

When all items are checked:
```tsx
// Full-width celebration banner at top of checklist page:
// Pink gradient background
// "🎉 Your checklist is complete! Everything is ready for your big day!"
// Animated confetti (CSS keyframes, brief)
// Subtext: "You've prepared [X] tasks together. See you at the altar! 💍"
```

---

## Acceptance Criteria
- [ ] Countdown shows correct days for an upcoming date
- [ ] Countdown shows "Today is the day!" when date is today
- [ ] Countdown shows "You're married! 🎉" when date is in the past
- [ ] Countdown updates without page reload each day (via `useEffect` + date recalculation)
- [ ] No wedding date set → "Set your wedding date" prompt shown with link to settings
- [ ] Default checklist items are present after couple creation (from Prompt 04)
- [ ] Both partners can check any item
- [ ] Completed item gets strikethrough animation
- [ ] Overdue items (past due_date, not done) highlighted in red/amber
- [ ] Filters work: "My Tasks" shows only items assigned to auth user or "Both"
- [ ] "Overdue" filter shows only overdue items
- [ ] Category groups show correct [X/Y] completion count
- [ ] Adding a custom item appears immediately in the correct category
- [ ] Deleting a system default item removes it (soft delete)
- [ ] 100% complete celebration banner shown correctly
- [ ] Wedding Hub page renders countdown + checklist summary + savings summary
- [ ] ChecklistProgress donut renders correctly at 0%, 50%, and 100%

## Notes
- The ChecklistRow transitions (strikethrough on complete) are important for the tactile feel
- Checklist category groups should be collapsible — this improves usability on large lists
- The "My Tasks" filter is important for the assigned-partner flow
- Commit message: `feat: wedding countdown and preparation checklist`

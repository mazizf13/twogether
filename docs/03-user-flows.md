# 03 — User Flows

---

## Overview

This document maps every primary user journey in Twogether. Flows are described step-by-step with branching paths, edge cases, and decision points noted. Each flow is written from the user's perspective.

---

## Flow 01: Registration

**Actor:** New user (no account yet)  
**Entry Point:** Landing page or direct URL

### Happy Path
1. User arrives at `/register`
2. User sees a registration form: Display Name, Email, Password, Confirm Password
3. User fills out the form
4. User clicks "Create Account"
5. System validates: email format, password length (min 8), passwords match, email not already registered
6. System creates the user account
7. System sends a welcome email (async)
8. User is redirected to `/onboarding` (no couple space yet)

### Branching Paths
- **Email already registered:** Inline error shown — "An account with this email already exists. [Log in instead?]"
- **Validation errors:** Inline field errors appear without page reload (Inertia)
- **User arrived via invitation link:** Skip to Flow 02 (Couple Invitation — invited path)

### Post-Registration State
- User is authenticated
- User has no Couple Space
- User sees onboarding wizard

---

## Flow 02: Couple Invitation

This flow has two actors: the **Initiating Partner** (already has an account) and the **Invited Partner** (may or may not have an account).

### 02A: Initiating Partner Sends Invitation

1. Initiating partner is logged in, has no active couple
2. System shows prompt: "Start your couple space — invite your partner"
3. Partner enters the invited person's email address
4. Partner clicks "Send Invitation"
5. System generates a unique, time-limited invitation token (expires in 72 hours)
6. System sends invitation email to the entered address
7. System shows confirmation: "Invitation sent to [email]. We'll let you know when they join!"
8. Initiating partner is redirected to a "Waiting Room" state — a minimal dashboard with countdown visible but other features locked/dimmed with a message: "Waiting for [name/email] to join..."

### 02B: Invited Partner Accepts (Has No Account)

1. Invited partner receives email: "[Name] has invited you to plan your wedding together on Twogether"
2. Partner clicks CTA button in email
3. Partner is taken to `/invite/{token}` — a branded acceptance page showing the inviter's name and a brief explanation
4. Partner clicks "Create Account & Join"
5. Partner fills in: Display Name, Password, Confirm Password (email is pre-filled from token)
6. Partner submits
7. System creates account, links to couple space, marks invitation as accepted
8. Both partners are now in the same Couple Space
9. Invited partner is taken to couple onboarding (Flow 03)
10. Initiating partner's "waiting room" updates in real time (or on next load) to the full dashboard

### 02C: Invited Partner Accepts (Already Has Account)

1. Invited partner clicks link in email
2. System detects they already have an account
3. Partner is prompted to log in (or is already logged in)
4. After login, system shows acceptance confirmation screen
5. Partner clicks "Join Couple Space"
6. Both partners are linked

### Edge Cases
- **Token expired (>72 hours):** Invited partner sees an "Invitation expired" page with option to ask for a new one
- **Token already used:** Show "This invitation has already been accepted"
- **Invited partner already in a couple:** Show an error — they must leave their current couple before joining another
- **Inviter sends to wrong email:** Inviter can cancel and resend from settings

---

## Flow 03: Couple Onboarding

**Actor:** Both partners (may complete separately or together)  
**Trigger:** First time both partners are in the Couple Space

### Onboarding Wizard (4 Steps)

**Step 1: Couple Identity**
1. Prompt: "Tell us about your couple"
2. Fields: Partner 1 name (pre-filled), Partner 2 name (pre-filled from invitation)
3. Optional: Upload couple photo or choose a default avatar
4. Optional: Set a couple nickname / "Space Name" (e.g., "Reza & Dinda's Journey")

**Step 2: Wedding Date**
1. Prompt: "When is your wedding?"
2. Date picker for wedding date
3. Option: "We haven't decided yet — skip for now"
4. If date set: system shows a preview of the countdown ("Your wedding is in 347 days!")

**Step 3: Wedding Budget**
1. Prompt: "Do you have a total wedding budget in mind?"
2. Currency selector (defaults to local currency)
3. Amount input (optional — can skip)
4. If entered: shown on dashboard as the savings target baseline

**Step 4: Ready**
1. Summary screen: "Your couple space is ready!"
2. Brief feature highlights (3 cards: Track Expenses, Save Together, Plan Your Wedding)
3. CTA: "Go to Dashboard"

### Onboarding Completion
- Couple Space is fully active
- Wedding countdown is live (if date set)
- Default checklist is populated
- Dashboard is loaded for the first time

---

## Flow 04: Expense Tracking

### 04A: Log a Personal Expense

1. User navigates to "My Expenses" or taps the "+" quick-add button
2. User selects "Personal Expense"
3. Form fields: Amount, Category (dropdown), Description (optional), Date (defaults to today), Visible to partner? (toggle, default OFF)
4. User submits
5. System saves the expense
6. User sees the expense appear in their list immediately
7. Optional: success toast "Expense logged ✓"

### 04B: Log a Shared Expense

1. User taps "+" or goes to "Shared Expenses"
2. User selects "Shared Expense"
3. Form fields: Amount, Category, Description (optional), Date, Paid by (dropdown: Me / Partner), Split (50/50 default, adjustable slider or custom input)
4. User submits
5. System saves and recalculates the balance between partners
6. Both partners can see the new expense immediately
7. The partner who didn't log it may receive a notification (configurable)

### 04C: View & Filter Expenses

1. User goes to Expenses page
2. Default view: current month, all categories
3. Filters available: Date range, Category, Added by (shared expenses)
4. Sort options: Date (default), Amount
5. Each expense row shows: amount, category icon, description, date, who paid (shared)
6. Tapping an expense opens detail view with edit/delete options

---

## Flow 05: Savings Contribution

### 05A: Add a Contribution to Overall Wedding Savings

1. User goes to "Savings" section
2. User taps "Add Contribution"
3. Form: Amount, Date (default today), Note (optional)
4. Submit
5. System adds to total and recalculates partner percentages
6. Progress bar animates to new level
7. If milestone reached (25%, 50%, 75%, 100%): celebration animation shown to both partners

### 05B: Contribute to a Specific Goal

1. User goes to "Savings" → "Goals"
2. User selects a goal card (e.g., "Venue Deposit")
3. User taps "Add Contribution"
4. Form: Amount, Date, Note
5. Submit
6. Goal progress bar updates
7. If goal is 100% funded: "Goal Complete!" celebration state shown

### 05C: Create a New Savings Goal

1. User taps "New Goal" in the Goals section
2. Form: Goal Name, Target Amount, Deadline (optional), Description/notes (optional), Icon or color selection
3. Submit
4. New goal card appears in the goals grid
5. Goal starts at 0% progress

---

## Flow 06: Wedding Planning (Checklist)

### 06A: View Checklist

1. User navigates to "Wedding" section
2. Checklist shows all items grouped by category
3. Each item shows: title, assigned partner(s), due date (if set), status
4. Completion percentage bar at top
5. Filter tabs: All, To Do, Completed, Overdue, My Tasks

### 06B: Complete a Checklist Item

1. User finds a task in the list
2. User taps the checkbox next to the item
3. Item is marked complete with a visual strikethrough and checkmark
4. If this completes a category: category shows "All done!" state
5. Overall percentage bar updates

### 06C: Add a Custom Checklist Item

1. User taps "Add Task" button
2. Form: Task Name, Category (dropdown), Assigned To (Me / Partner / Both), Due Date (optional), Notes (optional)
3. Submit
4. Task appears in the checklist immediately in the correct category

### 06D: Edit a Checklist Item

1. User taps on an existing task to open detail view
2. User edits any field
3. Submit
4. Changes reflected immediately

---

## Flow 07: Goal Management

### 07A: Edit a Savings Goal

1. User opens a goal card
2. Taps "Edit Goal"
3. Can modify: name, target amount, deadline, notes
4. Cannot reduce target below amount already saved (with warning if attempted)
5. Submit → changes reflected immediately

### 07B: Archive a Goal

1. User opens a goal card
2. Taps "..." menu → "Archive Goal"
3. Confirmation dialog: "Are you sure? This goal will be hidden but not deleted."
4. Confirm → goal moves to "Archived Goals" section

### 07C: View Goal History

1. User opens a goal
2. Scrolls to "Contribution History" section
3. Shows chronological list: date, contributor name, amount, note
4. Both partners' contributions shown together

---

## Flow 08: Settings & Profile

### 08A: Update Personal Profile

1. User goes to Settings → Profile
2. Can edit: Display name, avatar, notification preferences
3. Save → changes reflected in couple space

### 08B: Change Wedding Date

1. Settings → Couple Settings → Wedding Date
2. Date picker
3. Both partners notified of the change (if changed by one partner)
4. Countdown updates immediately

### 08C: Leave Couple Space

1. Settings → Danger Zone → Leave Couple Space
2. Warning shown: "Leaving will remove you from this couple space. Shared data will remain accessible to your partner."
3. Confirmation required (type "LEAVE" or similar)
4. User is removed from couple space
5. Their personal expenses remain private to them
6. Shared expenses and savings remain in the couple space (accessible to remaining partner)

---

## Flow State Summary

| Flow | Auth Required | Couple Required | Both Partners Required |
|------|-------------|----------------|----------------------|
| Registration | No | No | No |
| Send Invitation | Yes | No | No |
| Accept Invitation | Partial | No | No |
| Onboarding | Yes | Yes | No (async) |
| Log Personal Expense | Yes | No | No |
| Log Shared Expense | Yes | Yes | No |
| Add Savings Contribution | Yes | Yes | No |
| Manage Goals | Yes | Yes | No |
| Checklist | Yes | Yes | No |
| View Partner Data | Yes | Yes | N/A |

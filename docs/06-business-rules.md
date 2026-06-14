# 06 — Business Rules

---

## Overview

This document defines the operational rules that govern how data is owned, accessed, shared, calculated, and protected in Twogether. These rules must be enforced at both the application layer and the database layer where possible.

---

## 1. Couple Membership Rules

### BR-CM-01: Single Active Couple
A user may belong to **at most one active Couple Space** at any given time.

### BR-CM-02: Couple Composition
A Couple Space consists of **exactly two members**: Partner A (creator/inviter) and Partner B (invitee). No more, no fewer.

### BR-CM-03: Self-Invitation
A user cannot send an invitation to their own email address.

### BR-CM-04: Invitation to Coupled User
If a user who already belongs to an active Couple Space receives an invitation, they cannot accept it without first leaving their current space.

### BR-CM-05: Invitation Expiry
Couple invitations expire **72 hours** after creation. An expired token cannot be accepted. The inviter may generate a new invitation.

### BR-CM-06: Invitation Uniqueness
Only one pending invitation per Couple Space is active at a time. Sending a new invitation invalidates the previous one.

### BR-CM-07: Leaving a Couple Space
Either partner may leave a Couple Space at any time. Upon leaving:
- The departing user's account is dissociated from the Couple Space
- The Couple Space enters a "dissolved" state
- All shared data (shared expenses, savings, goals, checklist) remains in the database but is accessible only to the remaining partner
- The departing user's personal expenses remain private to them
- Neither partner can re-join the same dissolved Couple Space — a new one must be created

### BR-CM-08: Dissolved Couple Space
A dissolved couple space cannot be reactivated. A former partner who wishes to plan together again must create a new Couple Space.

---

## 2. Visibility Rules

### BR-VIS-01: Personal Expenses — Default Private
Personal expenses are **private to the owner by default**. The partner cannot see them unless explicitly shared.

### BR-VIS-02: Personal Expenses — Optional Sharing
A user may mark any personal expense as **visible to partner**. Once marked visible:
- The partner can view (not edit, not delete) the expense
- The owner may revoke visibility at any time (the expense disappears from partner's view)

### BR-VIS-03: Shared Expenses — Always Visible to Both
All shared expenses are **immediately visible to both partners** upon creation. There is no private shared expense.

### BR-VIS-04: Savings Contributions — Always Visible to Both
All contributions to Wedding Savings or individual Goals are visible to both partners with the contributor's name shown.

### BR-VIS-05: Checklist — Always Visible to Both
All checklist items and their statuses are visible to both partners.

### BR-VIS-06: Activity Feed — Couple-Scoped
The activity feed shows all actions taken by either partner within the Couple Space. Neither partner can hide their activity from the feed (actions are automatically logged).

---

## 3. Ownership & Edit Rules

### BR-OWN-01: Personal Expense Ownership
Only the **owner** of a personal expense may edit or delete it.

### BR-OWN-02: Shared Expense Editability
**Either partner** may edit or delete a shared expense. All edits are recorded in the audit trail with the editor's identity and timestamp.

### BR-OWN-03: Savings Contribution Ownership
A savings contribution may only be **edited by the partner who created it**, and only within a reasonable window (TBD: 24 hours post-creation in V1, with admin override in future versions).

### BR-OWN-04: Savings Goal Ownership
**Either partner** may create, edit, or archive a savings goal.

### BR-OWN-05: Checklist Item Ownership
**Either partner** may create, edit, complete, or delete a checklist item regardless of who created it.

### BR-OWN-06: Couple Settings
**Either partner** may update couple-level settings (wedding date, couple name). Changes by either partner are reflected for both. Significant changes (wedding date change) should log to the activity feed.

---

## 4. Privacy Rules

### BR-PRIV-01: Inter-Couple Isolation
Data from one Couple Space is **never accessible** to users in another Couple Space. All queries must be scoped by couple_id.

### BR-PRIV-02: Unauthenticated Access
No couple data is accessible to unauthenticated users under any circumstances.

### BR-PRIV-03: Post-Dissolution Access
After a Couple Space is dissolved:
- The remaining partner retains access to all shared data
- The departed partner loses access to all shared data immediately
- The departed partner retains access to their own personal expenses

### BR-PRIV-04: Personal Expense Isolation
Even within a Couple Space, personal expenses are not aggregated or surfaced in couple-level reports unless the owner has marked them visible.

---

## 5. Shared Expense Calculation Rules

### BR-EXP-01: Split Ratio Validation
The sum of split ratios for a shared expense must equal exactly 100%. The system enforces this and prevents submission if not met.

### BR-EXP-02: Balance Calculation
The couple's running balance is calculated as:

```
For each shared expense:
  Partner_A_owes += (expense.amount × expense.split_ratio_A) - (paid_by_A ? expense.amount : 0)
  Partner_B_owes += (expense.amount × expense.split_ratio_B) - (paid_by_B ? expense.amount : 0)

Net Balance = Partner_A_owes - Partner_B_owes
```

If `Net Balance > 0`: Partner A owes Partner B  
If `Net Balance < 0`: Partner B owes Partner A  
If `Net Balance = 0`: Balanced

### BR-EXP-03: Settlement
When partners settle up, a **settlement record** is created (amount, date, who paid whom). This does not delete expenses — it creates a "balance reset point." Future balance calculations start from the settlement date forward.

### BR-EXP-04: Editing Impact on Balance
Editing a shared expense recalculates the balance in real time. The previous state is preserved in the audit log.

### BR-EXP-05: Currency
At MVP, all amounts are stored in a single currency (configurable per couple). Currency conversion is not performed.

---

## 6. Savings Calculation Rules

### BR-SAV-01: Total Saved
Total savings = sum of all contribution amounts for the couple's savings fund.

### BR-SAV-02: Partner Contribution Percentage
```
Partner_A_percentage = (sum of Partner A contributions / total saved) × 100
Partner_B_percentage = 100 - Partner_A_percentage
```

### BR-SAV-03: Progress Percentage
```
Progress = (total saved / savings target) × 100
```
Capped at 100% for display purposes (over-saving is allowed but the bar doesn't exceed 100%).

### BR-SAV-04: Projected Completion Date
```
Average weekly contribution = total saved / weeks since first contribution
Weeks remaining = (target - total saved) / average weekly contribution
Projected date = today + weeks remaining
```
Only shown when: at least 2 contributions exist AND savings target is set.

### BR-SAV-05: Goal Contribution Independence
Contributions to individual Goals do **not** count toward the overall Wedding Savings total and vice versa. They are separate pools. (Design decision: this prevents confusion about double-counting.)

### BR-SAV-06: Milestone Triggers
Milestone celebrations trigger **once** when the threshold is first crossed. If total savings drop below a milestone (e.g., a contribution is deleted), the milestone is not re-triggered when the threshold is crossed again.

---

## 7. Checklist Rules

### BR-CHK-01: Default Template
On couple activation (both partners joined), the system inserts the default checklist template items for the couple. These are regular editable items — not locked.

### BR-CHK-02: Completion Status
A checklist item is either "To Do" or "Done". Either partner can change the status of any item in either direction (un-completing an item is allowed).

### BR-CHK-03: Overdue Detection
An item is overdue when: status = "To Do" AND due_date < today.

### BR-CHK-04: Completion Percentage
```
Completion % = (count of "Done" items / total items) × 100
```

### BR-CHK-05: Custom Items
Custom items added by the couple are identical in behavior to default template items.

---

## 8. Notification Rules

### BR-NOT-01: Notification Consent
Users receive only notifications they have opted into. Default opt-in state is determined during onboarding (MVP: all enabled by default).

### BR-NOT-02: Self-Action Suppression
Users do not receive notifications for their own actions. (You log an expense → your partner gets notified, not you.)

### BR-NOT-03: Dissolved Couple
No notifications are sent between partners after a Couple Space is dissolved.

---

## 9. Data Retention Rules

### BR-RET-01: Personal Expenses
Personal expenses belong to the user and are retained indefinitely, even after leaving a couple. They are never accessible to a former partner.

### BR-RET-02: Shared Data
Shared expenses, savings, goals, and checklist items are retained in the database and remain accessible to the remaining partner after one partner leaves.

### BR-RET-03: Account Deletion (Future)
V2 will implement account deletion. Upon deletion:
- Personal data is purged
- Shared data is anonymized (attributed to "Former Partner")

### BR-RET-04: Audit Logs
Audit log entries are retained for a minimum of 12 months.

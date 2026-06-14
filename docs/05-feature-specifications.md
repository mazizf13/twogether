# 05 — Feature Specifications

---

## Overview

This document provides detailed specifications for every feature in Twogether, including mandatory baseline features and proposed additional features. Each specification includes user stories, acceptance criteria, edge cases, and versioning.

---

## MANDATORY FEATURES

---

### FEAT-01: Couple Space

**Description:**  
A shared digital environment that links two users together. All shared features operate within the context of a Couple Space. It is the foundational container for all couple-specific data.

**User Story:**  
*As a newly engaged user, I want to create a shared space with my partner so that we can manage our finances and wedding planning together in one place.*

**Acceptance Criteria:**
- [ ] A user can create a Couple Space by entering their partner's email
- [ ] Only one active Couple Space is permitted per user
- [ ] The Couple Space has a name (defaults to "Partner1 & Partner2", editable)
- [ ] Both partners can see the couple space name and each other's display names
- [ ] The space shows a "waiting for partner" state until both are joined
- [ ] Either partner can view the couple membership status at any time

**Edge Cases:**
- Partner email doesn't exist yet → invitation still sent, account created on acceptance
- User tries to create second couple space → blocked with explanation
- Inviting yourself → validation error
- Invitation sent to already-coupled user → error message on acceptance

**Dependencies:** User authentication, email service

**Future Extensions:**
- Couple photo / profile
- Anniversary tracking beyond wedding date
- Couple "story" timeline (memory feature)

---

### FEAT-02: Authentication & Invitations

**Description:**  
Standard secure authentication with email/password, and a unique invitation token system for couple linking.

**User Story:**  
*As a user, I want to securely log in and invite my partner so that only we can access our private financial data.*

**Acceptance Criteria:**
- [ ] Registration with email, password (min 8 chars), and display name
- [ ] Login with email and password
- [ ] Password reset via email link (valid for 60 minutes)
- [ ] Invitation token generated and sent via email on couple creation
- [ ] Token expires in 72 hours
- [ ] Accepted token links the two accounts into one Couple Space
- [ ] Invalid/expired token shows a clear error with recovery path

**Edge Cases:**
- Multiple password reset requests → only latest token valid
- Invitation link visited when already logged in as another user → handle gracefully
- Invitation link resent → old token invalidated

**Dependencies:** Laravel auth scaffold, mail service, queue system

**Future Extensions:**
- Social login (Google OAuth) — V1.5
- Two-factor authentication — V2
- Email verification enforcement — V1.5

---

### FEAT-03: Personal Expenses

**Description:**  
Each partner maintains their own private expense log. Personal expenses are not visible to the partner by default.

**User Story:**  
*As a user, I want to track my own spending privately so that I can understand my personal financial habits without exposing every transaction to my partner.*

**Acceptance Criteria:**
- [ ] Log an expense with: amount (required), category (required), description (optional), date (required, default today)
- [ ] Visibility toggle: private (default) or visible to partner
- [ ] View personal expense list, sorted by date descending
- [ ] Filter by: date range, category
- [ ] Edit any personal expense
- [ ] Delete any personal expense (with confirmation)
- [ ] Monthly summary view by category (chart + totals)
- [ ] Set a monthly budget limit per category

**Edge Cases:**
- Amount of 0 → not allowed (validation error)
- Future-dated expenses → allowed (for pre-planning)
- Expense in past months → allowed
- Deleting an expense that was marked visible to partner → removed from partner's view

**Categories (Default Set):**
Food & Dining, Transportation, Shopping, Entertainment, Health, Education, Bills & Utilities, Wedding-related, Other

**Dependencies:** Couple Space, user authentication

**Future Extensions:**
- Receipt photo attachment — V1.5
- Recurring expense templates — V2
- Category spend trend analysis — V1.5
- Export to CSV/PDF — V1.5

---

### FEAT-04: Shared Expenses

**Description:**  
Expenses paid by either partner on behalf of the couple. Both partners see all shared expenses. The system tracks who paid and calculates the resulting balance.

**User Story:**  
*As a couple, we want to log expenses that we share so that we always know who paid for what and who owes whom — without needing to keep a mental tally.*

**Acceptance Criteria:**
- [ ] Log a shared expense with: amount, category, description (optional), date, paid by (self or partner), split ratio
- [ ] Default split: 50/50
- [ ] Custom split: percentage or fixed amount per partner
- [ ] Both partners see all shared expenses in real time
- [ ] Balance dashboard shows: Partner A's total share paid, Partner B's total share paid, net balance (who owes whom and how much)
- [ ] Filter shared expenses by: date range, category, who paid
- [ ] Either partner can edit a shared expense (recorded in audit trail)
- [ ] Either partner can delete a shared expense (with confirmation; audit trail updated)
- [ ] Partners can mark a period as "settled" — resets the balance counter

**Edge Cases:**
- One partner adds expense, claims it was paid by the other → the other partner should be able to dispute/edit
- Split that doesn't add to 100% → validation error
- Settling when balance is zero → no action needed (handled gracefully)
- Settling when balance is negative → confirm which direction money was transferred

**Dependencies:** Couple Space, user authentication

**Future Extensions:**
- Split by exact amount (not just percentage) — included in MVP
- Bill splitting for group events (with non-partner participants) — V2
- Payment confirmation (partner confirms they received/paid) — V1.5
- Integration with e-wallets for automatic logging — V2

---

### FEAT-05: Wedding Savings

**Description:**  
A shared savings fund for the wedding. Both partners contribute, and contributions are tracked individually and collectively.

**User Story:**  
*As a couple, we want to save money together for our wedding and see exactly how much we've each contributed so that saving feels like a joint achievement.*

**Acceptance Criteria:**
- [ ] Couple can set a total savings target amount
- [ ] Either partner can log a contribution: amount, date, optional note
- [ ] Dashboard shows: total saved, target, progress percentage, projected completion date (based on average contribution rate)
- [ ] Each partner's contribution amount and percentage of total shown
- [ ] Contribution history listed chronologically
- [ ] Milestone celebrations at 25%, 50%, 75%, 100%

**Edge Cases:**
- No target set → show total saved only, with prompt to set a target
- Target set to 0 → validation error
- Contribution that exceeds remaining target → allowed (over-saving is fine)
- Partner leaves couple → their contributions remain in history

**Dependencies:** Couple Space, wedding date (optional)

**Future Extensions:**
- Multiple savings buckets (this evolves into Goals — FEAT-06)
- Interest/growth projections — V2
- Savings streak tracking — V1.5

---

### FEAT-06: Wedding Savings Goals

**Description:**  
Named, targeted savings goals within the Wedding Savings area. Examples: "Venue Deposit", "Honeymoon", "Wedding Rings", "Photography".

**User Story:**  
*As a couple, we want to break our wedding savings into specific named goals so that we can prioritize and track each component of our wedding separately.*

**Acceptance Criteria:**
- [ ] Create a goal with: name, target amount, optional deadline, optional description/notes, optional color or icon
- [ ] Each goal shows: progress bar, amount saved, amount remaining, deadline (if set)
- [ ] Either partner can contribute to any goal
- [ ] Each goal has its own contribution history
- [ ] Completed goals show a celebration state
- [ ] Goals can be edited (name, target, deadline, notes)
- [ ] Goals can be archived (not deleted — preserve history)
- [ ] Goals overview shows all active goals at a glance

**Edge Cases:**
- Reducing target below already-saved amount → warning shown, confirmation required
- Two goals with same name → allowed (just unusual)
- Goal deadline passes before goal is complete → show "overdue" state, not failure
- Archiving a goal with unsaved contributions → handled gracefully

**Dependencies:** Wedding Savings (FEAT-05), Couple Space

**Future Extensions:**
- Goal templates (pre-suggested common wedding goals) — V1.5
- Shared vs. individual goal contributions tracking — already in MVP
- Link goal to checklist item — V2

---

### FEAT-07: Wedding Countdown

**Description:**  
A prominent visual countdown displaying the days until the couple's wedding. A simple but emotionally powerful feature.

**User Story:**  
*As a couple, we want to see how many days are left until our wedding so that we feel motivated and connected to our timeline.*

**Acceptance Criteria:**
- [ ] Countdown displayed prominently on the dashboard
- [ ] Shows days remaining (primary), with weeks and months as secondary
- [ ] Updates automatically each day
- [ ] If no wedding date set: shows a prompt to set one
- [ ] If wedding date has passed: transitions to a celebratory "Congratulations" state
- [ ] Both partners see the same countdown (based on shared wedding date)

**Edge Cases:**
- Wedding date changed mid-planning → countdown updates immediately
- Wedding date in the past on first setup → show warning and allow re-entry
- Wedding date is today → "Today is the day!" special state

**Dependencies:** Couple Space, wedding date setting

**Future Extensions:**
- Countdown widget embeddable on other sites — V2
- Monthly / weekly milestone markers on countdown — V1.5
- "X months until your wedding" notification reminders — V1.5

---

### FEAT-08: Wedding Preparation Checklist

**Description:**  
A structured, customizable task list for wedding preparation. Populated with a default template; fully customizable by the couple.

**User Story:**  
*As a couple planning our wedding, we want a structured checklist so that we don't miss any important steps and can divide responsibilities clearly between us.*

**Acceptance Criteria:**
- [ ] Default checklist template applied on couple onboarding
- [ ] Items grouped by category (Venue, Catering, Attire, Invitations, Photography, Music, Legal, Honeymoon, etc.)
- [ ] Each item has: title, category, assigned to (Partner 1 / Partner 2 / Both), due date (optional), status (To Do / Done), notes (optional)
- [ ] Either partner can mark any item complete
- [ ] Either partner can add custom items
- [ ] Either partner can edit any item
- [ ] Either partner can delete any item (with confirmation)
- [ ] Overall completion percentage displayed
- [ ] Filter by: status, assigned partner, overdue
- [ ] Overdue items visually highlighted (past due date, not yet done)

**Default Checklist Template (Sample Items):**
- Set a total wedding budget
- Book the venue
- Choose wedding date
- Select and invite officiants
- Book catering
- Book photographer & videographer
- Send save-the-dates
- Choose wedding attire
- Book florist
- Book music / DJ
- Send formal invitations
- Plan honeymoon
- Apply for marriage certificate
- Arrange accommodation for guests
- Final dress fitting

**Edge Cases:**
- Item assigned to partner who later leaves couple → assignment becomes unassigned
- All items completed → celebration state with confetti
- More than 100 custom items → pagination or virtualized list
- Due date set in the past on creation → warning but allowed

**Dependencies:** Couple Space, wedding date (for calculating relative due dates)

**Future Extensions:**
- Due dates relative to wedding date (e.g., "3 months before") — V1.5
- Vendor contact info linked to checklist items — V2
- Budget tracking per checklist item — V2
- Calendar integration — V2

---

## ADDITIONAL PROPOSED FEATURES

---

### FEAT-09: Activity Feed

**Problem it solves:**  
Partners using the app at different times have no way to see what their partner has done recently. Without an activity feed, the app feels "dead" when only one person is active.

**Why users would care:**  
Seeing "Reza added a contribution of Rp 500,000 to Venue Deposit" creates a sense of togetherness, encourages reciprocal behavior, and builds transparency naturally. It's a social layer without being a social network.

**Specification:**
- Real-time feed on the dashboard showing last 10–15 actions
- Actions logged: expense added/edited/deleted, contribution made, checklist item completed, goal created, wedding date changed
- Each activity shows: who did it, what they did, when, with a small icon
- Feed is couple-scoped (both partners' actions)
- "Today" and "Yesterday" grouping

**Implementation Complexity:** Low–Medium (simple append-only log table)

**Version:** MVP

---

### FEAT-10: Financial Summary Reports

**Problem it solves:**  
Couples have no way to review their financial behavior over time. Monthly or period-based summaries provide insight and encourage reflection.

**Why users would care:**  
"We spent Rp 8 million on wedding-related expenses this month" is a meaningful insight that helps couples course-correct. The financially disciplined persona (Hendra & Maya) needs this to trust the product.

**Specification:**
- Monthly summary for shared expenses: total spent, by category, compared to previous month
- Personal expense summary per user: total, by category
- Savings summary: monthly contributions by each partner, cumulative total
- Charts: bar chart (by category), line chart (spending over time)
- Available in: current month, last 3 months, last 6 months, custom range

**Implementation Complexity:** Medium (requires aggregation queries and chart components)

**Version:** V1.5

---

### FEAT-11: Notification System

**Problem it solves:**  
Partners who don't open the app every day miss important updates. Without notifications, the app loses the "shared" feeling.

**Why users would care:**  
"Your partner just completed 3 checklist items" or "You're 75% of the way to your Venue goal!" creates emotional engagement and loop-closing behavior.

**Specification:**
- In-app notifications (bell icon in header)
- Email notifications (configurable, daily digest or real-time)
- Notification types:
  - Partner added a shared expense
  - Partner made a savings contribution
  - Partner completed a checklist item
  - Savings milestone reached (25/50/75/100%)
  - Goal completed
  - Checklist item overdue
  - Wedding date milestone (6 months, 3 months, 1 month, 1 week away)
  - Partner accepted invitation
- User can configure which notifications they receive

**Implementation Complexity:** Medium (queue-based, notification preference table)

**Version:** V1.5 (in-app), V2 (push notifications via PWA)

---

### FEAT-12: Budget Tracker (Wedding Budget)

**Problem it solves:**  
Couples set a wedding budget but have no way to track actual spending against it. The savings goals tell you what you plan to save, but not whether you're staying within budget.

**Why users would care:**  
Overspending on a wedding is a leading cause of post-wedding financial stress. A budget tracker turns the wedding budget from a number on paper into an active guardrail.

**Specification:**
- Set a total wedding budget (distinct from savings target)
- Categorize the budget: Venue X%, Catering X%, Photography X%, etc.
- As shared expenses in wedding-related categories are logged, they're compared to the budget
- Visual: budget vs. actual per category (bar chart)
- Alert when a category reaches 80% and 100% of budget
- Overall under/over budget status shown prominently

**Implementation Complexity:** Medium (requires budget table + linking shared expenses to budget categories)

**Version:** V1.5

---

### FEAT-13: Partner Sharing Toggle for Personal Expenses

**Problem it solves:**  
Some personal expenses are relevant to the couple (e.g., "I bought a dress for the engagement party") but most are private. A simple toggle allows selective sharing.

**Why users would care:**  
Provides a bridge between fully private and fully shared — respects autonomy while enabling voluntary transparency.

**Specification:**
- Already included in FEAT-03 (Personal Expenses)
- When toggled to "visible to partner": expense appears in partner's view with a "shared by [Name]" label
- Partner cannot edit or delete expenses shared with them (view only)
- Owner can revoke visibility at any time

**Implementation Complexity:** Low

**Version:** MVP

---

### FEAT-14: Savings Streak & Motivation System

**Problem it solves:**  
Couples (especially the financially struggling persona) lose motivation when progress is slow. A streak system rewards consistent behavior, not just balance size.

**Why users would care:**  
A couple that has saved "for 8 weeks in a row" feels proud regardless of the amount. This is psychologically grounding for irregular income earners.

**Specification:**
- Track weekly contribution streaks per couple
- Dashboard badge shows current streak: "🔥 8-week saving streak!"
- Milestone rewards: celebrate 4, 8, 12, 26, 52-week streaks with animations
- Streak resets if no contribution in a calendar week
- Couple can view their streak history

**Implementation Complexity:** Low (requires a contribution timestamp check per week)

**Version:** V1.5

---

### FEAT-15: Guest List Manager (V2)

**Problem it solves:**  
Guest list management is one of the most time-consuming parts of wedding planning and is currently done in spreadsheets.

**Why users would care:**  
Having the guest list inside Twogether means invitation budget can be connected to the financial features. It's a logical extension.

**Specification:**
- Add guests with: name, relationship to each partner, contact info (optional), RSVP status, meal preference, accommodation needed
- Track RSVP: Pending / Confirmed / Declined
- Total guest count vs. venue capacity
- Filter by: RSVP status, partner relationship

**Implementation Complexity:** Medium

**Version:** V2

---

### FEAT-16: Vendor Directory & Bookings (V2)

**Problem it solves:**  
Vendor information is scattered across emails, WhatsApp, and notes apps. Couples lose track of quotes, contacts, and contract statuses.

**Why users would care:**  
Having vendor contacts alongside the budget and checklist creates a complete wedding management hub.

**Specification:**
- Add vendors with: name, category (venue, catering, etc.), contact info, price quote, booked/not booked status, notes, contract status
- Link vendor to checklist item and savings goal
- Vendor list sortable by category, status, price

**Implementation Complexity:** Medium

**Version:** V2

---

## Feature Priority Matrix

| Feature | User Value | Complexity | Version |
|---------|-----------|------------|---------|
| FEAT-01: Couple Space | Critical | Medium | MVP |
| FEAT-02: Auth & Invitations | Critical | Medium | MVP |
| FEAT-03: Personal Expenses | High | Medium | MVP |
| FEAT-04: Shared Expenses | Critical | Medium | MVP |
| FEAT-05: Wedding Savings | High | Low | MVP |
| FEAT-06: Savings Goals | High | Low | MVP |
| FEAT-07: Wedding Countdown | High | Low | MVP |
| FEAT-08: Checklist | High | Medium | MVP |
| FEAT-09: Activity Feed | Medium | Low | MVP |
| FEAT-13: Partner Sharing Toggle | Medium | Low | MVP |
| FEAT-10: Financial Reports | High | Medium | V1.5 |
| FEAT-11: Notifications | High | Medium | V1.5 |
| FEAT-12: Budget Tracker | High | Medium | V1.5 |
| FEAT-14: Savings Streak | Medium | Low | V1.5 |
| FEAT-15: Guest List | Medium | Medium | V2 |
| FEAT-16: Vendor Directory | Medium | High | V2 |

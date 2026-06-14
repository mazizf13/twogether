# 04 — Information Architecture

---

## Overview

This document defines the structural organization of Twogether: the sitemap, navigation model, page hierarchy, and route design. Every decision here directly impacts how users find features and how developers structure the application.

---

## Design Principles for IA

1. **Couple-centricity:** The navigation always reflects that this is a shared space. "We" language where appropriate.
2. **Progressive disclosure:** Simple views first; detail on demand.
3. **Predictable locations:** Users should never wonder where something is. Core areas are always accessible.
4. **Mobile-first routing:** All primary routes must be reachable within 2 taps from any screen.

---

## Sitemap

```
/
├── (public)
│   ├── /                          → Landing page
│   ├── /login                     → Login
│   ├── /register                  → Register
│   ├── /forgot-password           → Password reset request
│   ├── /reset-password/{token}    → Password reset form
│   └── /invite/{token}            → Couple invitation acceptance
│
├── (authenticated, no couple)
│   └── /onboarding                → Create/join couple space
│
└── (authenticated, couple active)
    ├── /dashboard                 → Main overview (Home)
    │
    ├── /expenses
    │   ├── /expenses/personal     → My personal expenses
    │   ├── /expenses/shared       → Shared expenses
    │   └── /expenses/balance      → Balance between partners
    │
    ├── /savings
    │   ├── /savings               → Savings overview + overall fund
    │   └── /savings/goals         → Individual savings goals
    │       └── /savings/goals/{id}→ Goal detail
    │
    ├── /wedding
    │   ├── /wedding               → Wedding hub (countdown + overview)
    │   └── /wedding/checklist     → Full checklist view
    │
    └── /settings
        ├── /settings/profile      → Personal profile settings
        ├── /settings/couple       → Couple settings (wedding date, space name)
        ├── /settings/notifications→ Notification preferences
        └── /settings/security     → Password, security settings
```

---

## Navigation Structure

### Primary Navigation (Sidebar — Desktop / Bottom Bar — Mobile)

The primary nav has 4 items. Fewer = more memorable. Every core job-to-be-done is one tap away.

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| 🏠 | Home | /dashboard | — |
| 💳 | Expenses | /expenses/shared | Unread shared expenses |
| 💰 | Savings | /savings | — |
| 💒 | Wedding | /wedding | Overdue tasks |

**Settings** is accessible via the user avatar (top right corner on desktop, profile tab on mobile).

### Secondary Navigation (Page-level tabs)

Each primary section has internal tabs:

**Expenses Page:**
- Shared (default)
- Personal
- Balance

**Savings Page:**
- Overview (default)
- Goals

**Wedding Page:**
- Hub / Countdown (default)
- Checklist

---

## Page Hierarchy

### Level 0: Shell
The authenticated app shell: sidebar (desktop) or bottom nav (mobile), header bar with couple name and user avatar.

### Level 1: Dashboard (`/dashboard`)
The home screen. Aggregated view. No deep interactions — everything links to Level 2.

**Dashboard Sections:**
- Wedding Countdown (large, prominent)
- Shared Expense Balance Summary
- Savings Progress (total + top goals)
- Recent Activity Feed (last 5 actions by either partner)
- Quick Actions (+ Expense, + Contribution, + Task)

### Level 2: Section Pages
- `/expenses/shared` — Full shared expense list
- `/expenses/personal` — Personal expense list
- `/savings` — Savings overview
- `/savings/goals` — Goals grid
- `/wedding` — Wedding hub with countdown
- `/wedding/checklist` — Full checklist

### Level 3: Detail / Sub-pages
- `/savings/goals/{id}` — Individual goal detail with contribution history
- Modals (overlays that don't change the URL in most cases) for: Add Expense, Add Contribution, Add Task, Edit items

---

## Route Organization (Laravel + Inertia)

### Route Groups

```
Route Group: Guest (no auth)
  GET  /                          → Pages/Landing
  GET  /login                     → Pages/Auth/Login
  POST /login                     → Auth/LoginController
  GET  /register                  → Pages/Auth/Register
  POST /register                  → Auth/RegisterController
  GET  /forgot-password           → Pages/Auth/ForgotPassword
  POST /forgot-password           → Auth/PasswordResetLinkController
  GET  /reset-password/{token}    → Pages/Auth/ResetPassword
  POST /reset-password            → Auth/NewPasswordController
  GET  /invite/{token}            → Pages/Couple/AcceptInvitation
  POST /invite/{token}/accept     → Couple/InvitationController@accept

Route Group: Authenticated, No Couple
  GET  /onboarding                → Pages/Onboarding
  POST /couple/create             → Couple/CoupleController@create
  POST /couple/invite             → Couple/CoupleController@invite

Route Group: Authenticated, Active Couple
  GET  /dashboard                 → Pages/Dashboard

  GET  /expenses/personal         → Pages/Expenses/Personal
  POST /expenses/personal         → Expenses/PersonalExpenseController@store
  PUT  /expenses/personal/{id}    → Expenses/PersonalExpenseController@update
  DELETE /expenses/personal/{id}  → Expenses/PersonalExpenseController@destroy

  GET  /expenses/shared           → Pages/Expenses/Shared
  POST /expenses/shared           → Expenses/SharedExpenseController@store
  PUT  /expenses/shared/{id}      → Expenses/SharedExpenseController@update
  DELETE /expenses/shared/{id}    → Expenses/SharedExpenseController@destroy

  GET  /expenses/balance          → Pages/Expenses/Balance
  POST /expenses/balance/settle   → Expenses/BalanceController@settle

  GET  /savings                   → Pages/Savings/Overview
  POST /savings/contributions     → Savings/ContributionController@store

  GET  /savings/goals             → Pages/Savings/Goals
  POST /savings/goals             → Savings/GoalController@store
  GET  /savings/goals/{id}        → Pages/Savings/GoalDetail
  PUT  /savings/goals/{id}        → Savings/GoalController@update
  DELETE /savings/goals/{id}      → Savings/GoalController@destroy
  POST /savings/goals/{id}/contributions → Savings/GoalContributionController@store

  GET  /wedding                   → Pages/Wedding/Hub
  GET  /wedding/checklist         → Pages/Wedding/Checklist
  POST /wedding/checklist         → Wedding/ChecklistController@store
  PUT  /wedding/checklist/{id}    → Wedding/ChecklistController@update
  DELETE /wedding/checklist/{id}  → Wedding/ChecklistController@destroy

  GET  /settings/profile          → Pages/Settings/Profile
  PUT  /settings/profile          → Settings/ProfileController@update
  GET  /settings/couple           → Pages/Settings/Couple
  PUT  /settings/couple           → Settings/CoupleController@update
  GET  /settings/notifications    → Pages/Settings/Notifications
  PUT  /settings/notifications    → Settings/NotificationController@update
  GET  /settings/security         → Pages/Settings/Security
  PUT  /settings/security/password → Settings/SecurityController@updatePassword
  DELETE /couple/leave            → Couple/CoupleController@leave
```

---

## Navigation Decision Rationale

### Why 4 Primary Nav Items?
Research consistently shows that navigation menus with 4–5 items are optimal for mobile bottom bars and desktop sidebars. More items cause decision fatigue. The 4 we chose (Home, Expenses, Savings, Wedding) map directly to the 4 core job-to-be-done areas.

### Why Expenses Has Sub-tabs?
Personal and Shared expenses are fundamentally different data with different permissions. Keeping them in the same section prevents the user from needing two separate top-level entries. The Balance view is an output view (derived from shared expenses) and belongs in the same section.

### Why Wedding Is a Single Section?
The wedding countdown and checklist are emotionally connected. Having them together reinforces the purpose of the checklist — preparing for the day on the countdown.

### Why Dashboard Instead of "Home"?
The label "Dashboard" accurately conveys that this is an overview screen with real data. "Home" feels more abstract. However, the icon is a house for universal recognition. The label may be revisited in V1.5 based on user research.

### Why Settings Is Not in Primary Nav?
Settings are not a daily-use area. Hiding them behind the user avatar (a universal pattern) reduces nav clutter while remaining discoverable.

---

## URL Design Rationale

- **RESTful and predictable:** `/resources/{id}` pattern throughout
- **No IDs in primary nav:** Top-level pages use semantic paths (`/savings/goals` not `/couple/{id}/goals`)
- **Couple scoping is implicit:** All authenticated routes are scoped to the user's active couple via middleware — no need to put couple ID in the URL
- **No hash routing:** Inertia provides SPA behavior without hash URLs; clean URLs improve shareability and SEO

---

## Middleware Architecture

```
Route Middleware Layers:
1. auth                    → Must be logged in
2. verified (optional)     → Email verified (V1.5)
3. has.couple              → Must have an active couple (for couple-scoped routes)
4. couple.active           → Couple must not be dissolved
```

The `has.couple` middleware redirects to `/onboarding` if the user has no active couple. This handles the case where a user's partner leaves the couple space.

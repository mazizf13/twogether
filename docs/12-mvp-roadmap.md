# 12 — MVP Roadmap

---

## Overview

This document defines the phased delivery plan for Twogether. Every version is evaluated against the principle: **does this create real value for the couple, or does it just add complexity?**

The roadmap is opinionated. Features are deferred aggressively. It is better to launch a smaller, polished product than a bloated one that feels half-finished.

---

## Prioritization Framework

Each feature is scored across two axes:

- **User Impact (1–5):** How directly does this improve the couple's experience?
- **Implementation Complexity (1–5):** How much engineering effort does this require?

Priority score = Impact ÷ Complexity (higher = ship sooner)

---

## MVP — The Foundation

**Goal:** Prove that couples will use a shared financial + wedding planning app together.  
**Timeline Estimate:** 8–12 weeks for a single full-stack developer  
**Success Criteria:** 100 active couples, both partners logging at least once per week

### MVP Feature Set

| # | Feature | Impact | Complexity | Score | Notes |
|---|---------|--------|------------|-------|-------|
| 1 | Authentication (register/login/reset) | 5 | 2 | 2.5 | Laravel scaffold |
| 2 | Couple Space creation | 5 | 2 | 2.5 | Core container |
| 3 | Couple Invitation system | 5 | 3 | 1.7 | Token-based email |
| 4 | Couple Onboarding wizard | 4 | 2 | 2.0 | 4-step flow |
| 5 | Personal Expenses (log/view/edit/delete) | 4 | 2 | 2.0 | Private by default |
| 6 | Personal Expense categories | 3 | 1 | 3.0 | Predefined list |
| 7 | Partner visibility toggle (personal expenses) | 3 | 1 | 3.0 | Simple boolean |
| 8 | Shared Expenses (log/view/edit/delete) | 5 | 3 | 1.7 | Core feature |
| 9 | Shared expense split ratio | 4 | 2 | 2.0 | Slider + custom |
| 10 | Balance calculator | 5 | 2 | 2.5 | Derived calculation |
| 11 | Settle Up | 4 | 2 | 2.0 | Settlement record |
| 12 | Wedding Savings fund | 5 | 2 | 2.5 | Single fund |
| 13 | Savings Contributions | 5 | 1 | 5.0 | Simple log |
| 14 | Savings progress + milestones | 4 | 2 | 2.0 | Progress bar + celebrate |
| 15 | Savings Goals (named) | 4 | 2 | 2.0 | Multiple goals |
| 16 | Goal Contributions | 4 | 1 | 4.0 | Per-goal logging |
| 17 | Wedding Countdown | 5 | 1 | 5.0 | Date math |
| 18 | Wedding Checklist (default template) | 5 | 2 | 2.5 | Pre-seeded items |
| 19 | Custom checklist items | 4 | 1 | 4.0 | CRUD |
| 20 | Checklist assignment + completion | 4 | 1 | 4.0 | Status + assignee |
| 21 | Activity Feed | 4 | 2 | 2.0 | Append-only log |
| 22 | Dashboard (overview) | 5 | 3 | 1.7 | Aggregated view |
| 23 | User profile settings | 3 | 1 | 3.0 | Name, avatar |
| 24 | Couple settings (wedding date, name) | 3 | 1 | 3.0 | Shared settings |
| 25 | Leave couple space | 3 | 2 | 1.5 | Dissolution flow |
| 26 | Mobile responsive layout | 5 | 3 | 1.7 | Non-negotiable |

### MVP Explicitly Excludes
- Email notifications (in-app only)
- Financial reports / charts beyond basic totals
- Receipt uploads
- Multi-currency
- Budget tracker
- Guest list
- Vendor directory
- Two-factor authentication
- Social login
- Export / CSV download

### MVP Technical Deliverables
- Laravel 13 application
- MySQL database with all core tables
- Inertia.js + React frontend
- shadcn/ui pink theme applied
- Atomic component library (atoms through organisms)
- All 8 mandatory features implemented
- Activity feed
- Mobile-responsive layout (375px+)
- Basic rate limiting
- CSRF protection
- Policy-based authorization
- Couple scope enforcement
- Email: Invitation + Password reset only

---

## Version 1.5 — Depth & Retention

**Goal:** Increase engagement, reduce churn, and add the features that disciplined users need.  
**Timeline Estimate:** 6–8 weeks post-MVP  
**Success Criteria:** 30-day retention >55%, NPS >40

### V1.5 Feature Set

| # | Feature | Why Now | Impact | Complexity |
|---|---------|---------|--------|------------|
| 1 | In-app notification system | Partners miss each other's actions | 4 | 3 |
| 2 | Email notifications (configurable) | Re-engagement loop | 4 | 2 |
| 3 | Wedding milestone reminders (6mo/3mo/1mo/1wk) | Emotional hook + retention | 4 | 2 |
| 4 | Financial summary reports | Disciplined couples demand it | 4 | 3 |
| 5 | Expense charts (by category, over time) | Visual insight | 4 | 3 |
| 6 | Budget tracker (vs. actual spending) | High-value feature gap | 4 | 3 |
| 7 | Savings streak system | Motivation for struggling couples | 3 | 2 |
| 8 | Personal expense monthly budget limits | Discipline feature | 3 | 2 |
| 9 | Checklist due dates relative to wedding date | e.g., "3 months before" | 3 | 2 |
| 10 | Goal templates (pre-suggested goals) | Reduces blank-slate friction | 3 | 1 |
| 11 | Contribution edit window (24h) | Fix mistakes | 3 | 1 |
| 12 | Expense CSV export | Data ownership | 3 | 2 |
| 13 | Social login (Google OAuth) | Reduce registration friction | 3 | 3 |
| 14 | Email verification enforcement | Security posture | 3 | 1 |
| 15 | Payment confirmation (partner acknowledges expense) | Mutual agreement on shared costs | 3 | 3 |
| 16 | Receipt photo upload (personal + shared expenses) | Proof of expense | 3 | 3 |
| 17 | Session management (view + revoke active sessions) | Security | 3 | 2 |

### V1.5 Technical Work
- Redis for sessions and queue processing
- S3/object storage for receipt photos
- Image optimization pipeline
- Notification preference system
- Recharts implementation for financial dashboards
- Progressive Web App (PWA) manifest (enable "Add to Home Screen")

---

## Version 2.0 — Expansion

**Goal:** Expand beyond the wedding stage. Become a life-stage companion for newlyweds.  
**Timeline Estimate:** 3–4 months post-V1.5  
**Success Criteria:** Post-wedding retention >30%, expansion revenue from premium tier

### V2.0 Feature Set

| # | Feature | Why | Impact | Complexity |
|---|---------|-----|--------|------------|
| 1 | Post-wedding mode (new life goals) | Avoid post-wedding churn | 5 | 4 |
| 2 | Life Goals (home, travel, family savings) | Extend beyond wedding | 5 | 3 |
| 3 | Guest list manager | Natural wedding planning extension | 4 | 3 |
| 4 | Vendor directory & booking tracker | Complete wedding hub | 4 | 4 |
| 5 | Multi-currency support | Long-distance couples | 4 | 4 |
| 6 | Bank/e-wallet integration (read-only) | Eliminate manual entry | 5 | 5 |
| 7 | Two-factor authentication | Security upgrade | 3 | 3 |
| 8 | Premium subscription tier | Monetization | 5 | 3 |
| 9 | Couple "memory" timeline | Emotional retention | 3 | 3 |
| 10 | Spending insights ("You spend 20% more than similar couples on dining") | Personalized advice | 4 | 5 |
| 11 | Push notifications (PWA) | Re-engagement | 4 | 3 |
| 12 | Account deletion + data export (GDPR-ready) | Privacy compliance | 4 | 3 |
| 13 | Referral system | Growth loop | 4 | 3 |
| 14 | Mobile native app (React Native) | Native experience | 4 | 5 |

### V2.0 Technical Work
- Subscription billing system (Stripe or local payment gateway)
- Bank integration layer (open banking API or screen scraping)
- Push notification infrastructure
- React Native app (significant effort — dedicated milestone)
- Spending anonymized benchmark data pipeline

---

## Roadmap Timeline View

```
Week 1–2:    Infrastructure setup, auth, database schema
Week 3–4:    Couple Space, Invitation, Onboarding
Week 5–6:    Personal Expenses, Shared Expenses, Balance
Week 7–8:    Wedding Savings, Goals, Countdown
Week 9–10:   Checklist, Activity Feed, Dashboard
Week 11–12:  Polish, mobile responsive, QA, launch prep

→ MVP LAUNCH

Week 13–14:  Notifications system
Week 15–16:  Financial reports + charts
Week 17–18:  Budget tracker, savings streak
Week 19–20:  CSV export, receipt uploads, goal templates
Week 21–22:  V1.5 QA + polish

→ V1.5 RELEASE

Month 7–8:   Post-wedding mode, Life Goals
Month 9–10:  Guest list, Vendor directory
Month 11–12: Premium tier, multi-currency, bank integration scoping

→ V2.0 RELEASE
```

---

## Feature Freeze Policy

Once MVP scope is locked, **no new features enter the MVP scope**. Anything discovered during development goes onto the V1.5 backlog. This is enforced to maintain launch timeline and product focus.

The only exception: security vulnerabilities discovered during development must be fixed regardless of scope.

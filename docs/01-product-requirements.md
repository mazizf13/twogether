# 01 — Product Requirements

---

## Overview

This document defines what the product must do (functional requirements), how it must perform (non-functional requirements), what boundaries exist (constraints), what we are assuming (assumptions), and what could go wrong (risks).

---

## Functional Requirements

### FR-01: Authentication & Couple Management

| ID | Requirement |
|----|-------------|
| FR-01-01 | User can register with email and password |
| FR-01-02 | User can log in with email and password |
| FR-01-03 | User can reset password via email link |
| FR-01-04 | Authenticated user can create a Couple Space |
| FR-01-05 | Couple creator can invite a partner via email |
| FR-01-06 | Invited partner receives an email with a unique invitation link |
| FR-01-07 | Invited partner can accept invitation and join the Couple Space |
| FR-01-08 | A user can belong to only one active Couple Space |
| FR-01-09 | Either partner can view couple membership status |
| FR-01-10 | A partner can leave a Couple Space (with appropriate warnings) |
| FR-01-11 | User profile includes: display name, avatar, wedding date |

---

### FR-02: Personal Expenses

| ID | Requirement |
|----|-------------|
| FR-02-01 | Each partner can log personal expenses independently |
| FR-02-02 | Personal expenses are private by default |
| FR-02-03 | A personal expense includes: amount, category, description, date |
| FR-02-04 | User can edit or delete their own personal expenses |
| FR-02-05 | User can view a list of their own personal expenses with filters |
| FR-02-06 | User can view a personal expense summary by category and period |
| FR-02-07 | User can optionally mark a personal expense as visible to partner |
| FR-02-08 | User can set a personal monthly budget per category |

---

### FR-03: Shared Expenses

| ID | Requirement |
|----|-------------|
| FR-03-01 | Either partner can log a shared expense |
| FR-03-02 | Shared expenses are visible to both partners immediately |
| FR-03-03 | A shared expense includes: amount, category, description, date, paid by, split ratio |
| FR-03-04 | Default split ratio is 50/50 but is configurable |
| FR-03-05 | System calculates who owes whom based on payments and splits |
| FR-03-06 | Either partner can edit a shared expense (with audit trail) |
| FR-03-07 | Couple can view shared expense history with filters |
| FR-03-08 | Shared expense dashboard shows current balance between partners |
| FR-03-09 | Partners can mark a balance as "settled" |

---

### FR-04: Wedding Savings

| ID | Requirement |
|----|-------------|
| FR-04-01 | Couple can create a Wedding Savings fund |
| FR-04-02 | Each partner can log a contribution to the savings fund |
| FR-04-03 | Contributions are visible to both partners |
| FR-04-04 | Savings dashboard shows total saved, target amount, and progress |
| FR-04-05 | System calculates each partner's total contribution amount and percentage |
| FR-04-06 | Couple can view full contribution history |
| FR-04-07 | Couple can set a target savings amount |
| FR-04-08 | System shows projected completion date based on contribution rate |

---

### FR-05: Wedding Savings Goals

| ID | Requirement |
|----|-------------|
| FR-05-01 | Couple can create multiple named savings goals (e.g., "Venue", "Honeymoon") |
| FR-05-02 | Each goal has: name, target amount, optional deadline, optional notes |
| FR-05-03 | Each partner can contribute to any goal |
| FR-05-04 | Goals show individual progress bar toward target |
| FR-05-05 | Completed goals are celebrated with visual feedback |
| FR-05-06 | Goals can be edited or archived |
| FR-05-07 | Goals overview shows all goals with progress at a glance |

---

### FR-06: Wedding Countdown

| ID | Requirement |
|----|-------------|
| FR-06-01 | Couple sets their wedding date during onboarding or in settings |
| FR-06-02 | Countdown is displayed prominently on the dashboard |
| FR-06-03 | Countdown shows days, and optionally weeks and months |
| FR-06-04 | Countdown updates automatically every day |
| FR-06-05 | After the wedding date passes, the countdown transitions gracefully |

---

### FR-07: Wedding Preparation Checklist

| ID | Requirement |
|----|-------------|
| FR-07-01 | System provides a default checklist template with common wedding tasks |
| FR-07-02 | Each checklist item has: title, optional description, optional due date, assigned partner(s), status |
| FR-07-03 | Either partner can mark an item as complete |
| FR-07-04 | Couple can add custom checklist items |
| FR-07-05 | Couple can edit or delete checklist items |
| FR-07-06 | Checklist shows overall completion percentage |
| FR-07-07 | Items can be filtered by: assigned partner, status, due date |
| FR-07-08 | Overdue items are highlighted visually |
| FR-07-09 | Checklist items can be grouped by category (Venue, Catering, Attire, etc.) |

---

## Non-Functional Requirements

### NFR-01: Performance
- Page load time (initial): < 2 seconds on standard broadband
- Page transitions (Inertia SPA): < 300ms perceived
- API response time: < 500ms for 95th percentile
- Dashboard renders correctly on mobile (≥ 375px viewport width)

### NFR-02: Reliability
- System uptime target: 99.5% monthly
- Data must never be silently lost — all mutations are logged
- Failed form submissions must not lose user-entered data

### NFR-03: Security
- All data transmitted over HTTPS
- Passwords hashed using bcrypt (Laravel default)
- Sessions are secure, HttpOnly cookies
- CSRF protection on all state-changing endpoints
- Partner data is never exposed to unrelated users

### NFR-04: Scalability
- Architecture must support horizontal scaling of the Laravel application layer
- Database schema designed to support future modules without destructive migrations
- Background jobs handled via queues (not synchronous)

### NFR-05: Usability
- Core tasks (log expense, add contribution) completable in under 3 taps/clicks
- All forms have inline validation with human-readable error messages
- Product must be usable without reading documentation

### NFR-06: Accessibility
- WCAG 2.1 Level AA compliance target
- All interactive elements keyboard-navigable
- Color contrast ratios meet AA standards
- Screen reader labels on all form elements

### NFR-07: Internationalization (Future)
- Architecture must support multi-currency from day one (even if only one currency at launch)
- Date formats must respect locale
- String literals must be externalized for future translation

---

## Constraints

| Constraint | Detail |
|-----------|--------|
| **Tech Stack** | Laravel 13, MySQL, Inertia.js, React, shadcn/ui |
| **Design System** | shadcn theme: pink; chart colors: pink palette |
| **Component Architecture** | Atomic Design (atoms → molecules → organisms → templates → pages) |
| **Single Couple Space** | A user may belong to only one active couple at a time |
| **No Native App (MVP)** | Web-only at launch; must be mobile-responsive |
| **No Bank Integration (MVP)** | All expense and savings data is manually entered at launch |

---

## Assumptions

| # | Assumption | Risk if Wrong |
|---|------------|---------------|
| A-01 | Both partners have access to a smartphone or desktop browser | Low — essentially universal |
| A-02 | Couples are willing to manually log expenses | Medium — friction is a major dropout cause |
| A-03 | Users trust the platform with financial data | High — must be earned through design and communication |
| A-04 | Wedding date is known or estimable at onboarding | Low — can be set later |
| A-05 | One partner initiates and invites the other | Medium — both partners need to be motivated to adopt |
| A-06 | Currency is single (local currency) at MVP | Low — but must be architecturally prepared for multi-currency |
| A-07 | Users want transparency, not just tracking | Medium — some users may prefer private finance |

---

## Risks

### R-01: Partner Adoption Drop-off
**Description:** The inviting partner signs up but the other partner never joins or stops using the app.  
**Impact:** High — the core value proposition requires both partners.  
**Mitigation:** Compelling onboarding, reminder emails, and features that work solo until partner joins.

### R-02: Manual Data Entry Fatigue
**Description:** Users stop logging expenses because it feels tedious.  
**Impact:** High — without data, dashboards are meaningless.  
**Mitigation:** Minimize entry friction, add quick-log UX patterns, explore receipt scanning in V2.

### R-03: Financial Disagreements Surfaced by the App
**Description:** The app may expose spending habits that cause conflict between partners.  
**Impact:** Medium — could lead to negative associations with the product.  
**Mitigation:** Framing, copy tone, and UX should encourage conversation, not confrontation.

### R-04: Data Privacy Concerns
**Description:** Users may feel uncomfortable sharing financial data on a web platform.  
**Impact:** High — especially in markets with lower digital trust.  
**Mitigation:** Strong security posture, clear privacy policy, explicit consent flows.

### R-05: Feature Scope Creep
**Description:** Adding too many features dilutes the product identity and delays launch.  
**Impact:** Medium  
**Mitigation:** Strict MVP discipline; defer everything to V1.5 or V2 ruthlessly.

### R-06: Post-Wedding Churn
**Description:** The product loses relevance once the wedding is over.  
**Impact:** High for long-term retention  
**Mitigation:** Introduce post-wedding modules early (V1.5): home savings, travel goals, life goals.

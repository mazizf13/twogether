# 11 — Security Considerations

---

## Overview

Twogether handles sensitive personal financial data for couples. Security is not an afterthought — it is a design requirement. This document defines the security posture across authentication, authorization, data privacy, and abuse prevention.

---

## 1. Authentication Security

### 1.1 Password Handling
- Passwords hashed with **bcrypt** (Laravel default, cost factor 12)
- Minimum password length: 8 characters (recommended 12+)
- No maximum password length restrictions
- Passwords never logged, echoed, or stored in plain text
- Password reset tokens are **single-use, expire in 60 minutes**, stored as bcrypt hash
- Failed login attempts do not reveal whether the email exists ("Invalid credentials" — not "Email not found")

### 1.2 Session Security
- Sessions stored in **database** (not cookies) at MVP → Redis in V1.5
- Session cookie attributes:
  - `HttpOnly: true` — Prevents JavaScript access
  - `Secure: true` — HTTPS only
  - `SameSite: Lax` — CSRF protection while allowing safe cross-site navigations
- Session ID rotated on login (`Auth::login()` calls `session()->regenerate()`)
- Session invalidated on logout (`Auth::logout()` + `session()->invalidate()`)
- Remember-me tokens stored as hashed values in database

### 1.3 Brute Force Protection
- Laravel's built-in **rate limiting** on login: max 5 failed attempts per minute per IP + email
- Throttled response: 429 Too Many Requests with `Retry-After` header
- Lockout duration: 60 seconds (progressive in V1.5)
- CAPTCHA: Not in MVP — reconsidered if abuse is detected

### 1.4 HTTPS
- All traffic served over HTTPS
- HTTP → HTTPS redirect enforced at web server level (nginx)
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

## 2. Authorization Security

### 2.1 Policy-Based Access Control
Every resource access is gated through a **Laravel Policy**. Controllers never access data without policy authorization.

```
Pattern:
  $this->authorize('update', $expense);  // PolicyException if not authorized
```

### 2.2 Couple Scope Enforcement
The most critical authorization rule: **no user may access data belonging to another couple**.

Enforcement layers:
1. **Middleware** (`EnsureCoupleScope`): Attaches `$request->couple` from the authenticated user's couple — not from a URL parameter. This prevents ID manipulation.
2. **Eloquent Global Scope**: A `CoupleScope` is applied on all couple-scoped models, automatically filtering queries to `couple_id = $currentCoupleId`.
3. **Policy**: Additional check at the policy level for sensitive operations.

**Defense in depth:** If any one layer fails, the others should still protect the data.

### 2.3 Mass Assignment Protection
All Eloquent models explicitly define `$fillable` (whitelist approach). `$guarded = []` is never used. This prevents mass-assignment attacks on sensitive fields like `couple_id`, `user_id`, or `is_admin`.

### 2.4 CSRF Protection
- All state-changing requests (POST, PUT, PATCH, DELETE) protected by Laravel's CSRF middleware
- Inertia.js automatically handles CSRF token injection via the `X-XSRF-TOKEN` header
- CSRF token stored in a non-HttpOnly cookie (accessible to JavaScript by design, consumed by Inertia)

---

## 3. Data Privacy

### 3.1 Couple Privacy Model
The fundamental privacy boundary is the Couple Space:

| Data Type | Owner | Visible To |
|-----------|-------|-----------|
| Personal expenses (private) | Individual user | Owner only |
| Personal expenses (shared) | Individual user | Both partners |
| Shared expenses | Couple | Both partners |
| Savings contributions | Individual user | Both partners |
| Savings goals | Couple | Both partners |
| Checklist | Couple | Both partners |
| Activity feed | Couple | Both partners |

**No data crosses couple boundaries under any circumstances.**

### 3.2 Post-Dissolution Privacy
When a partner leaves a Couple Space:
- The departed partner **immediately loses access** to all shared data (middleware check)
- Session is not immediately terminated (no forced logout) but all couple-scoped routes will redirect to onboarding
- The departed partner's personal expenses remain accessible only to them

### 3.3 Data at Rest
- Database on encrypted volumes (infrastructure level)
- Sensitive fields (no additional application-level encryption at MVP — V2 consideration for particularly sensitive financial totals)

### 3.4 Data in Transit
- All API calls over HTTPS/TLS 1.2+
- Internal service calls (if any) also encrypted

### 3.5 Third-Party Data Sharing
- No financial data is shared with third parties at MVP
- Analytics (if added in V1.5): only aggregate, anonymized data — never individual financial records
- No advertising data sharing (product philosophy commitment)

---

## 4. Couple Privacy Model (Detailed)

### 4.1 Partner Cannot See:
- Other partner's private personal expenses
- Notification preferences of partner
- Partner's session activity (who's online)
- Password or security settings of partner

### 4.2 Partner CAN See:
- Shared expenses (all of them)
- All savings contributions and their amounts
- Checklist item status changes
- Activity feed entries
- Couple-level settings (wedding date, etc.)
- Personal expenses marked as "visible to partner"

### 4.3 Dispute Resolution
If Partner B edits a shared expense logged by Partner A, the original record is preserved in `shared_expense_audit_logs`. Partner A can see the edit in the activity feed and can revert it. The product does not arbitrate disputes — it preserves history.

---

## 5. Audit Logging

### 5.1 What Is Audited
| Action | Audit Level |
|--------|------------|
| Shared expense created | Full payload logged |
| Shared expense updated | Before + after state logged |
| Shared expense deleted | Final state logged |
| Savings contribution created | Logged |
| Savings contribution deleted | Logged |
| Settlement created | Logged |
| Couple settings changed | Logged (wedding date, name) |
| Partner joined couple | Logged |
| Partner left couple | Logged |

### 5.2 Audit Log Integrity
- `shared_expense_audit_logs` is **append-only** — no updates or deletes
- Audit entries include: actor ID, timestamp, action type, before/after state
- Retention: 12 months minimum

### 5.3 Activity Feed vs. Audit Log
- **Activity feed** (`activity_logs`): User-facing, friendly, limited to recent items, displayed in the app
- **Audit log** (`shared_expense_audit_logs`): System-facing, forensic, complete history, not displayed to users directly

---

## 6. Input Validation & Injection Prevention

### 6.1 SQL Injection
- **Eloquent ORM** with parameterized queries used throughout — no raw SQL string concatenation
- Laravel Query Builder also uses parameterized queries
- No raw SQL with user input

### 6.2 XSS Prevention
- React's JSX auto-escapes content by default — `dangerouslySetInnerHTML` never used with user content
- Content Security Policy header: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`
- Inertia renders content through React — no server-side HTML injection vector

### 6.3 Mass Assignment
- All models use `$fillable` (see 2.3)
- Request classes validate and transform input before it reaches models

### 6.4 File Upload Security (V1.5 — receipts)
- File type validation (MIME type + extension)
- File size limits (max 5MB)
- Files stored in private storage, not publicly accessible
- Virus scanning (V2)

---

## 7. Invitation Token Security

The couple invitation system uses security-sensitive tokens:

- **Token generation:** `Str::random(64)` — 64 characters of cryptographically random string
- **Token storage:** Stored as-is in database (not hashed, since it needs exact-match lookup — acceptable risk given 72h expiry and single-use nature)
- **Token exposure:** Sent only via email to the specific invited address
- **Token validation:** Checks token exists, not expired, status = 'pending', couple status = 'pending'
- **Token expiry:** 72 hours from creation
- **Single-use:** Token marked 'accepted' immediately on use — concurrent redemption race condition handled via database transaction

---

## 8. Abuse Prevention

### 8.1 Rate Limiting (Laravel)
| Endpoint | Limit |
|---------|-------|
| POST /login | 5/min per IP+email |
| POST /register | 10/hour per IP |
| POST /forgot-password | 3/hour per IP |
| POST /couple/invite | 5/hour per user |
| POST /expenses/* | 60/min per user |
| POST /savings/* | 30/min per user |

### 8.2 Input Length Limits
All text inputs have maximum lengths enforced at both frontend and backend:
- Description fields: 500 characters
- Names: 200 characters
- Notes: 300 characters
- This prevents storage exhaustion and UI rendering attacks

### 8.3 Monetary Limits
- Maximum single transaction amount: Rp 999,999,999,999 (architectural limit for BIGINT — not a business rule)
- Minimum amount: 1 (smallest currency unit)

### 8.4 Couple Spam Prevention
- Maximum 3 pending invitations per user lifetime (prevents invitation email spam)
- Each new invitation invalidates the previous

---

## 9. Infrastructure Security (Recommendations)

These are recommendations for the deployment environment:

1. **Firewall:** Only ports 80 and 443 open publicly; database port (3306) accessible only from application server
2. **Database credentials:** Stored in `.env`, never in version control; `.env` excluded from `.gitignore`
3. **Environment separation:** Separate `.env` files for local, staging, production
4. **Dependency scanning:** `composer audit` and `npm audit` run in CI/CD pipeline
5. **Backup:** Daily automated database backups, retained for 30 days
6. **Logging:** Application logs do not contain passwords, tokens, or financial amounts in plain text
7. **Error pages:** Custom 404, 500 pages — do not expose stack traces in production (`APP_DEBUG=false`)
8. **Security headers:** X-Content-Type-Options, X-Frame-Options, Referrer-Policy configured in nginx

---

## 10. Privacy Compliance Considerations

Depending on the target market, the following may apply:

- **Indonesia (UU PDP):** Indonesia's Personal Data Protection Law requires explicit consent for data collection, user rights to access and delete data, and data breach notification. Twogether's privacy policy must address these requirements.
- **GDPR (if EU users):** Stricter requirements for consent, right to erasure, data portability. Plan for V2 if expanding to EU.
- **Data residency:** Consider hosting in-region if operating primarily in Indonesia.

**MVP Minimum:**
- Privacy policy page (written, legally reviewed)
- Terms of service page
- Explicit consent checkbox at registration
- Contact email for data requests

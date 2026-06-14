# Prompt 04 — Couple Space, Invitation & Onboarding

## Context
Authentication is complete from Prompt 03. Now build the couple linking system and onboarding flow — the most emotionally important part of the product.

Read `03-user-flows.md` (Flows 02 and 03), `06-business-rules.md` (Section 1), and `07-design-system.md` before starting.

---

## Backend

### Middleware

**`HasActiveCouple` middleware**
- If authenticated user has no couple (or couple is dissolved): redirect to `/onboarding`
- Apply to all `(authenticated, couple active)` route group

**`CoupleActive` middleware**
- If couple status is 'dissolved': session flash error, redirect to `/onboarding`

### Actions

**`Actions/Couple/CreateCouple`**
```
Input: User $inviter, string $invitedEmail
1. Validate inviter has no active couple
2. Validate inviter not inviting themselves
3. Create Couple record (status: 'pending', partner_a_id: $inviter->id)
4. Update $inviter->couple_id
5. Create CoupleInvitation (token: Str::random(64), expires_at: now()->addHours(72))
6. Dispatch SendInvitationEmail job
7. Log activity: 'couple.invitation.sent'
8. Return: Couple, CoupleInvitation
```

**`Actions/Couple/AcceptCoupleInvitation`**
```
Input: User $invitee, CoupleInvitation $invitation
1. Validate invitation is pending and not expired
2. Validate invitee has no active couple
3. Validate invitee is not the inviter
4. DB transaction:
   - Update couple: partner_b_id = $invitee->id, status = 'active'
   - Update $invitee->couple_id
   - Update invitation: status = 'accepted', accepted_at = now()
5. Dispatch SeedChecklistOnCoupleFormed event
6. Log activity: 'couple.formed'
7. Return: Couple
```

**`Actions/Couple/LeaveCouple`**
```
Input: User $user
1. Get user's couple
2. DB transaction:
   - Update couple: status = 'dissolved', dissolved_at = now()
   - Set user->couple_id = null
   - Set partner->couple_id = null (if partner exists)
3. Log activity: 'couple.dissolved'
```

### Controllers

**`Couple/CoupleController`**
```
GET  /onboarding         → render Onboarding page
     Props: { hasCouple: bool, pendingInvitation: InvitationResource|null }

POST /couple/create
     Validate: invited_email (required, email, different from auth user email)
     Run CreateCouple action
     Redirect to /onboarding with success flash

POST /couple/invite
     (Resend invitation — if previous expired)
     Similar to create but generates new token, invalidates old

DELETE /couple/leave
     Run LeaveCouple action
     Redirect to /onboarding
```

**`Couple/InvitationController`**
```
GET  /invite/{token}
     Find invitation by token
     If expired: render with error state
     If already accepted: render with 'already used' state
     If pending: render AcceptInvitation page
     Props: { invitation: InvitationData, inviterName: string, coupleStatus: string }

POST /invite/{token}/accept
     Find and validate invitation
     If user not logged in: redirect to /register?invitation={token}
     If logged in: run AcceptCoupleInvitation action
     Redirect to /dashboard with welcome flash
```

**`Couple/OnboardingController`** (or inside CoupleController)
```
POST /onboarding/complete
     Validate: 
       couple_name (nullable, max 200)
       wedding_date (nullable, date, after today)
       currency_code (nullable, in: IDR, USD, EUR, SGD, MYR)
       budget_cents (nullable, integer, min 1)
     Update couple: name, wedding_date, currency_code
     If budget_cents: update/create savings_fund with target_amount_cents
     Redirect to /dashboard
```

### Listeners

**`SeedChecklistOnCoupleFormed`** (triggered by CoupleFormed event)
```
Load DefaultChecklist items from app/Data/DefaultChecklist.php
For each item: create ChecklistItem for the couple
  - is_system_default: true
  - created_by_id: null
  - Sort order from template
```

**`app/Data/DefaultChecklist.php`** — array of items:
```php
return [
  ['title' => 'Set your total wedding budget', 'category' => 'Planning', 'sort_order' => 1],
  ['title' => 'Choose and book your venue', 'category' => 'Venue', 'sort_order' => 2],
  ['title' => 'Set a wedding date', 'category' => 'Planning', 'sort_order' => 3],
  ['title' => 'Book a photographer', 'category' => 'Photography', 'sort_order' => 4],
  ['title' => 'Book a videographer', 'category' => 'Photography', 'sort_order' => 5],
  ['title' => 'Book catering', 'category' => 'Catering', 'sort_order' => 6],
  ['title' => 'Book a florist', 'category' => 'Decorations', 'sort_order' => 7],
  ['title' => 'Book music / DJ / band', 'category' => 'Music', 'sort_order' => 8],
  ['title' => 'Send save-the-dates', 'category' => 'Invitations', 'sort_order' => 9],
  ['title' => 'Design and send formal invitations', 'category' => 'Invitations', 'sort_order' => 10],
  ['title' => 'Choose bridal attire', 'category' => 'Attire', 'sort_order' => 11],
  ['title' => "Choose groom's attire", 'category' => 'Attire', 'sort_order' => 12],
  ['title' => 'Schedule final dress fitting', 'category' => 'Attire', 'sort_order' => 13],
  ['title' => 'Apply for marriage certificate', 'category' => 'Legal', 'sort_order' => 14],
  ['title' => 'Plan the honeymoon', 'category' => 'Honeymoon', 'sort_order' => 15],
  ['title' => 'Book honeymoon accommodation', 'category' => 'Honeymoon', 'sort_order' => 16],
  ['title' => 'Arrange guest accommodation', 'category' => 'Guests', 'sort_order' => 17],
  ['title' => 'Plan the rehearsal dinner', 'category' => 'Planning', 'sort_order' => 18],
  ['title' => 'Create seating arrangements', 'category' => 'Guests', 'sort_order' => 19],
  ['title' => 'Write wedding vows', 'category' => 'Ceremony', 'sort_order' => 20],
];
```

### Jobs & Notifications

**`Jobs/SendInvitationEmail`** (queued)
```
Send a beautiful HTML email to the invited email address containing:
- Inviter's display_name
- Personalized subject: "[Name] wants to plan your wedding together 💍"
- Branded email template (pink, warm)
- Large CTA button: "Accept Invitation & Join"
- Link: /invite/{token}
- Note: "This invitation expires in 72 hours"
```

---

## React Pages & Components

### Page: `resources/js/pages/Couple/AcceptInvitation.tsx`

States to handle:
1. **Valid invitation:** Show inviter's name, "X wants to plan your wedding together on Twogether." CTA: "Create Account & Join" (if not logged in) or "Join Couple Space" (if logged in)
2. **Expired invitation:** Friendly message, suggest contacting the inviter to resend
3. **Already accepted:** "This invitation has already been used."

Design: Centered card, pink accent elements, romantic illustration or heart graphic at top.

### Page: `resources/js/pages/Couple/Onboarding.tsx`

**Multi-step wizard with 4 steps:**

Step indicator at top: 4 dots, active dot is pink-filled, completed dots have checkmark.

**Step 1 — Welcome**
```
Large heading: "Welcome to Twogether! 💕"
Subtext: "Let's set up your couple space in just a few steps."
If couple is pending (partner not yet joined):
  Show: "Waiting for [email] to accept your invitation..."
  With a resend link
If user joined via invitation:
  Show: "You're now connected with [inviter name]! 🎉"
CTA: "Let's start →"
```

**Step 2 — Couple Identity**
```
Heading: "What should we call your space?"
Field: Couple name (optional) — placeholder: "Reza & Dinda's Journey"
Pre-fill suggestion: "[Partner A] & [Partner B]"
Avatar placeholder / upload (V1.5 — show placeholder for now)
CTA: "Next →" (skip also available)
```

**Step 3 — Your Wedding Date**
```
Heading: "When's the big day? 📅"
Subtext: "Don't worry if you haven't decided yet — you can always update this later."
Date picker (shadcn Calendar, pink accent)
"We haven't decided yet" checkbox → skips date
If date selected: animated preview "Your wedding is in [X] days! 🎊"
CTA: "Next →"
```

**Step 4 — Wedding Budget**
```
Heading: "Do you have a budget in mind?"
Subtext: "This helps us track your savings progress. Totally optional."
Currency selector (select, default IDR)
Amount input (formatted currency input)
"We'll figure it out later" option → skip
CTA: "Let's go! →"
```

**Step 5 — Ready!**
```
Full-screen celebration moment:
Large: "You're all set! 🎉"
3 feature highlight cards with icons:
  - 💳 "Track expenses together"
  - 💰 "Save for your dream wedding"  
  - ✅ "Plan every detail"
CTA button: "Go to Dashboard" (large, pink, with subtle sparkle animation)
```

### Template: `resources/js/components/templates/OnboardingLayout.tsx`
```
Clean, centered layout
Progress step indicator at top
Back button (except step 1)
Content area with smooth slide transition between steps (CSS transition)
Mobile: full screen with scrollable content
```

---

## Acceptance Criteria
- [ ] Creating a couple sends an invitation email (check Laravel log in development)
- [ ] Invitation link shows correct inviter name
- [ ] Accepting invitation (new user flow) creates account and joins couple
- [ ] Accepting invitation (existing user flow) joins couple
- [ ] Expired token shows friendly error
- [ ] Couple status changes from 'pending' to 'active' on acceptance
- [ ] Default checklist is seeded when couple becomes active (verify in DB)
- [ ] Onboarding wizard steps flow correctly with back/next navigation
- [ ] Step 3 shows live countdown preview when date is selected
- [ ] Step 4 creates savings_fund record when budget is entered
- [ ] Onboarding can be completed without filling any optional fields
- [ ] `/onboarding` redirects to `/dashboard` if user already has an active couple
- [ ] `HasActiveCouple` middleware redirects unauthenticated couple routes to `/onboarding`
- [ ] Leave couple dissolves the couple and redirects both users to `/onboarding`

## Notes
- The onboarding is a critical first impression — step transitions should feel smooth and celebratory
- Copy must be warm and personal — read `07-design-system.md` voice/tone section
- Commit message: `feat: couple space, invitation system, and onboarding wizard`

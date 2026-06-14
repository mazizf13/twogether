# Prompt 09 — Settings, Profile & Couple Settings

## Context
Wedding features are complete from Prompt 08. Now build the settings system — profile management, couple settings, and the danger zone.

Read `03-user-flows.md` (Flow 08), `06-business-rules.md` (Sections 1, 3), and `07-design-system.md` before starting.

---

## Backend

### `Settings/ProfileController`
```
GET  /settings/profile
  Props: {
    user: UserResource (full detail for editing),
    couple: CoupleResource
  }

PUT  /settings/profile
  Validate:
    display_name: required, string, min:1, max:100
    avatar_url: nullable, url, max:500  (V1.5: file upload; MVP: URL only)
  Update user: display_name, avatar_url
  Flash: "Profile updated"
  Log activity: 'user.profile.updated'
```

### `Settings/CoupleSettingsController`
```
GET  /settings/couple
  Props: {
    couple: CoupleResource (full detail),
    user: UserResource
  }

PUT  /settings/couple
  Validate:
    name: nullable, string, max:200
    wedding_date: nullable, date
    currency_code: nullable, in:['IDR', 'USD', 'EUR', 'SGD', 'MYR', 'AUD', 'GBP']
  
  Track if wedding_date changed (for activity log and notification)
  Update couple
  Flash: "Couple settings updated"
  If wedding_date changed:
    Log activity: 'couple.wedding_date.changed' with {old_date, new_date}
```

### `Settings/SecurityController`
```
GET  /settings/security
  Props: { user: UserResource }

PUT  /settings/security/password
  Validate:
    current_password: required
    password: required, min:8, confirmed
    password_confirmation: required
  Verify current_password using Hash::check()
  If wrong: return error "Your current password is incorrect"
  Update user password (Hash::make())
  Regenerate session (Auth::logoutOtherDevices() for V1.5)
  Flash: "Password updated successfully"
```

### `Couple/CoupleController@leave`
```
DELETE /couple/leave
  Auth user must have an active couple
  Run Actions/Couple/LeaveCouple action
  Auth::logout() → no, keep them logged in but redirect to /onboarding
  Flash: "You have left the couple space. Your personal data remains private."
  Redirect to /onboarding
```

### `Settings/NotificationController` (MVP stub — full in V1.5)
```
GET  /settings/notifications
  Props: { user: UserResource, preferences: NotificationPreferences }

PUT  /settings/notifications
  Update user.notification_preferences (JSON column)
  
  Notification preference keys (MVP: store but don't fully implement):
    partner_added_expense: bool (default true)
    partner_added_contribution: bool (default true)
    partner_completed_task: bool (default true)
    milestone_reached: bool (default true)
    wedding_countdown_reminders: bool (default true)
```

---

## React — Templates

### `components/templates/SettingsLayout.tsx`
```tsx
// Props: { children, currentSection: string }
// Structure:
//   AppShell wrapper (same sidebar/bottom nav)
//   Inner layout: 2-column on md+ (settings sidebar 240px + content area)
//   
// Settings sidebar (left, desktop only):
//   "Settings" heading (H3)
//   Nav items:
//     [User icon]  Profile                → /settings/profile
//     [Heart icon] Couple Settings        → /settings/couple
//     [Bell icon]  Notifications          → /settings/notifications
//     [Lock icon]  Security               → /settings/security
//   
//   Separator
//   
//   Danger Zone section:
//     [LogOut icon] Leave Couple Space   (danger/red text)
//   
// On mobile: settings sidebar becomes a select/dropdown at top of page
// Active item: same pink highlight as main sidebar
```

---

## React — Pages

### `pages/Settings/Profile.tsx`
```tsx
// SettingsLayout wrapper
// Section: "Your Profile"
// 
// Avatar section:
//   Large avatar (80x80, rounded-full)
//   User's current display name below
//   "Change photo" link (V1.5: file upload; MVP: URL input)
//
// Form:
//   Display Name (text input, pre-filled)
//   Email (text, read-only — "To change your email, contact support" note)
//   Submit: "Save Changes" (pink primary)
//
// Partner info section (read-only, beneath form):
//   "Your Partner" card:
//     Partner avatar + name
//     "Edit couple settings →" link
```

### `pages/Settings/Couple.tsx`
```tsx
// SettingsLayout wrapper
// Section: "Couple Settings"
//
// Couple identity:
//   Couple name input (placeholder: "Reza & Dinda's Journey")
//   Couple avatar (MVP: show placeholder, V1.5: upload)
//
// Wedding details:
//   Wedding date (date picker with shadcn Calendar)
//   If date already set: show countdown preview inline ("Your wedding is in X days")
//   Currency (select: IDR, USD, EUR, SGD, MYR, AUD, GBP)
//
// Submit: "Save Changes"
//
// Partner section (read-only):
//   Both partner names/avatars shown
//   "Partner status: Active" badge (both joined)
//   OR "Waiting for partner to join" with invitation resend option
//
// Danger zone (at bottom, separated by divider):
//   Red/danger styled section
//   "Leave Couple Space" button
//   Brief explanation: "This will permanently remove you from this couple space."
//   LeaveConfirmationModal trigger
```

### `pages/Settings/Security.tsx`
```tsx
// SettingsLayout wrapper
// Section: "Security"
//
// Change Password form:
//   Current Password (password input)
//   New Password (password input with strength indicator)
//   Confirm New Password
//   Submit: "Update Password"
//
// Password strength indicator:
//   Below "New Password" field
//   Shows bar filling: weak (red) → fair (amber) → strong (green)
//   Criteria: length >= 8 (fair), length >= 12 + mixed case + numbers (strong)
//
// Session info section (MVP: display only)
//   "You are currently logged in on this device."
//   "Log out of all other devices" (V1.5)
```

### `pages/Settings/Notifications.tsx`
```tsx
// SettingsLayout wrapper
// Section: "Notification Preferences"
//
// Note at top: "Notification delivery coming soon — these preferences will be 
//   applied when notifications are enabled."
//
// Toggle list (Switch components):
//   [Toggle] When partner adds a shared expense
//   [Toggle] When partner makes a savings contribution
//   [Toggle] When partner completes a checklist task
//   [Toggle] When you reach a savings milestone
//   [Toggle] Wedding countdown reminders (6 months, 3 months, 1 month, 1 week)
//
// Submit: "Save Preferences"
// 
// NOTE: These preferences are stored in V1.5 but displayed here in MVP
//   to set user expectations and gather implicit intent data.
```

---

## React — Modal

### `modals/LeaveCouplModal.tsx`
```tsx
// DANGER modal — high-stakes confirmation
// 
// Props: { partnerName: string, coupleName: string, onConfirm, onCancel }
//
// Design:
//   Warning icon (amber) at top
//   Title: "Leave Couple Space?"
//   Description:
//     "You are about to leave [Couple Name]."
//     "• Your personal expenses will remain private to you"
//     "• Shared expenses and savings will remain with [PartnerName]"
//     "• This action cannot be undone — you would need to create a new couple space"
//
//   Confirmation input:
//     Label: 'Type "LEAVE" to confirm'
//     Input: text (validates against "LEAVE" before enabling button)
//
//   Footer:
//     "Cancel" (ghost button)
//     "Leave Couple Space" (danger button — only enabled when input == "LEAVE")
```

---

## Acceptance Criteria
- [ ] Profile name update reflects immediately in sidebar and header
- [ ] Email field is read-only (cannot be changed from UI)
- [ ] Couple settings update: name and wedding date save correctly
- [ ] Wedding date change shows updated countdown preview inline
- [ ] Currency change reflected in all monetary displays (verify by changing and reloading)
- [ ] Password change with wrong current password shows correct error
- [ ] Password change with mismatched confirmation shows validation error
- [ ] Password strength indicator shows correct strength levels
- [ ] Notification preferences save to database (verify in DB)
- [ ] Settings navigation works on both desktop (sidebar) and mobile (dropdown/select)
- [ ] Leave couple: confirmation input MUST say "LEAVE" exactly to enable button
- [ ] Leave couple: both partners' couple_id set to null, couple status → dissolved
- [ ] After leaving: redirected to /onboarding, cannot access couple routes
- [ ] After leaving: personal expenses still accessible if user creates new couple (verify data isolation)
- [ ] SettingsLayout renders as 2-column on desktop and stacked on mobile

## Notes
- The LeaveCouple confirmation flow must be high-friction on purpose — this is a destructive action
- Currency change is couple-level, not user-level — both partners see the new currency immediately
- Settings pages don't need to be flashy — they should be clean, clear, and functional
- Commit message: `feat: settings pages (profile, couple, security, notifications)`

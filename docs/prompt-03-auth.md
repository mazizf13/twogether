# Prompt 03 — Authentication (Register, Login, Password Reset)

## Context
Migrations and models are complete from Prompt 02. Now build the complete authentication system with Inertia + React pages and all backend logic.

Read `03-user-flows.md` (Flow 01) and `07-design-system.md` before starting.

## Visual Design Requirements
- All auth pages use `AuthLayout.tsx` — a centered, full-height layout
- Left side (desktop): Brand panel — deep pink gradient background, Twogether logo, tagline "Plan your forever, together"
- Right side: White card with the auth form
- Mobile: Full white screen with logo at top
- Pink primary button for all CTAs
- Warm, encouraging copy tone throughout

---

## Backend

### Controllers

**`Auth/RegisterController`**
```
POST /register
- Validate: display_name (required, max 100), email (required, email, unique:users), password (required, min 8, confirmed)
- Create user with uuid, display_name, email, bcrypt(password)
- Log in the user: Auth::login($user)
- Redirect to /onboarding via Inertia
```

**`Auth/LoginController`**
```
GET  /login   → return Inertia::render('Auth/Login')
POST /login
- Validate: email, password, remember (optional boolean)
- Rate limit: 5 attempts per minute (throttle middleware)
- Auth::attempt(['email' => $email, 'password' => $password], $remember)
- On success: session()->regenerate(), redirect to /dashboard (or /onboarding if no couple)
- On failure: back with error 'These credentials do not match our records.'
POST /logout
- Auth::logout(), session invalidate/regenerate
- Redirect to /login
```

**`Auth/ForgotPasswordController`**
```
GET  /forgot-password → Inertia::render('Auth/ForgotPassword')
POST /forgot-password
- Validate: email
- Password::sendResetLink(['email' => $email])
- Always return success message (don't reveal if email exists)
- "If an account with that email exists, we've sent a password reset link."
```

**`Auth/ResetPasswordController`**
```
GET  /reset-password/{token} → Inertia::render('Auth/ResetPassword', ['token' => $token, 'email' => $request->email])
POST /reset-password
- Validate: token, email, password (min 8, confirmed)
- Password::reset() with callback to update user password and re-login
- On success: redirect to /dashboard
- On failure: back with errors
```

### Middleware
Register these in the route file:
- `auth` → redirect to /login
- `guest` → redirect to /dashboard if authenticated
- `throttle:5,1` on POST /login

---

## React Pages (Atomic Design)

### Template: `resources/js/components/templates/AuthLayout.tsx`

```tsx
// Props: children, title, subtitle (optional)
// Layout:
// - Full viewport height, flex row on desktop, flex column on mobile
// - Left panel (hidden on mobile, w-1/2 on lg): 
//     - Background: gradient from pink-600 to pink-800 (or rose-600 to pink-800)
//     - Twogether logo (SVG or text-based): white, centered
//     - Tagline: "Plan your forever, together" — white, italic, DM Serif if available
//     - Decorative element: subtle ring/heart SVG or abstract romantic shape
// - Right panel (full width on mobile, w-1/2 on lg):
//     - White background
//     - Centered vertically and horizontally
//     - Max width 400px content area
//     - Top: small Twogether logo (mobile only)
//     - Title (H2, neutral-900)
//     - Subtitle (body-small, neutral-500)
//     - children (the form)
```

### Page: `resources/js/pages/Auth/Register.tsx`

Form fields (using React Hook Form + Zod):
```
- Display Name: text input, placeholder "Your name"
- Email: email input, placeholder "you@example.com"  
- Password: password input with show/hide toggle
- Confirm Password: password input with show/hide toggle
- Submit button: "Create Account" (full width, pink primary)
- Footer link: "Already have an account? Log in"
```

Zod schema:
```ts
z.object({
  display_name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation']
})
```

Use Inertia `useForm` for submission — maps validation errors from backend automatically.

### Page: `resources/js/pages/Auth/Login.tsx`

Form fields:
```
- Email: email input
- Password: password input with show/hide toggle
- Remember me: checkbox
- Submit: "Sign In" (full width, pink primary)
- Forgot password link (right-aligned, small)
- Footer: "Don't have an account? Create one"
```

Show flash error messages from session at top of form (inside a red-tinted alert).

### Page: `resources/js/pages/Auth/ForgotPassword.tsx`

```
- Brief description: "Enter your email and we'll send you a reset link."
- Email input
- Submit: "Send Reset Link" (full width, pink primary)
- Back to login link
- Show success state after submit: 
    Illustration or checkmark icon
    "Check your inbox! We've sent instructions to [email]"
    "Didn't receive it? Resend" link (re-enables after 60s)
```

### Page: `resources/js/pages/Auth/ResetPassword.tsx`

```
- Email (pre-filled, read-only)
- New Password (with strength indicator)
- Confirm New Password
- Submit: "Set New Password"
- On error (expired token): Show "This link has expired" with link to request a new one
```

---

## Atoms & Molecules Needed

### `atoms/ui/input.tsx` (extend shadcn Input)
Add a wrapper version with icon-left and icon-right support.

### `molecules/FormField.tsx`
```tsx
// Props: label, error, children, required?, hint?
// Renders: Label + children (input) + error message (if any)
// Error message styled with danger-text color + small warning icon
// Hint text styled with neutral-400, smaller
```

### `molecules/PasswordInput.tsx`
```tsx
// Standard Input with a toggle button (Eye / EyeOff icon from lucide-react)
// Toggles between type="password" and type="text"
// Toggle button is accessible (aria-label="Show/hide password")
```

### `atoms/Logo.tsx`
```tsx
// Props: size ('sm' | 'md' | 'lg'), variant ('default' | 'white')
// The Twogether logotype — can be text-based for MVP:
//   "twogether" in a warm font, with a small heart or ring icon
//   White variant for use on the pink auth panel
```

---

## Acceptance Criteria
- [ ] `/register` renders correctly on desktop and mobile
- [ ] Registration creates a user and redirects to `/onboarding`
- [ ] Validation errors appear inline without page reload
- [ ] Password confirmation mismatch shows error
- [ ] `/login` authenticates and redirects correctly
- [ ] Rate limiting on login (test with 6 rapid failed attempts)
- [ ] `/forgot-password` always shows success message regardless of email existence
- [ ] `/reset-password/{token}` with expired token shows appropriate error
- [ ] Password reset flow completes and logs user in
- [ ] All forms are keyboard-navigable (tab order correct)
- [ ] Password show/hide toggle works
- [ ] Pink theme applied correctly (buttons, focus rings)
- [ ] Auth layout renders correctly: split panel on desktop, single column on mobile

## Notes
- The `AuthLayout` is the most visually important component in this prompt — invest in making it beautiful
- The brand panel on the left is the first impression of Twogether — it should feel romantic and premium
- Commit message: `feat: authentication pages and backend (register, login, password reset)`

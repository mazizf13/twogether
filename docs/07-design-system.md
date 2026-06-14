# 07 — Design System

---

## Overview

This design system defines the complete visual and experiential language of Twogether. It governs every pixel, every word, and every interaction. The system is built on top of **shadcn/ui** with the **pink theme**, customized to feel warm, romantic, and premium rather than generic.

---

## Brand Identity

### Personality

Twogether speaks like a thoughtful, warm friend who happens to be great with money. Not a bank. Not a wedding planner. A wise companion on the journey to a shared life.

**Personality traits:**
- **Warm** — Genuinely caring, never clinical
- **Encouraging** — Celebrates progress, never shames
- **Calm** — Reassuring even when finances are tight
- **Smart** — Insightful without being condescending
- **Personal** — Speaks to *this* couple, not a generic user

### Voice

The product voice is **intimate and supportive**. It uses "you" and "your partner" rather than "user" or "Partner A". It uses "together" frequently because that is the product's core promise.

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Onboarding | Warm, excited | "Your journey together starts here 💕" |
| Empty states | Encouraging | "No shared expenses yet — add your first one together!" |
| Milestones | Celebratory | "You've saved 50% of your goal! You're halfway there 🎉" |
| Errors | Calm, helpful | "Something went wrong. Please try again — your data is safe." |
| Warnings | Gentle | "This item's due date has passed. Want to update it?" |
| Confirmations (delete) | Direct | "This can't be undone. Are you sure?" |
| Balance (someone owes) | Neutral | "Based on your shared expenses, [Name] owes you Rp 150,000" |

### Words We Use / Avoid

| Use | Avoid |
|-----|-------|
| "Your partner" | "User B", "Partner 2" |
| "Together" | "Both users" |
| "Contribution" | "Deposit" |
| "Wedding savings" | "Fund balance" |
| "Tasks" or "Steps" | "Checklist items" (too clinical) |
| "Log" or "Add" | "Input", "Enter data" |
| "Settle up" | "Clear debt" |

---

## Visual Language

### Design Philosophy

The visual design sits at the intersection of **editorial romance** and **modern fintech clarity**. Think: a beautifully laid-out magazine spread that also happens to have a world-class data visualization.

References and inspirations:
- **Airbnb** — Premium card-based layouts, warm photography handling
- **Notion** — Clean, spacious, respectful of content
- **Linear** — Polished micro-interactions, smooth transitions
- **Papier** (stationery brand) — Warmth, craft, romantic palette

### Design Do's
- Use white space generously
- Let data breathe — never crowd
- Use illustration-style iconography over standard icons
- Smooth, springy transitions (not abrupt)
- Progress bars and charts are always pink
- Rounded corners throughout — nothing sharp

### Design Don'ts
- No dark grays as backgrounds (warm neutrals only)
- No harsh shadows (soft, diffused only)
- No multiple competing accent colors
- No dense data tables without breathing room
- No generic stock imagery

---

## Color System

Built on shadcn/ui's pink theme. Extended with semantic tokens.

### Base Palette

```
Pink Scale (Primary Brand)
  pink-50:  #fdf2f8
  pink-100: #fce7f3
  pink-200: #fbcfe8
  pink-300: #f9a8d4
  pink-400: #f472b6
  pink-500: #ec4899   ← Primary action color
  pink-600: #db2777
  pink-700: #be185d
  pink-800: #9d174d
  pink-900: #831843

Rose Scale (Secondary / Accent)
  rose-50:  #fff1f2
  rose-100: #ffe4e6
  rose-200: #fecdd3
  rose-300: #fda4af
  rose-400: #fb7185
  rose-500: #f43f5e
  rose-600: #e11d48

Neutral (Warm Grays)
  neutral-50:  #fafaf9
  neutral-100: #f5f5f4
  neutral-200: #e7e5e4
  neutral-300: #d6d3d1
  neutral-400: #a8a29e
  neutral-500: #78716c
  neutral-600: #57534e
  neutral-700: #44403c
  neutral-800: #292524
  neutral-900: #1c1917

Success (Soft Green)
  success-light: #dcfce7
  success:       #16a34a
  success-dark:  #14532d

Warning (Warm Amber)
  warning-light: #fef9c3
  warning:       #ca8a04
  warning-dark:  #713f12

Danger (Soft Red)
  danger-light: #fee2e2
  danger:       #dc2626
  danger-dark:  #7f1d1d
```

### Semantic Color Tokens

```
Background:
  bg-base:        neutral-50    (main page background)
  bg-card:        #ffffff       (card surfaces)
  bg-subtle:      neutral-100   (secondary surfaces, input backgrounds)
  bg-overlay:     rgba(0,0,0,0.4) (modal overlays)

Text:
  text-primary:   neutral-900
  text-secondary: neutral-600
  text-muted:     neutral-400
  text-on-pink:   #ffffff

Border:
  border-default: neutral-200
  border-focus:   pink-400
  border-subtle:  neutral-100

Brand:
  brand-primary:  pink-500
  brand-hover:    pink-600
  brand-light:    pink-50
  brand-muted:    pink-100
  brand-accent:   rose-400

States:
  success-bg:     success-light
  success-text:   success-dark
  warning-bg:     warning-light
  warning-text:   warning-dark
  danger-bg:      danger-light
  danger-text:    danger-dark
```

### Chart Color Palette (shadcn/ui Chart — Pink Theme)

```
chart-1: pink-400     (#f472b6)   ← Primary data series
chart-2: rose-400     (#fb7185)   ← Secondary data series
chart-3: pink-200     (#fbcfe8)   ← Tertiary / fill areas
chart-4: pink-600     (#db2777)   ← Emphasis / highlighted
chart-5: neutral-300  (#d6d3d1)   ← Comparison / baseline
```

---

## Typography

Using **Inter** as the primary typeface (system font stack fallback). Inter is neutral, highly legible, and has excellent number rendering — critical for a finance product.

For headings on marketing/landing pages: consider **DM Serif Display** for romantic character contrast.

### Type Scale

```
Display (Hero)
  size:   3.5rem (56px)
  weight: 700
  line:   1.1
  use:    Landing page hero, special moments

H1 — Page Title
  size:   2rem (32px)
  weight: 700
  line:   1.2
  use:    Major page headings

H2 — Section Title
  size:   1.5rem (24px)
  weight: 600
  line:   1.3
  use:    Card titles, section headers

H3 — Subsection
  size:   1.25rem (20px)
  weight: 600
  line:   1.4
  use:    Subgroup headers

H4 — Label Title
  size:   1rem (16px)
  weight: 600
  line:   1.5
  use:    Form labels as headings, card labels

Body Large
  size:   1.125rem (18px)
  weight: 400
  line:   1.6
  use:    Introductory text, onboarding copy

Body Default
  size:   1rem (16px)
  weight: 400
  line:   1.6
  use:    Standard body text

Body Small
  size:   0.875rem (14px)
  weight: 400
  line:   1.5
  use:    Secondary descriptions, captions

Caption / Label
  size:   0.75rem (12px)
  weight: 500
  line:   1.4
  use:    Tags, badges, metadata

Numeric Display
  size:   2.5rem–4rem
  weight: 700
  variant: tabular-nums
  use:    Countdown, savings totals, balance
```

---

## Spacing System

Using a base-8 spacing scale (consistent with shadcn/ui and Tailwind defaults).

```
0.5 → 4px
1   → 8px
1.5 → 12px
2   → 16px
3   → 24px
4   → 32px
5   → 40px
6   → 48px
8   → 64px
10  → 80px
12  → 96px
16  → 128px
20  → 160px
24  → 192px
```

### Layout Spacing Conventions

| Element | Spacing |
|---------|---------|
| Page horizontal padding (desktop) | 48px (6) |
| Page horizontal padding (mobile) | 16px (2) |
| Card internal padding | 24px (3) |
| Form field vertical gap | 16px (2) |
| Section gap | 32px (4) |
| Inline element gap | 8px (1) |

---

## Border Radius System

```
sm:   4px   → Small badges, tags
md:   8px   → Inputs, small buttons
lg:   12px  → Cards, modals, large buttons
xl:   16px  → Large cards, feature panels
2xl:  24px  → Hero cards, prominent sections
full: 9999px→ Pill buttons, avatar chips, progress bars
```

Guiding rule: **Larger elements get larger radii.** The overall aesthetic is soft and rounded, never sharp.

---

## Shadow / Elevation System

```
shadow-xs:  0 1px 2px rgba(0,0,0,0.04)
shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
shadow-md:  0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)
shadow-lg:  0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)
shadow-xl:  0 20px 25px rgba(0,0,0,0.07), 0 10px 10px rgba(0,0,0,0.04)

shadow-pink-sm: 0 2px 8px rgba(236,72,153,0.15)  → For pink buttons hover state
shadow-pink-md: 0 4px 16px rgba(236,72,153,0.20) → For pink action cards
```

Elevation layers:
- **Level 0:** Page background (no shadow)
- **Level 1:** Cards (`shadow-sm`)
- **Level 2:** Hover cards, dropdowns (`shadow-md`)
- **Level 3:** Floating panels, drawers (`shadow-lg`)
- **Level 4:** Modals, dialogs (`shadow-xl`)

---

## Component Specifications

### Buttons

**Primary Button**
- Background: pink-500
- Text: white
- Hover: pink-600, shadow-pink-sm
- Active: pink-700
- Disabled: pink-200, text pink-400, cursor-not-allowed
- Border radius: lg (12px)
- Padding: 10px 20px
- Height: 40px (default), 48px (large)

**Secondary Button**
- Background: white
- Border: 1.5px solid neutral-200
- Text: neutral-700
- Hover: bg neutral-50, border neutral-300
- Border radius: lg

**Ghost Button**
- Background: transparent
- Text: neutral-600
- Hover: bg neutral-100
- Use: Low-emphasis actions

**Danger Button**
- Background: danger-light
- Text: danger-dark
- Hover: danger background slightly darkened
- Use: Destructive actions only (delete, leave couple)

**States:** All buttons must have visible focus ring (pink-400 ring, 2px offset) for keyboard navigation.

---

### Inputs

- Height: 40px (default)
- Border: 1.5px solid neutral-200
- Border radius: md (8px)
- Background: white
- Focus: border pink-400, shadow-pink-sm
- Error: border danger, error text below in danger-text color
- Placeholder: neutral-400
- Padding: 10px 12px

**Special Inputs:**
- **Amount Input:** Right-aligned number, currency prefix (Rp), tabular-nums font
- **Date Picker:** shadcn Calendar component, pink accent
- **Percentage Slider:** Pink track, pink thumb

---

### Cards

**Standard Card**
- Background: white
- Border: 1px solid neutral-100
- Border radius: xl (16px)
- Shadow: shadow-sm
- Padding: 24px

**Interactive Card (clickable)**
- Hover: shadow-md, border neutral-200
- Transition: all 200ms ease

**Accent Card (highlights)**
- Background: pink-50
- Border: 1px solid pink-200

**Stat Card**
- Contains: label (text-muted, caption), value (H2 or numeric display), optional trend indicator

---

### Modals

- Overlay: rgba(0,0,0,0.4) with blur: 2px
- Container: white, border radius 2xl (24px), shadow-xl
- Max width: 480px (form modals), 640px (content modals)
- Header: H3 + close button (X icon)
- Footer: Action buttons right-aligned (cancel left, primary right)
- Animation: scale from 0.95 → 1.0, fade in (150ms)

**Accessibility:** Focus trapped within modal when open. Escape key closes. First focusable element focused on open.

---

### Navigation

**Desktop Sidebar**
- Width: 240px (collapsed: 64px)
- Background: white
- Border right: 1px solid neutral-100
- Active item: pink-50 background, pink-500 icon and text, pink-300 left accent bar
- Inactive item: neutral-600 icon, neutral-700 text
- Hover: neutral-50 background

**Mobile Bottom Navigation**
- Background: white
- Border top: 1px solid neutral-100
- Height: 64px
- 4 items: icon + label
- Active: pink-500 icon and label
- Inactive: neutral-400

---

### Charts (shadcn/ui Charts — Recharts)

All charts use the pink palette defined above.

**Bar Charts:** Rounded top corners (radius 4px), pink-400 primary bars
**Line Charts:** Pink-500 line, pink-100 area fill, circular data point dots
**Progress Bars:** 
- Track: pink-100
- Fill: pink-500 → pink-400 gradient
- Border radius: full
- Height: 8px (compact), 12px (standard), 16px (large)
**Donut/Pie:** Pink palette slices with white center showing total value

---

### Empty States

Every section that can be empty has a custom empty state. Never show a blank white box.

**Components:**
- Illustration (custom SVG, on-brand)
- Heading: "No [items] yet"
- Subtext: Encouraging action prompt
- CTA button

**Example — No Shared Expenses:**
> *"No shared expenses yet"*
> *"Add your first shared expense and start tracking what you spend together."*
> `[Add Shared Expense]`

---

### Progress Indicators

**Milestone Progress (Savings):**
- Large progress bar with milestone markers at 25%, 50%, 75%, 100%
- Below bar: "X% saved · Rp Y remaining"
- Milestone markers show a small diamond icon that fills pink when reached

**Goal Progress (Individual Goals):**
- Standard progress bar (pink-500 fill)
- Percentage and amounts shown below
- On completion: bar turns fully pink with a sparkle animation

**Checklist Progress:**
- Circular progress indicator (donut) in the header
- Percentage text in the center
- "X of Y tasks complete" label

---

## Accessibility Considerations

1. **Color is never the only signal** — Errors use icons + text + color. Success states use icons + text + color.
2. **All interactive elements have visible focus states** — 2px pink ring, 2px offset.
3. **Touch targets minimum 44×44px** — Especially critical for mobile.
4. **Form labels always visible** — No placeholder-as-label pattern.
5. **Loading states announced to screen readers** — `aria-live` regions for dynamic content.
6. **Modals trap focus** — Tab cycling stays within the modal.
7. **Error messages linked to inputs** — `aria-describedby` references error text.
8. **Charts have text alternatives** — Summary text below every chart describing the data.
9. **Pink-only interactive elements** — Pink-500 on white: contrast ratio 4.62:1 (meets AA for large text; for small text use pink-600).
10. **Animations respect prefers-reduced-motion** — All decorative animations disabled when system setting is active.

# Prompt 01 — Project Setup & Infrastructure

## Context
You are building **Twogether** — a warm, romantic, modern web application for couples preparing for marriage. The full product documentation is in `/docs`. Read `00-project-vision.md` and `10-frontend-architecture.md` before starting.

## Tech Stack
- **Backend:** Laravel 13
- **Database:** MySQL
- **Frontend Bridge:** Inertia.js
- **Frontend:** React + TypeScript
- **UI Library:** shadcn/ui (pink theme)
- **Styling:** Tailwind CSS
- **Component Architecture:** Atomic Design

## Your Task

Set up the complete Laravel 13 project from scratch with all dependencies, configuration, and base structure.

### 1. Laravel Project

```bash
composer create-project laravel/laravel twogether
cd twogether
```

Install PHP dependencies:
```bash
composer require inertiajs/inertia-laravel
composer require laravel/breeze  # for auth scaffold - we'll customize it
```

### 2. Frontend Dependencies

```bash
npm install
npm install @inertiajs/react react react-dom
npm install -D @types/react @types/react-dom typescript
```

Install shadcn/ui:
```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Pink**
- CSS variables: **Yes**

Install all shadcn components needed:
```bash
npx shadcn@latest add button input label card dialog sheet tabs badge avatar progress checkbox switch select separator skeleton toast tooltip popover calendar command
```

Install additional dependencies:
```bash
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
npm install lucide-react
npm install recharts
npm install class-variance-authority clsx tailwind-merge
```

### 3. Inertia.js Configuration

Configure `app/Http/Kernel.php` (or bootstrap/app.php for Laravel 13) to include the Inertia middleware.

Create `resources/js/app.tsx`:
```tsx
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
    return pages[`./pages/${name}.tsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
  progress: {
    color: '#ec4899',
  },
})
```

Update `resources/views/app.blade.php` as the Inertia root template.

### 4. TypeScript Configuration

Create `tsconfig.json` with:
- `strict: true`
- Path aliases: `@/*` → `./resources/js/*`
- Include `resources/js/**/*`

Update `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
    },
  },
})
```

### 5. Tailwind Configuration

Update `tailwind.config.js` to include the full shadcn/ui configuration with the pink theme. Ensure content paths include all blade and tsx files.

### 6. CSS Variables (Pink Theme)

In `resources/css/app.css`, set up the complete shadcn pink theme CSS variables as defined in `07-design-system.md`. Include:
- Light mode variables
- Dark mode variables (dark: class strategy)
- Custom font (Inter via Google Fonts import)
- Custom `shadow-pink-sm` and `shadow-pink-md` utilities

### 7. Laravel Application Structure

Create the following directory structure under `app/`:
```
app/
├── Actions/
│   ├── Couple/
│   ├── Expenses/
│   ├── Savings/
│   └── Checklist/
├── Services/
├── Policies/
├── Events/
├── Listeners/
├── Jobs/
└── Resources/
    └── (Inertia resource classes)
```

### 8. Environment Configuration

Update `.env.example` with all required variables:
```
APP_NAME=Twogether
APP_ENV=local
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=twogether
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_FROM_ADDRESS=hello@twogether.app
MAIL_FROM_NAME="Twogether"

QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_LIFETIME=120
```

### 9. Base Utility Files

Create `resources/js/lib/utils.ts`:
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amountCents: number, currencyCode: string = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountCents / 100)
}

export function formatDate(date: string | Date, format: string = 'dd MMM yyyy'): string {
  // use date-fns format
}

export function calculateCountdown(weddingDate: string): { days: number; weeks: number; months: number } {
  // return countdown values
}
```

Create `resources/js/types/index.ts` with all base TypeScript interfaces as documented in `10-frontend-architecture.md`.

### 10. Shared Inertia Props

Create `app/Http/Middleware/HandleInertiaRequests.php` (or update existing) to share:
```php
return array_merge(parent::share($request), [
    'auth' => [
        'user' => $request->user() ? new UserResource($request->user()) : null,
        'couple' => $request->user()?->couple ? new CoupleResource($request->user()->couple) : null,
    ],
    'flash' => [
        'success' => fn () => $request->session()->get('success'),
        'error' => fn () => $request->session()->get('error'),
    ],
]);
```

## Acceptance Criteria
- [ ] `composer install` runs without errors
- [ ] `npm install && npm run dev` runs without errors
- [ ] Pink theme CSS variables are correctly applied
- [ ] TypeScript compiles without errors
- [ ] shadcn/ui components are installed and importable
- [ ] Inertia.js is configured and the root blade template is correct
- [ ] Directory structure for Atomic Design components is created
- [ ] All base type definitions are in place
- [ ] `.env.example` is complete

## Notes
- Do NOT generate any pages or database migrations yet — those come in later prompts
- The goal of this prompt is a clean, runnable foundation
- Commit message: `feat: initial project setup with Laravel 13, Inertia, React, shadcn/ui pink theme`

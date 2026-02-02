# Budget Tracker

A **mobile-first**, production-ready budget tracker web app for students. Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL, and NextAuth.

## Features

- **Authentication** – Email + password (NextAuth), secure sessions, protected routes
- **Transactions** – One-tap add, amount/category/income|expense/date/note, edit & delete
- **Categories** – Default student-friendly categories + custom, color-coded for charts
- **Budget limits** – Monthly budgets per category, progress bar, 70% (yellow) / 100% (red) alerts
- **Dashboard** – Balance card, monthly summary, spending donut chart, recent transactions
- **Analytics** – Monthly comparison, category breakdown, touch-friendly charts, **Export CSV**
- **UI/UX** – Tailwind + shadcn/ui, **dark mode**, skeleton-ready, accessible, thumb-friendly (min 44px tap targets)
- **Responsive** – Bottom nav (mobile), sidebar (desktop), full-screen modals, no fixed widths

## Tech stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS** (mobile-first)
- **shadcn/ui** (Radix + Tailwind)
- **Prisma** + **PostgreSQL** (Neon / Supabase)
- **NextAuth** (Credentials)
- **Recharts** (lazy-loaded)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/budget-tracker.git
cd budget-tracker
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and set:

- **DATABASE_URL** – PostgreSQL connection string (e.g. from [Neon](https://neon.tech) or [Supabase](https://supabase.com))
- **AUTH_SECRET** – Generate with: `openssl rand -base64 32`
- **NEXTAUTH_URL** – `http://localhost:3000` (dev) or your production URL

### 3. Database

```bash
npx prisma db push
npx prisma db seed
```

Seed creates a demo user: `demo@student.local` / `demo1234`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in or register.

## Deployment (Vercel)

### 1. GitHub

Push the repo to GitHub.

### 2. Vercel

1. [Vercel](https://vercel.com) → **Add New** → **Project** → Import the GitHub repo.
2. **Environment variables** (same as `.env`):
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
3. Deploy. Vercel runs `prisma generate` and `next build` automatically.

### 3. Database migrations

If you use migrations instead of `db push`:

- In **Project Settings** → **Build & Development** → set **Build Command** to:  
  `prisma generate && prisma migrate deploy && next build`
- Or run migrations from your machine or CI against the production `DATABASE_URL` after each deploy.

### 4. Post-deploy

- Confirm `NEXTAUTH_URL` matches the deployed URL.
- For a fresh DB, run the seed once:  
  `npx prisma db seed` (with production `DATABASE_URL` in `.env`).

## Project structure

```
src/
  app/
    (auth)/          # login, register
    (dashboard)/     # dashboard, transactions, analytics, budgets, categories, settings
    api/auth/        # NextAuth route
    actions/         # Server actions (auth, transactions, categories, budgets)
  components/
    layout/          # BottomNav, Sidebar, MobileHeader, DashboardShell
    transactions/    # AddTransactionFAB, AddTransactionModal
    ui/              # Button, Card, Dialog, Input, Select, etc.
  lib/
    auth.ts          # NextAuth config
    prisma.ts
    utils.ts
    validations.ts
    hooks/
prisma/
  schema.prisma
  seed.ts
```

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build (runs `prisma generate`)
- `npm run start` – Start production server
- `npm run db:push` – Push schema to DB (no migrations)
- `npm run db:seed` – Seed default categories + demo user
- `npm run db:studio` – Open Prisma Studio

## License

MIT

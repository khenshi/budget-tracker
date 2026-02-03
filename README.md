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
- **AUTH_URL** – `http://localhost:3000` (dev) or your production URL

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
2. **Environment variables** (see `.env.example`):
   - `DATABASE_URL` – PostgreSQL connection string (use **pooled** URL for Neon, Supabase, Vercel Postgres)
   - `AUTH_SECRET` – Generate with: `openssl rand -base64 32`
   - `AUTH_URL` – Your production URL, e.g. `https://your-app.vercel.app`
3. Deploy. The build runs `prisma generate && next build` automatically.

### 3. Database setup

- **First deploy**: Run `npx prisma db push` locally with `DATABASE_URL` pointing to your production DB, or use Vercel Postgres / Neon / Supabase to create the schema.
- **Migrations**: If using `prisma migrate`, set **Build Command** to:  
  `prisma generate && prisma migrate deploy && next build`

### 4. Post-deploy

- Confirm `AUTH_URL` matches your deployed URL exactly.
- For a fresh DB, run the seed once:  
  `DATABASE_URL="your-prod-url" npx prisma db seed`

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

//test

# MegaGroup — Xaricdə Təhsil Platforması

MegaGroup is a multilingual (AZ/RU/EN) study-abroad platform built with Next.js 16,
Supabase, and a headless CMS dashboard. It helps Azerbaijani students find
universities abroad — by certificate, without exams.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.10 (App Router, RSC) |
| UI | React 19, Tailwind CSS 4, GSAP + framer-motion |
| 3D | Three.js / R3F |
| Backend | Supabase (Postgres + Auth + RLS + triggers) |
| Validation | Zod 4 |
| i18n | next-intl (AZ/RU/EN, prefix-always) |
| Testing | Vitest 4, Playwright 1.45, @axe-core/playwright |
| CI | GitHub Actions |

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (free tier is fine)

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your Supabase keys
cp .env.example .env.local
# Edit .env.local with your real keys

# 3. Run Supabase migrations (in order, see below)

# 4. Seed demo data (optional)
npm run seed --env-file=.env.local

# 5. Start the dev server

## Supabase Migrations

Migrations run in order. Apply them via Supabase Dashboard SQL Editor or `supabase db push`:

| # | File | Purpose |
|---|---|---|
| 1 | `0001_init_multilang_cms.sql` | CMS tables (countries, universities, faculties, fees, FAQs, testimonials, site_content) |
| 2 | `0002_grants.sql` | GRANT permissions for anon + authenticated |
| 3 | `0003_applications.sql` | Applications table + anon INSERT policy |
| 4 | `0004_admin_rls.sql` | Admin-only RLS policies (app_metadata role check) |
| 5 | `0005_indexes.sql` | Performance indexes |
| 6 | `0006_soft_delete.sql` | Soft-delete columns (is_deleted, deleted_at) |
| 7 | `0007_audit_log.sql` | Audit log table + triggers |

### Setting Up Admin Access

1. **Disable public signup**: Supabase Dashboard -> Authentication -> Providers -> Email -> "Enable email signup" = OFF
2. **Create admin user** via SQL Editor:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'your-email@example.com';
   ```

## Testing

### Unit Tests (Vitest)

```bash
npm test              # Run all unit tests
npm run test:coverage # With coverage report
```

Coverage includes `src/lib/**`, server actions, route handlers, and validation schemas.

### E2E Tests (Playwright)

```bash
npm run test:e2e      # All browsers (chromium, firefox, webkit, mobile)
npx playwright test --project=chromium  # Single browser
```

E2E tests run against a live dev server (auto-started). They include:
- Functional tests (home, form, admin, multilang)
- Accessibility scans (@axe-core/playwright)
- Visual regression screenshots (baselines auto-generated on first run)

### CI

GitHub Actions runs on every PR:
- **build** job: lint -> type-check -> unit tests -> build
- **e2e** job: Playwright across 5 browser/device projects
- **lighthouse** job: Performance and accessibility budgets

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    [locale]/          # Public pages (AZ/RU/EN)
    admin/             # Admin CMS dashboard
      (cms)/           # Authenticated CMS pages
      login/           # Admin login
  components/          # React components
    sections/          # Page sections (hero, form, calculator, etc.)
    layout/            # Header, footer, language switcher
    motion/            # Animation wrappers
    three/             # Three.js / R3F 3D scenes
  data/                # Static demo data (fallback when Supabase not configured)
  lib/
    actions/           # Server actions (public)
    data/              # Data access layer + mappers
    supabase/          # Supabase client factories + auth guard
    validations/       # Zod schemas
  types/               # TypeScript types (db.generated.ts from Supabase)
  i18n/                # next-intl routing config
supabase/
  migrations/          # SQL migrations (0001-0007)
tests/
  e2e/                 # Playwright E2E tests
  unit/                # Vitest unit tests
  fixtures/            # Shared test data
  helpers/             # Shared test helpers (mockSupabase, axe)
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com/new)
3. Add environment variables (see above)
4. Deploy - Vercel auto-detects Next.js

Make sure all Supabase migrations are applied to your production database before deploying.

## Security

- **RLS**: All tables have Row-Level Security. Admin write policies require `app_metadata.role = 'admin'`
- **Auth guard**: Defense-in-depth - server actions check admin role via `requireAdmin()` in addition to RLS
- **CSP + HSTS**: Security headers in `next.config.ts`
- **Rate limiting**: Upstash-backed (optional, degrades gracefully)
- **Turnstile**: Cloudflare captcha (optional)
- **Honeypot**: Bot protection on the application form
- **Audit log**: All CMS writes are logged (migration 0007)
- **Soft delete**: No hard deletes on CMS tables (migration 0006)

## License

Private - (c) MegaGroup

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> If Supabase env vars are missing, the app falls back to static demo data
> (`isSupabaseConfigured()` = false) so you can still explore the UI.

## Environment Variables

See [`.env.example`](.env.example) for the full template. Key variables:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin only | Service role key (seed script, server actions) |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL |
| `UPSTASH_REDIS_REST_URL` | No | Rate limiting (degrades to honeypot-only without) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile captcha |
| `TURNSTILE_SECRET_KEY` | No | Turnstile server-side verification |
| `SEED_ADMIN_EMAIL` | Seed only | Admin user email |
| `SEED_ADMIN_PASSWORD` | Seed only | Admin user password |

## npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript type checking (tsc --noEmit) |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run seed` | Seed Supabase with demo data |
| `npm run sync:new-countries` | Sync new countries from data files |
| `npm run sync:universities` | Sync universities from data files |
| `npm run gen:types` | Generate Supabase TypeScript types |

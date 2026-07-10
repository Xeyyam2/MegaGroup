# MegaGroup Hardening & QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close production-blocking security, backend robustness, fullstack functional, and QA infrastructure gaps in the MegaGroup study-abroad platform — code + Supabase migrations only, no external services.

**Architecture:** Six phases, each independently committable. TDD approach: test first, then implement. After every task run `npm run lint && npm run type-check && npm test`. Subagent-driven execution: fresh implementer per task, two-stage review (spec then quality).

**Tech Stack:** Next.js 16.2.10, React 19.2.4, Supabase (Postgres + Auth + RLS + triggers), Zod 4, Vitest 4, Playwright 1.45, GitHub Actions.

**Constraints:** NO external services (Sentry/Upstash/Turnstile/Resend are excluded). Existing Turnstile/Upstash code stays untouched (activates when keys added). GSAP + framer-motion both retained. All changes are code or Supabase migrations only.

---

## File Structure Map

| File | Responsibility |
|---|---|
| `next.config.ts` | CSP + HSTS + CORP headers |
| `src/middleware.ts` | Admin role check after session |
| `src/lib/in-memory-rate-limit.ts` | **New** — Upstash-free fallback limiter for login |
| `src/lib/handle-action-error.ts` | **New** — centralized error handler |
| `src/lib/rate-limit.ts` | getClientIp trusted-proxy hardening |
| `src/lib/validations/common.ts` | **New** — idSchema (UUID) |
| `src/types/db.generated.ts` | **New** — Supabase generated types |
| `src/types/index.ts` | Application type added |
| `src/lib/data/mappers.ts` | Bind to generated types, remove `any` |
| `supabase/migrations/0006_soft_delete.sql` | **New** — is_deleted/deleted_at columns |
| `supabase/migrations/0007_audit_log.sql` | **New** — audit_log table + triggers |
| `src/app/admin/(cms)/*/actions.ts` (6 files) | handleActionError, UUID, zod |
| `src/app/admin/(cms)/*/page.tsx` (4 files) | pagination, search, soft-delete filter |
| `src/app/admin/(cms)/audit/page.tsx` | **New** — audit log panel |
| `src/app/admin/(cms)/muraciyyatler/export/route.ts` | **New** — CSV export |
| `.github/workflows/ci.yml` | E2E job added |
| `.github/workflows/lighthouse.yml` | **New** — perf budget |
| `lighthouserc.json` | **New** — Lighthouse config |
| `playwright.config.ts` | Multi-browser + mobile + retries |
| `vitest.config.ts` | Coverage threshold |
| `tests/fixtures/` | **New** — shared fixtures |
| `tests/helpers/` | **New** — shared helpers |
| `tests/unit/auth-guard.test.ts` | **New** |
| `tests/unit/actions/*.test.ts` | **New** — server action tests |
| `tests/unit/rls-policies.test.ts` | **New** — RLS regression guard |
| `tests/unit/*.test.tsx` | **New** — component tests |
| `tests/e2e/*.spec.ts` | Expanded + a11y axe scan |
| `.env.example` | **New** |
| `README.md` | Real onboarding doc |
| `eslint.config.mjs` | jsx-a11y plugin, no-explicit-any strictness |
| `public/sw.js` | **New** — PWA service worker |

---

## FAZA 1 — Security Critical (6 tasks)

### Task 1.1: CSP + HSTS + CORP headers

**Files:**
- Modify: `next.config.ts` (headers array in `async headers()`)

- [ ] **Step 1: Read current `next.config.ts` headers block**

Run: `read next.config.ts` — locate the `headers()` async function (around lines 32-48) which currently sets X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and static-asset Cache-Control.

- [ ] **Step 2: Add security headers to the `/(.*)` source entry**

Insert these additional headers alongside the existing ones in the same `key: [/(.*)/]` entry:

```ts
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://cdninstagram.com https://scontent.cdninstagram.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
},
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
{ key: "Cross-Origin-Resource-Policy", value: "same-origin" },
{ key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: Build succeeds. (CSP does not break build.)

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat(security): add CSP, HSTS, and Cross-Origin headers"
```

### Task 1.2: Middleware admin role check

**Files:**
- Modify: `src/middleware.ts` (around lines 66-73)
- Modify: `src/app/admin/(cms)/layout.tsx`
- Modify: `src/app/admin/login/page.tsx` (show unauthorized reason)

- [ ] **Step 1: Add role check after session confirmation in middleware**

In `src/middleware.ts`, after `if (!session) { redirect to login }`, add:

```ts
if (session.user.app_metadata?.role !== "admin") {
  const url = request.nextUrl.clone();
  url.pathname = `${ADMIN_BASE}/login`;
  url.searchParams.set("reason", "unauthorized");
  return NextResponse.redirect(url);
}
```

- [ ] **Step 2: Mirror the role check in `(cms)/layout.tsx`**

Read the current session check in `src/app/admin/(cms)/layout.tsx` (around line 12). After confirming a session exists, also check `user.app_metadata?.role !== "admin"` and redirect to `/admin/login?reason=unauthorized` if not admin.

- [ ] **Step 3: Show the unauthorized reason on the login page**

In `src/app/admin/login/page.tsx`, read `useSearchParams().get("reason")`; if it equals `"unauthorized"`, display an error banner: `"Bu panelə giriş icazəniz yoxdur."`.

- [ ] **Step 4: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts src/app/admin/(cms)/layout.tsx src/app/admin/login/page.tsx
git commit -m "feat(security): enforce admin role in middleware and CMS layout"
```

### Task 1.3: Login brute-force protection (in-memory)

**Files:**
- Create: `src/lib/in-memory-rate-limit.ts`
- Modify: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Create the in-memory rate limiter**

Create `src/lib/in-memory-rate-limit.ts`:

```ts
// Process-local rate limiter. Works on a single server / local dev.
// On serverless (Vercel) each instance counts separately — weaker than Upstash,
// but better than nothing when no external limiter is configured.
const attempts = new Map<string, { count: number; reset: number }>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // seconds until reset
}

export function checkRateLimit(
  key: string,
  max: number = 5,
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.reset) {
    attempts.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count++;
  if (entry.count > max) {
    return { allowed: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

// Periodic cleanup to prevent unbounded growth (called on each check of a stale key)
export function cleanupRateLimit(now: number = Date.now()): void {
  for (const [key, entry] of attempts) {
    if (now > entry.reset) attempts.delete(key);
  }
}
```

- [ ] **Step 2: Wire the limiter into the login page**

In `src/app/admin/login/page.tsx`, in the `signInWithPassword` handler, before calling Supabase, compute the IP (server-side) — but since this is a client component, the limiter must run server-side. Move the rate check into a small server action `checkLoginRateLimit(ip)` in a new file `src/app/admin/login/actions.ts`:

```ts
"use server";
import { checkRateLimit } from "@/lib/in-memory-rate-limit";
import { getClientIp } from "@/lib/rate-limit";

export async function checkLoginRateLimit(): Promise<{ allowed: boolean; retryAfter: number }> {
  const ip = await getClientIp();
  return checkRateLimit(`login:${ip}`, 5, 60_000);
}
```

Then in the login page client component, call `checkLoginRateLimit()` before `signInWithPassword`; if `!allowed`, set error `"Çox cəhd. ${retryAfter} saniyə sonra yenidən cəhd edin."` and return.

- [ ] **Step 3: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/in-memory-rate-limit.ts src/app/admin/login/actions.ts src/app/admin/login/page.tsx
git commit -m "feat(security): in-memory brute-force protection for admin login"
```

### Task 1.4: Centralized handleActionError + apply to 6 admin actions

**Files:**
- Create: `src/lib/handle-action-error.ts`
- Modify: `src/app/admin/(cms)/olkeler/actions.ts`
- Modify: `src/app/admin/(cms)/faq/actions.ts`
- Modify: `src/app/admin/(cms)/universitetler/actions.ts`
- Modify: `src/app/admin/(cms)/testimoniallar/actions.ts`
- Modify: `src/app/admin/(cms)/sayt-mezmunu/actions.ts`
- Modify: `src/app/admin/(cms)/muraciyyatler/actions.ts`

- [ ] **Step 1: Create the error handler**

Create `src/lib/handle-action-error.ts`:

```ts
// Centralized server-action error handler.
// Logs full detail server-side; returns a generic localized message to the client
// to avoid leaking schema/column/constraint names via Supabase error strings.
export function handleActionError(scope: string, error: unknown): { error: string } {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${scope}]`, message);
  return { error: "Əməliyyat zamanı xəta baş verdi. Yenidən cəhd edin." };
}
```

- [ ] **Step 2: Replace `return { error: error.message }` in all 6 admin action files**

For each file, replace every `return { error: error.message }` with `return handleActionError("<scopeName>", error)`. Use the function name as scope (e.g. `"createCountry"`, `"updateFaq"`, `"deleteUniversity"`, `"saveFaculties"`, `"saveFees"`, `"updateApplicationStatus"`, `"deleteApplication"`, `"saveSiteContent"`). Add the import `import { handleActionError } from "@/lib/handle-action-error";` to each file.

Do NOT change `createApplication` in `src/lib/actions/applications.ts` — it already returns a generic message.

- [ ] **Step 3: Verify type-check + lint**

Run: `npm run type-check && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/handle-action-error.ts src/app/admin/(cms)/*/actions.ts
git commit -m "feat(security): centralize action errors, stop leaking DB messages"
```

### Task 1.5: saveFaculties / saveFees zod validation

**Files:**
- Modify: `src/app/admin/(cms)/universitetler/actions.ts` (lines 68, 85)
- Modify: `src/lib/validations/university.schema.ts` (export an array schema)

- [ ] **Step 1: Export an array schema for faculties in university.schema.ts**

Add to `src/lib/validations/university.schema.ts`:

```ts
export const facultiesArraySchema = z.array(facultySchema);
```

- [ ] **Step 2: Validate inputs in saveFaculties and saveFees**

In `src/app/admin/(cms)/universitetler/actions.ts`:

For `saveFaculties(universitySlug: string, faculties: unknown[])`:
```ts
const parsed = facultiesArraySchema.safeParse(faculties);
if (!parsed.success) return { error: "Fakültə məlumatları yararsız" };
// then use parsed.data instead of faculties
```

For `saveFees(universitySlug: string, fees: unknown)`:
```ts
const parsed = feesSchema.safeParse(fees);
if (!parsed.success) return { error: "Ödəniş məlumatları yararsız" };
// then use parsed.data instead of fees
```

- [ ] **Step 3: Verify type-check + lint**

Run: `npm run type-check && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/validations/university.schema.ts src/app/admin/(cms)/universitetler/actions.ts
git commit -m "feat(security): validate saveFaculties and saveFees with zod"
```

### Task 1.6: .env.example + UUID validation + raw img cleanup

**Files:**
- Create: `.env.example`
- Create: `src/lib/validations/common.ts`
- Modify: all 6 admin action files (UUID validation on id params)
- Modify: `src/app/admin/(cms)/universitetler/UniversitiesTable.tsx`
- Modify: `src/app/admin/(cms)/testimoniallar/page.tsx`
- Modify: `next.config.ts` (remotePatterns for admin image domains if needed)

- [ ] **Step 1: Create `.env.example`**

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site URL (optional, defaults to https://www.megatehsil.com)
NEXT_PUBLIC_SITE_URL=https://www.megatehsil.com

# Rate limiting (optional — form degrades to honeypot-only without these)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cloudflare Turnstile (optional — captcha disabled without these)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Seed script (optional, for npm run seed only)
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```

- [ ] **Step 2: Create `src/lib/validations/common.ts`**

```ts
import { z } from "zod";
export const idSchema = z.string().uuid("Yanlış ID formatı");
```

- [ ] **Step 3: Validate id params in all update/delete actions**

In each `updateX(id, ...)` and `deleteX(id)` action, add at the top (after `requireAdmin` guard):

```ts
const idResult = idSchema.safeParse(id);
if (!idResult.success) return { error: "Yanlış ID" };
```

Files: `olkeler/actions.ts`, `faq/actions.ts`, `universitetler/actions.ts`, `testimoniallar/actions.ts`, `muraciyyatler/actions.ts`.

- [ ] **Step 4: Replace raw `<img>` with `next/image` in admin tables**

In `UniversitiesTable.tsx` (line ~58) and `testimoniallar/page.tsx` (line ~36), replace `<img src={...}>` with `<Image src={...} width={...} height={...} alt={...} unoptimized />`. Use `unoptimized` to avoid needing to whitelist every possible admin domain (safer than `remotePatterns` for arbitrary URLs).

- [ ] **Step 5: Verify type-check + lint + build**

Run: `npm run type-check && npm run lint && npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add .env.example src/lib/validations/common.ts src/app/admin/(cms)/*/actions.ts src/app/admin/(cms)/universitetler/UniversitiesTable.tsx src/app/admin/(cms)/testimoniallar/page.tsx
git commit -m "feat(security): env template, UUID validation, sanitize admin images"
```

---

## FAZA 2 — Backend Robustness (5 tasks)

### Task 2.1: Supabase generated types

**Files:**
- Create: `src/types/db.generated.ts`
- Modify: `package.json` (add gen:types script)
- Modify: `src/lib/data/mappers.ts` (bind to generated types)
- Modify: `eslint.config.mjs` (warn on no-explicit-any)

- [ ] **Step 1: Add the gen:types script to package.json**

In `package.json` scripts, add:
```json
"gen:types": "supabase gen types typescript --project-id \"$SUPABASE_PROJECT_ID\" > src/types/db.generated.ts"
```

- [ ] **Step 2: Create a placeholder generated types file**

Since the controller cannot run `supabase gen types` without a real project ID, create `src/types/db.generated.ts` with a hand-written mirror of the current schema (based on migrations 0001-0005). This file will be overwritten when the user runs `npm run gen:types`. The hand-written version must export a `Database` interface matching all tables: countries, universities, faculties, university_fees, faqs, testimonials, site_content, applications, audit_log. Each table needs Row, Insert, Update types.

Read migrations `0001_init_multilang_cms.sql`, `0003_applications.sql`, `0006_soft_delete.sql` (after Task 2.2), `0007_audit_log.sql` (after Task 2.3) to build accurate types.

- [ ] **Step 3: Bind mappers.ts to generated Row types**

In `src/lib/data/mappers.ts`, replace `any` parameter types with `Database["public"]["Tables"]["countries"]["Row"]` etc. Import from `@/types/db.generated`.

- [ ] **Step 4: Relax eslint to warn on any (temporary)**

In `eslint.config.mjs`, keep `@typescript-eslint/no-explicit-any` as `"warn"` (it is currently "off"). Do not set to "error" yet — wait until all `any` usages are removed in later tasks.

- [ ] **Step 5: Verify type-check + lint**

Run: `npm run type-check && npm run lint`
Expected: PASS (may have warnings for remaining `any` usages — acceptable)

- [ ] **Step 6: Commit**

```bash
git add src/types/db.generated.ts package.json src/lib/data/mappers.ts eslint.config.mjs
git commit -m "feat(backend): add Supabase generated types and bind mappers"
```

### Task 2.2: Soft delete migration

**Files:**
- Create: `supabase/migrations/0006_soft_delete.sql`
- Modify: `src/lib/data/countries.ts`, `universities.ts`, `testimonials.ts`, `faqs.ts`, `site-content.ts` (add is_deleted filter)
- Modify: `src/app/admin/(cms)/*/page.tsx` (show soft-deleted toggle)

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0006_soft_delete.sql`:

```sql
-- Soft delete: add is_deleted + deleted_at to all CMS tables.
-- Public reads must exclude soft-deleted rows; admin can see all.

ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.faculties ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.faculties ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.university_fees ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.university_fees ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Indexes for the soft-delete filter
CREATE INDEX IF NOT EXISTS idx_countries_deleted ON public.countries(is_deleted);
CREATE INDEX IF NOT EXISTS idx_universities_deleted ON public.universities(is_deleted);
CREATE INDEX IF NOT EXISTS idx_testimonials_deleted ON public.testimonials(is_deleted);
CREATE INDEX IF NOT EXISTS idx_faqs_deleted ON public.faqs(is_deleted);

-- Change deleteCountry/deleteUniversity/etc. to soft-delete:
-- Instead of .delete(), admin actions set is_deleted=true, deleted_at=now().
-- This is enforced in the action files (Step 3).
```

- [ ] **Step 2: Add is_deleted=false filter to all public data queries**

In `src/lib/data/countries.ts`, `universities.ts`, `testimonials.ts`, `faqs.ts`, `site-content.ts`, add `.eq("is_deleted", false)` to every select query (before the cache wrapper returns). Public reads must never see soft-deleted rows.

- [ ] **Step 3: Convert admin delete actions to soft-delete**

In each `deleteX` action (`olkeler/actions.ts`, `universitetler/actions.ts`, `faq/actions.ts`, `testimoniallar/actions.ts`), replace:
```ts
await supabase.from("countries").delete().eq("id", id);
```
with:
```ts
await supabase.from("countries").update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
```

- [ ] **Step 4: Add a "restore" action to each CMS module**

Add `restoreCountry(id)`, `restoreUniversity(id)`, `restoreFaq(id)`, `restoreTestimonial(id)` actions that set `is_deleted=false, deleted_at=null`.

- [ ] **Step 5: Add a trash view to admin lists (optional, can be minimal)**

In each admin list page, add a `?trashed=1` searchParam that, when present, shows soft-deleted rows (`.eq("is_deleted", true)`). Add a "Geri qaytar" button next to each trashed row.

- [ ] **Step 6: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/0006_soft_delete.sql src/lib/data/*.ts src/app/admin/(cms)/*/actions.ts src/app/admin/(cms)/*/page.tsx
git commit -m "feat(backend): soft delete with restore for all CMS tables"
```

### Task 2.3: Audit log migration + panel

**Files:**
- Create: `supabase/migrations/0007_audit_log.sql`
- Create: `src/app/admin/(cms)/audit/page.tsx`
- Modify: `src/app/admin/(admin)/Sidebar.tsx` (add audit link)

- [ ] **Step 1: Write the audit log migration**

Create `supabase/migrations/0007_audit_log.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  row_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read audit" ON public.audit_log
  FOR SELECT TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
-- No INSERT/UPDATE/DELETE policy: only the trigger function (SECURITY DEFINER) writes.

CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_table ON public.audit_log(table_name);

CREATE OR REPLACE FUNCTION public.fn_audit() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, table_name, row_id, before, after)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE((CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN OLD END).id::text, (CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN NEW END).id::text),
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to CMS tables (skip university_fees for simplicity, or include)
CREATE TRIGGER trg_audit_countries AFTER INSERT OR UPDATE OR DELETE ON public.countries
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();
CREATE TRIGGER trg_audit_universities AFTER INSERT OR UPDATE OR DELETE ON public.universities
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();
CREATE TRIGGER trg_audit_faqs AFTER INSERT OR UPDATE OR DELETE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();
CREATE TRIGGER trg_audit_testimonials AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();
CREATE TRIGGER trg_audit_site_content AFTER INSERT OR UPDATE OR DELETE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();
CREATE TRIGGER trg_audit_applications AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();
```

- [ ] **Step 2: Create the audit log admin page**

Create `src/app/admin/(cms)/audit/page.tsx` — server component that queries the last 100 audit_log entries ordered by created_at desc, displays a table: timestamp, user_id (truncated), action, table_name, row_id. Use the existing `glass` card style.

- [ ] **Step 3: Add audit link to the admin Sidebar**

In the Sidebar component, add a nav entry "Audit log" linking to `/admin/audit` with a `ScrollText` or `History` lucide icon.

- [ ] **Step 4: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/0007_audit_log.sql src/app/admin/(cms)/audit/page.tsx src/components/admin/Sidebar.tsx
git commit -m "feat(backend): audit log table with triggers and admin panel"
```

### Task 2.4: Pagination for other admin lists

**Files:**
- Modify: `src/app/admin/(cms)/universitetler/page.tsx`
- Modify: `src/app/admin/(cms)/testimoniallar/page.tsx`
- Modify: `src/app/admin/(cms)/faq/page.tsx`
- Modify: `src/app/admin/(cms)/olkeler/page.tsx`

- [ ] **Step 1: Apply the muraciyyatler pagination pattern to each list**

For each list page, mirror the pattern in `src/app/admin/(cms)/muraciyyatler/page.tsx`:
- Accept `searchParams: Promise<{ page?: string }>`
- `const PAGE_SIZE = 20;`
- `const page = Math.max(1, Number(sp.page) || 1);`
- `const from = (page - 1) * PAGE_SIZE; const to = from + PAGE_SIZE - 1;`
- `.select("*", { count: "exact" })` then `.range(from, to)`
- Render pagination links (Əvvəlki / page/totalPages / Növbəti) when `totalPages > 1`

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/(cms)/universitetler/page.tsx src/app/admin/(cms)/testimoniallar/page.tsx src/app/admin/(cms)/faq/page.tsx src/app/admin/(cms)/olkeler/page.tsx
git commit -m "feat(backend): server-side pagination for all admin lists"
```

### Task 2.5: getNewApplicationsCount cache + ws cleanup

**Files:**
- Modify: `src/app/admin/(cms)/muraciyyatler/actions.ts` (cache the count)
- Modify: `src/lib/supabase/admin.ts` (remove ws if unused)

- [ ] **Step 1: Cache getNewApplicationsCount with unstable_cache**

In `src/app/admin/(cms)/muraciyyatler/actions.ts`, wrap the count query in `unstable_cache` with a 30s revalidate and tag `applications-count`. Use the cookieless `createCacheClient` (since `cookies()` is unavailable inside `unstable_cache`).

- [ ] **Step 2: Audit ws/realtime usage**

Grep for `.channel(`, `.on("postgres_changes"`, `realtime` across `src/`. If no realtime channel is used anywhere, remove the `ws` import and `realtime` config from `src/lib/supabase/admin.ts` (and remove `ws` from package.json if nothing else uses it). If realtime IS used or planned, leave a comment explaining and keep it.

- [ ] **Step 3: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/(cms)/muraciyyatler/actions.ts src/lib/supabase/admin.ts package.json
git commit -m "feat(backend): cache applications count, clean unused realtime"
```

---

## FAZA 3 — Fullstack Functional (4 tasks)

### Task 3.1: Application type + CSV export

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/app/admin/(cms)/muraciyyatler/export/route.ts`

- [ ] **Step 1: Add Application type to types/index.ts**

```ts
export type ApplicationStatus = "yeni" | "goruldu" | "qebul_edildi" | "imtina";

export interface Application {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  country_interest: string | null;
  attestat_avg: number | null;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
}
```

- [ ] **Step 2: Create the CSV export route handler**

Create `src/app/admin/(cms)/muraciyyatler/export/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.authorized) return new NextResponse("Unauthorized", { status: 403 });
  const { supabase } = guard;
  const { data, error } = await supabase
    .from("applications")
    .select("full_name,phone,email,country_interest,attestat_avg,message,status,created_at")
    .order("created_at", { ascending: false });
  if (error) return new NextResponse("Error", { status: 500 });

  const rows = (data ?? []).map((a) => [
    a.full_name, a.phone, a.email ?? "", a.country_interest ?? "",
    String(a.attestat_avg ?? ""), (a.message ?? "").replace(/\n/g, " "),
    a.status, new Date(a.created_at).toISOString(),
  ]);
  const csv = [
    "Ad,Telefon,Email,Olkə,Attestat,Mesaj,Status,Tarix",
    ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="muraciyyatler-${Date.now()}.csv"`,
    },
  });
}
```

- [ ] **Step 3: Add an export button to the muraciyyatler page**

In `src/app/admin/(cms)/muraciyyatler/page.tsx`, add a link `<a href="/admin/muraciyyatler/export">CSV endir</a>` near the header.

- [ ] **Step 4: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/app/admin/(cms)/muraciyyatler/export/route.ts src/app/admin/(cms)/muraciyyatler/page.tsx
git commit -m "feat(fullstack): Application type and CSV export route"
```

### Task 3.2: CMS search/filter

**Files:**
- Modify: `src/app/admin/(cms)/universitetler/page.tsx`
- Modify: `src/app/admin/(cms)/faq/page.tsx`
- Modify: `src/app/admin/(cms)/testimoniallar/page.tsx`

- [ ] **Step 1: Add ?q= search to each list**

For each page, accept `q?: string` in searchParams. If present, add `.ilike("name_az", `%${q}%")` (universities), `.or("question_az.ilike.%${q}%,question_en.ilike.%${q}%")` (faqs), `.ilike("student_name", `%${q}%")` (testimonials). Render a search input form (GET method) at the top of each list.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/(cms)/universitetler/page.tsx src/app/admin/(cms)/faq/page.tsx src/app/admin/(cms)/testimoniallar/page.tsx
git commit -m "feat(fullstack): search/filter for CMS lists"
```

### Task 3.3: Form success persistence + analytics scaffold

**Files:**
- Modify: `src/components/sections/ApplicationForm.tsx`

- [ ] **Step 1: Redirect to success query param on submit**

On successful `createApplication`, call `router.push("/xaricde-tehsil/muraciet?success=1")` instead of `setSubmitted(true)`.

- [ ] **Step 2: Read success param on mount**

Use `useSearchParams().get("success")` — if `"1"`, show the success state.

- [ ] **Step 3: Push analytics event**

Before redirect, push to dataLayer (guard for undefined):

```ts
if (typeof window !== "undefined") {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: "application_submitted", country: data.country_interest });
}
```

- [ ] **Step 4: Verify type-check + build**

Run: `npm run type-check && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ApplicationForm.tsx
git commit -m "feat(fullstack): form success persistence and analytics scaffold"
```

### Task 3.4: Section-level Suspense + error boundaries

**Files:**
- Modify: `src/app/[locale]/page.tsx` (wrap async sections in Suspense)
- Create: `src/components/SectionErrorBoundary.tsx`

- [ ] **Step 1: Create a section error boundary**

Create `src/components/SectionErrorBoundary.tsx` — a client component class error boundary with a fallback showing "Bu bölmə müvəqqəti olaraq əlçatan deyil" and a retry button.

- [ ] **Step 2: Wrap async sections on the home page**

In `src/app/[locale]/page.tsx`, wrap `<UniversityGrid/>`, `<SuccessStories/>`, `<FAQSection/>` each in `<SectionErrorBoundary><Suspense fallback={<Skeleton/>}>{section}</Suspense></SectionErrorBoundary>`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/SectionErrorBoundary.tsx src/app/[locale]/page.tsx
git commit -m "feat(fullstack): per-section Suspense and error boundaries"
```

---

## FAZA 4 — Frontend Polish (3 tasks)

### Task 4.1: Accessibility improvements

**Files:**
- Modify: `src/components/sections/ApplicationForm.tsx`
- Modify: `src/components/motion/*` (reduced-motion guards)
- Modify: `src/app/globals.css` (contrast check)
- Modify: `eslint.config.mjs` (add jsx-a11y)

- [ ] **Step 1: Add aria-invalid + aria-describedby to form fields**

In `ApplicationForm.tsx`, for each input add `aria-invalid={!!errors.fieldName}` and `aria-describedby={errors.fieldName ? "fieldName-error" : undefined}`, and give the error message `id="fieldName-error"`.

- [ ] **Step 2: Ensure all motion components respect prefers-reduced-motion**

Audit `src/components/motion/*` and `src/components/three/*`. Every animation should check `useReducedMotion()` and either disable or reduce motion when true. The hook already exists at `src/hooks/useReducedMotion.ts`.

- [ ] **Step 3: Add eslint-plugin-jsx-a11y**

Install `npm i -D eslint-plugin-jsx-a11y`. Add to `eslint.config.mjs`:

```js
import jsxA11y from "eslint-plugin-jsx-a11y";
// in config array:
{ plugins: { "jsx-a11y": jsxA11y }, rules: jsxA11y.flatConfigs.recommended.rules },
```

- [ ] **Step 4: Verify lint + build**

Run: `npm run lint && npm run build`
Expected: PASS (fix any a11y violations the new plugin surfaces)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ApplicationForm.tsx src/components/motion/ src/components/three/ src/app/globals.css eslint.config.mjs package.json package-lock.json
git commit -m "feat(frontend): accessibility — aria, reduced-motion, jsx-a11y"
```

### Task 4.2: 3D dynamic import + viewport loading

**Files:**
- Modify: `src/components/three/GlobeScene.tsx` or its consumer
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Lazy-load the 3D globe**

In `HeroSection.tsx` (or wherever `GlobeScene` is imported), replace the direct import with:

```ts
const GlobeScene = dynamic(() => import("@/components/three/GlobeScene").then(m => m.GlobeScene), {
  ssr: false,
  loading: () => <div className="h-[400px]" />,
});
```

- [ ] **Step 2: Skip 3D on reduced-motion**

```ts
const reduced = useReducedMotion();
return reduced ? <StaticHeroVisual/> : <GlobeScene/>;
```

(Provide a static fallback — a gradient or image.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroSection.tsx src/components/three/
git commit -m "feat(frontend): lazy-load 3D, skip on reduced-motion"
```

### Task 4.3: PWA service worker

**Files:**
- Create: `public/sw.js`
- Modify: `src/app/layout.tsx` (register SW)

- [ ] **Step 1: Create a minimal service worker**

Create `public/sw.js` — a cache-first SW for static assets and a network-first strategy for HTML. Cache only same-origin GET requests. Skip cross-origin (Supabase, images).

- [ ] **Step 2: Register the SW in production**

In `src/app/layout.tsx`, add a client component `<SWRegister/>` (or inline script) that registers `/sw.js` only when `process.env.NODE_ENV === "production"`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add public/sw.js src/app/layout.tsx
git commit -m "feat(frontend): PWA service worker for offline caching"
```

---

## FAZA 5 — QA Infrastructure (10 tasks)

### Task 5.1: E2E in CI

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add an e2e job to ci.yml**

Append a new job `e2e` that `needs: build`, installs Playwright with deps, starts the production server, runs `npm run test:e2e`, and uploads the report artifact on failure. Use placeholder Supabase env (static fallback) so tests are hermetic.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run Playwright E2E on every PR"
```

### Task 5.2: Multi-browser + mobile Playwright

**Files:**
- Modify: `playwright.config.ts`

- [ ] **Step 1: Expand projects and set retries**

Replace the single chromium project with five projects (chromium, firefox, webkit, mobile-chrome/Pixel, mobile-safari/iPhone). Set `retries: process.env.CI ? 2 : 0`. Set `reporter: process.env.CI ? [["github"],["list"]] : "list"`.

- [ ] **Step 2: Commit**

```bash
git add playwright.config.ts
git commit -m "test: multi-browser and mobile Playwright projects with retries"
```

### Task 5.3: Code coverage

**Files:**
- Modify: `package.json` (add @vitest/coverage-v8)
- Modify: `vitest.config.ts`

- [ ] **Step 1: Install coverage provider**

Run: `npm i -D @vitest/coverage-v8`

- [ ] **Step 2: Configure coverage in vitest.config.ts**

Add a `coverage` block: provider v8, reporters ["text","lcov"], include ["src/lib/**","src/app/**/actions.ts","src/app/**/route.ts"], thresholds { lines: 70, functions: 70, branches: 60 }.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: code coverage with v8 provider and thresholds"
```

### Task 5.4: Server action tests

**Files:**
- Create: `tests/fixtures/sampleData.ts`
- Create: `tests/helpers/mockSupabase.ts`
- Create: `tests/unit/auth-guard.test.ts`
- Create: `tests/unit/actions/muraciyyatler.test.ts`
- Create: `tests/unit/actions/olkeler.test.ts`

- [ ] **Step 1: Create shared fixtures and helpers**

`tests/fixtures/sampleData.ts` — export sample country row, university row, application row. `tests/helpers/mockSupabase.ts` — a factory that returns a mock supabase client with chainable `.from().select/insert/update/delete/eq/single/range`.

- [ ] **Step 2: Write auth-guard tests**

Test `requireAdmin`: mock `createClient` to return a user with `app_metadata.role='admin'` → authorized:true; role='user' → authorized:false; no user → authorized:false.

- [ ] **Step 3: Write action tests**

`muraciyyatler.test.ts`: `updateApplicationStatus` with invalid status → returns error; valid status + non-admin → ADMIN_DENIED. `olkeler.test.ts`: `createCountry` with invalid slug → zod error.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: All new tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/fixtures/ tests/helpers/ tests/unit/auth-guard.test.ts tests/unit/actions/
git commit -m "test: server action and auth-guard unit tests"
```

### Task 5.5: RLS policy regression test

**Files:**
- Create: `tests/unit/rls-policies.test.ts`

- [ ] **Step 1: Write a test that parses migration SQL and asserts role checks**

Read all migration files in `supabase/migrations/`, concatenate, and assert that for each CMS table (countries, universities, faculties, faqs, testimonials, site_content) every `FOR ALL`/`FOR INSERT`/`FOR UPDATE`/`FOR DELETE` policy targeting `authenticated` contains `app_metadata` and `role` and `admin` in its definition. This catches regression to `using(true) with check(true)`.

- [ ] **Step 2: Run + commit**

```bash
git add tests/unit/rls-policies.test.ts
git commit -m "test: RLS policy regression guard"
```

### Task 5.6: Component tests

**Files:**
- Create: `tests/unit/ApplicationForm.test.tsx`
- Create: `tests/unit/CostCalculator.test.tsx`
- Create: `tests/unit/LanguageSwitcher.test.tsx`

- [ ] **Step 1: Write ApplicationForm tests**

Test: empty submit shows validation error; honeypot filled → submit is blocked; valid submit calls createApplication.

- [ ] **Step 2: Write CostCalculator + LanguageSwitcher tests**

CostCalculator: changing university updates displayed cost. LanguageSwitcher: clicking EN changes locale.

- [ ] **Step 3: Run + commit**

```bash
git add tests/unit/ApplicationForm.test.tsx tests/unit/CostCalculator.test.tsx tests/unit/LanguageSwitcher.test.tsx
git commit -m "test: React component tests for form, calculator, switcher"
```

### Task 5.7: A11y axe scan in E2E

**Files:**
- Modify: `package.json` (add @axe-core/playwright)
- Create: `tests/helpers/axe.ts`
- Modify: `tests/e2e/home.spec.ts`, `form.spec.ts`

- [ ] **Step 1: Install axe**

Run: `npm i -D @axe-core/playwright`

- [ ] **Step 2: Create axe helper**

`tests/helpers/axe.ts` exports `axeBuilder(page)` returning `AxeBuilder({ page }).withTags(['wcag2a','wcag2aa'])`.

- [ ] **Step 3: Add axe assertions to E2E specs**

In home.spec.ts and form.spec.ts, after page load, `expect(await axeBuilder(page).analyze()).toEqual(expect.objectContaining({ violations: [] }))` or assert no critical violations.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tests/helpers/axe.ts tests/e2e/home.spec.ts tests/e2e/form.spec.ts
git commit -m "test: axe-core accessibility scans in E2E"
```

### Task 5.8: Test helpers/fixtures consolidation

**Files:**
- Refactor: `tests/unit/mappers.test.ts`, `cost.test.ts`, `schemas.test.ts` to use shared fixtures

- [ ] **Step 1: Move inline fixtures to tests/fixtures/**

Move `sampleRow` from mappers.test.ts, `sampleFees` from cost.test.ts into `tests/fixtures/sampleData.ts`.

- [ ] **Step 2: Update tests to import from fixtures**

- [ ] **Step 3: Run + commit**

```bash
git add tests/fixtures/ tests/unit/
git commit -m "test: consolidate inline fixtures into shared module"
```

### Task 5.9: Visual regression screenshots

**Files:**
- Modify: `tests/e2e/home.spec.ts` (or new `tests/e2e/visual.spec.ts`)

- [ ] **Step 1: Add screenshot assertions**

For home (az, ru, en), country detail, university detail: `await expect(page).toHaveScreenshot("home-az.png", { maxDiffPixelRatio: 0.01 })`. Run once to generate baselines.

- [ ] **Step 2: Commit**

```bash
git add tests/e2e/visual.spec.ts tests/e2e/-screenshots/
git commit -m "test: visual regression screenshots for key pages"
```

### Task 5.10: Lighthouse CI

**Files:**
- Create: `lighthouserc.json`
- Create: `.github/workflows/lighthouse.yml`

- [ ] **Step 1: Create lighthouserc.json**

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/az", "http://localhost:3000/az/xaricde-tehsil/muraciet"],
      "numberOfRuns": 3,
      "startServerCommand": "npm run start"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 4000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

- [ ] **Step 2: Create the workflow**

`.github/workflows/lighthouse.yml` — on PR, install lhci, run `lhci autorun`, upload report.

- [ ] **Step 3: Commit**

```bash
git add lighthouserc.json .github/workflows/lighthouse.yml
git commit -m "ci: Lighthouse CI with performance and a11y budgets"
```

---

## FAZA 6 — Documentation & Hygiene (4 tasks)

### Task 6.1: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace boilerplate with real onboarding**

Sections: Stack overview, Prerequisites, Local setup (npm install, copy .env.example to .env.local, fill keys), npm scripts table, Supabase migration order (0001-0007), Testing (unit + e2e), Deployment (Vercel + env vars), Project structure.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: real README with onboarding and scripts"
```

### Task 6.2: Seed safety

**Files:**
- Modify: `scripts/seed-supabase.ts`

- [ ] **Step 1: Add --preserve flag**

Parse `process.argv` for `--preserve`. When set (default), FAQ and testimonial sync uses upsert (`on conflict do update`) instead of `delete all + insert`. Print a warning when running destructively without `--force`.

- [ ] **Step 2: Commit**

```bash
git add scripts/seed-supabase.ts
git commit -m "feat(scripts): safe seed with --preserve default"
```

### Task 6.3: x-forwarded-for trusted proxy

**Files:**
- Modify: `src/lib/rate-limit.ts`

- [ ] **Step 1: Harden getClientIp**

Prefer `x-vercel-forwarded-for` on Vercel; otherwise read `x-forwarded-for` and pick the entry at index `-(trustedHops)` where `trustedHops = Number(process.env.TRUSTED_PROXY_HOPS ?? 1)`. Fall back to `x-real-ip`.

- [ ] **Step 2: Commit**

```bash
git add src/lib/rate-limit.ts
git commit -m "feat(security): trusted-proxy-aware IP extraction"
```

### Task 6.4: no-explicit-any strictness

**Files:**
- Modify: `eslint.config.mjs`
- Various files with remaining `any`

- [ ] **Step 1: Find remaining any usages**

Run: `npx eslint . --rule '{"@typescript-eslint/no-explicit-any": "error"}'`
List all files with `any`.

- [ ] **Step 2: Replace each any with a proper type**

Use generated types or `unknown` where the type is genuinely unknown.

- [ ] **Step 3: Set rule to error and verify**

In `eslint.config.mjs`, set `@typescript-eslint/no-explicit-any` to `"error"`. Run `npm run lint`.
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add eslint.config.mjs <all changed files>
git commit -m "lint: enforce no-explicit-any across the codebase"
```

---

## Verification Commands

After each task:
```bash
npm run lint           # ESLint clean
npm run type-check     # tsc --noEmit clean
npm run test           # Vitest unit + coverage
npm run build          # Next.js production build
```

After each phase:
```bash
npm run test:e2e       # Playwright (local)
```

---

## Self-Review Checklist

- [ ] All 38 plan items mapped to tasks
- [ ] No placeholders — every step has concrete code or command
- [ ] Type consistency: handleActionError, idSchema, generated types use same signatures across tasks
- [ ] Migration order: 0006 (soft delete) before 0007 (audit log)
- [ ] RLS: audit_log has no INSERT policy (only trigger via SECURITY DEFINER)
- [ ] CSP includes Turnstile domain so existing code works when keys added
- [ ] No external services introduced anywhere

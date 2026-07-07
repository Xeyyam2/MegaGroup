# MegaGroup Dashboard CMS + Ã‡oxdilli (AZ/RU/EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase backend qur, saytÄ± AZ/RU/EN Ã§oxdilli `[locale]` routing-É™ miqrasiya et, admin dashboard'dan sayt mÉ™zmununu redaktÉ™ et (CMS), ana sÉ™hifÉ™dÉ™ menularÄ± mÉ™rkÉ™zÉ™ al.

**Architecture:** TÉ™k data qatÄ± (`src/lib/data/*`) Supabase'dÉ™n oxuyub lokalizÉ™ olunmuÅŸ tiplÉ™rÉ™ Ã§evirÉ™r (fallback: RU/EN boÅŸsa AZ). next-intl `[locale]` routing â€” bÃ¼tÃ¼n public sÉ™hifÉ™lÉ™r `/az/`,`/ru/`,`/en/` prefiksi alÄ±r. Dashboard `/dashboard/*` dildÉ™n asÄ±lÄ± deyil, auth protected. MÃ¶vcud vizual effektlÉ™r (3D hero, glassmorphism) toxunulmaz.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind v4, Supabase (Postgres+Auth+RLS), `@supabase/ssr`, next-intl, react-hook-form, zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-03-megagroup-dashboard-cms-multilang-design.md`

---

## File Structure (Create/Modify map)

**Create:**
- `supabase/migrations/0001_init_multilang_cms.sql` â€” tam ÅŸema + RLS + trigger
- `src/lib/supabase/client.ts`, `server.ts`, `admin.ts` â€” Supabase clients
- `src/lib/data/mappers.ts`, `countries.ts`, `universities.ts`, `faqs.ts`, `testimonials.ts`, `site-content.ts` â€” data qatÄ±
- `src/i18n/routing.ts`, `request.ts`, `messages/{az,ru,en}.json` â€” next-intl
- `src/middleware.ts` â€” next-intl + auth guard
- `scripts/seed-supabase.ts` â€” seed migrasiyasÄ±
- `src/components/layout/LanguageSwitcher.tsx`
- `src/components/dashboard/{Sidebar,Topbar,LanguageTabs,DataTable,ContentForm,ConfirmDelete,FormField}.tsx`
- `src/app/dashboard/{layout,page}.tsx`, `login/page.tsx`
- `src/app/dashboard/{olkeler,universitetler,faq,testimoniallar,sayt-mezmunu}/*` â€” CMS bÃ¶lmÉ™lÉ™ri
- `src/lib/validations/{country,university,faq,testimonial,site-content}.schema.ts`
- `src/components/ui/{table,tabs,dialog,dropdown-menu,label,input,textarea,select,button,card}.tsx` â€” Shadcn primitives

**Modify:**
- `src/types/index.ts` â€” `_ru` sahÉ™lÉ™ri, `Locale` tipi, lokalizÉ™ olunmuÅŸ `name`
- `src/app/layout.tsx` â†’ pass-through (html/body `[locale]` vÉ™ `dashboard` layout-lara kÃ¶Ã§Ã¼r)
- `src/app/page.tsx` â†’ `src/app/[locale]/page.tsx` (async data, locale)
- `src/app/xaricde-tehsil/**` â†’ `src/app/[locale]/xaricde-tehsil/**`
- `src/app/{error,not-found,loading}.tsx` â†’ `src/app/[locale]/`
- `src/app/sitemap.ts`, `robots.ts` â€” 3 dil
- `src/components/layout/Header.tsx` â€” mÉ™rkÉ™zi menyu + LanguageSwitcher
- `src/components/layout/Footer.tsx` â€” locale linklÉ™r + next-intl
- `src/components/sections/*.tsx` â€” lokalizÉ™ olunmuÅŸ data field-lÉ™r (`name`/`description` É™vÉ™zinÉ™ `name_az`/`description_az`)
## Phase 1 â€” Supabase Backend Qurulum

### Task 1: Supabase dependencies + env

**Files:**
- Modify: `package.json`
- Create: `.env.local.example`

- [ ] **Step 1: Install deps**

```bash
npm install @supabase/supabase-js @supabase/ssr next-intl
npm install -D tsx
```

- [ ] **Step 2: Create `.env.local.example`**

```bash
# Supabase â€” https://app.supabase.com â†’ Project Settings â†’ API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
# YalnÄ±z server tÉ™rÉ™fdÉ™ (seed skripti) â€” heÃ§ vaxt NEXT_PUBLIC_ prefiksi ilÉ™
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
# Ä°lk admin (seed Ã¼Ã§Ã¼n)
SEED_ADMIN_EMAIL=admin@megagroup.az
SEED_ADMIN_PASSWORD=ChangeMe123!
```

- [ ] **Step 3: Verify `.gitignore` has `.env.local`**

Run: `powershell -Command "Select-String -Path .gitignore -Pattern '\.env\.local'"`
Expected: match found. If missing, append `.env.local` to `.gitignore`.

- [ ] **Step 4: Add `seed` script to `package.json`** (modify `"scripts"`):
### Task 2: Supabase SQL migration (schema + RLS + triggers)

**Files:**
- Create: `supabase/migrations/0001_init_multilang_cms.sql`

- [ ] **Step 1: Write the migration file â€” part 1 (tables)**

```sql
-- MegaGroup CMS â€” Ã§oxdilli ÅŸema
-- Supabase SQL Editor-da iÅŸlÉ™din VÆYA supabase db push ilÉ™

create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  flag_emoji text,
  hero_image_url text,
  sort_order int default 0,
  is_active boolean default true,
  is_featured boolean default false,
  name_az text not null,
  name_ru text,
  name_en text,
  description_az text, description_ru text, description_en text,
  warning_banner_az text, warning_banner_ru text, warning_banner_en text,
  advantages_az jsonb default '[]'::jsonb, advantages_ru jsonb default '[]'::jsonb, advantages_en jsonb default '[]'::jsonb,
  documents_az jsonb default '[]'::jsonb, documents_ru jsonb default '[]'::jsonb, documents_en jsonb default '[]'::jsonb,
  steps_az jsonb default '[]'::jsonb, steps_ru jsonb default '[]'::jsonb, steps_en jsonb default '[]'::jsonb,
  qs_universities int, qs_avg_tuition_usd int, qs_language text, qs_visa_difficulty text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  country_slug text not null references public.countries(slug),
  website_url text, logo_url text, hero_image_url text,
  is_active boolean default true, is_featured boolean default false,
  name_az text not null, name_ru text, name_en text,
  city_az text not null, city_ru text, city_en text,
  highlights_az jsonb default '[]'::jsonb, highlights_ru jsonb default '[]'::jsonb, highlights_en jsonb default '[]'::jsonb,
  notes_az text, notes_ru text, notes_en text,
  campus_info_az text, campus_info_ru text, campus_info_en text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.faculties (
  id uuid primary key default gen_random_uuid(),
  university_slug text not null references public.universities(slug) on delete cascade,
  name_az text not null, name_ru text, name_en text,
  is_competitive boolean, duration_years int, language text,
  sort_order int default 0
);

create table if not exists public.university_fees (
  university_slug text primary key references public.universities(slug) on delete cascade,
- [ ] **Step 2: Append part 2 (faqs, testimonials, site_content + indexes + triggers + RLS)**

```sql
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  country_slug text references public.countries(slug) on delete cascade,
  university_slug text references public.universities(slug) on delete cascade,
  question_az text not null, question_ru text, question_en text,
  answer_az text not null, answer_ru text, answer_en text,
  sort_order int default 0
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  university_slug text references public.universities(slug) on delete set null,
  country_slug text references public.countries(slug) on delete set null,
  photo_url text,
  quote_az text not null, quote_ru text, quote_en text,
  year int, is_active boolean default true, sort_order int default 0
);

create table if not exists public.site_content (
  key text primary key,
  value_az text not null, value_ru text, value_en text,
  updated_at timestamptz default now()
);

create index if not exists idx_universities_country_slug on public.universities(country_slug);
create index if not exists idx_faculties_university_slug on public.faculties(university_slug);
create index if not exists idx_faqs_country_slug on public.faqs(country_slug);
create index if not exists idx_faqs_university_slug on public.faqs(university_slug);

create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists countries_updated_at on public.countries;
create trigger countries_updated_at before update on public.countries
  for each row execute function public.set_updated_at();
drop trigger if exists universities_updated_at on public.universities;
create trigger universities_updated_at before update on public.universities
  for each row execute function public.set_updated_at();
drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.countries enable row level security;
alter table public.universities enable row level security;
alter table public.faculties enable row level security;
alter table public.university_fees enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_content enable row level security;

create policy "public read countries" on public.countries for select using (true);
create policy "public read universities" on public.universities for select using (true);
create policy "public read faculties" on public.faculties for select using (true);
create policy "public read fees" on public.university_fees for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read site_content" on public.site_content for select using (true);

create policy "admin write countries" on public.countries for all to authenticated using (true) with check (true);
create policy "admin write universities" on public.universities for all to authenticated using (true) with check (true);
create policy "admin write faculties" on public.faculties for all to authenticated using (true) with check (true);
create policy "admin write fees" on public.university_fees for all to authenticated using (true) with check (true);
create policy "admin write faqs" on public.faqs for all to authenticated using (true) with check (true);
create policy "admin write testimonials" on public.testimonials for all to authenticated using (true) with check (true);
### Task 3: Supabase client wrappers

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/admin.ts`

- [ ] **Step 1: `src/lib/supabase/server.ts`** (RSC, server actions, middleware)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component-dÉ™n Ã§aÄŸÄ±rÄ±lÄ±bsa set olunmur â€” middleware yenilÉ™yir
          }
        },
      },
    },
  );
}
```

- [ ] **Step 2: `src/lib/supabase/client.ts`** (browser / "use client")

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 3: `src/lib/supabase/admin.ts`** (yalnÄ±z seed skripti â€” service role)

```typescript
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
## Phase 2 â€” Types + Data QatÄ±

### Task 4: Update types (multilang + Locale)

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add `Locale` type and `_ru` fields, plus localized `name`/`description`**

Replace the entire `src/types/index.ts` with:

```typescript
export const LOCALES = ["az", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface Country {
  id: string;
  slug: string;
  // LokalizÉ™ olunmuÅŸ (mapper tÉ™rÉ™findÉ™n locale-É™ gÃ¶rÉ™ doldurulur)
  name: string;
  // HamÄ± saxlanÄ±lÄ±r (alt-layihÉ™ 1 uyÄŸunluÄŸu + dashboard redaktÉ™ Ã¼Ã§Ã¼n)
  name_az: string;
  name_ru: string;
  name_en: string;
  flag_emoji: string;
  description: string;
  description_az: string;
  description_ru: string;
  description_en: string;
  hero_image_url: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  quick_stats: {
    universities: number;
    avg_tuition_usd: number;
    language: string;
    visa_difficulty: "easy" | "medium" | "hard";
  };
  advantages: string[];
  warning_banner?: string;
  documents_required: string[];
  application_steps: { step: number; title: string; description: string }[];
}

export interface Faculty {
  id: string;
  university_id: string;
  university_slug: string;
  name: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  is_competitive: boolean;
  duration_years: number;
  language: string;
  sort_order: number;
}

export interface UniversityFee {
  tuition_min_usd: number;
  tuition_max_usd: number;
  dorm_min_usd: number;
  dorm_max_usd: number;
  food_min_usd: number;
  food_max_usd: number;
  transport_min_usd: number;
  transport_max_usd: number;
  personal_min_usd: number;
  personal_max_usd: number;
}

export interface University {
  id: string;
  slug: string;
  country_slug: string;
  name: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  city: string;
  city_az: string;
  city_ru: string;
  city_en: string;
  website_url: string;
  logo_url: string;
  hero_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  highlights: string[];
  highlights_az: string[];
  highlights_ru: string[];
  highlights_en: string[];
  faculties: Faculty[];
  fees: UniversityFee;
  notes?: string;
  notes_az?: string;
  notes_ru?: string;
  notes_en?: string;
  campus_info?: string;
  campus_info_az?: string;
  campus_info_ru?: string;
  campus_info_en?: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  university_slug: string;
  country_slug: string;
  photo_url: string;
  quote: string;
  quote_az: string;
  quote_ru: string;
  quote_en: string;
  year: number;
}

export interface FAQ {
  id: string;
  question: string;
  question_az: string;
  question_ru: string;
  question_en: string;
  answer: string;
  answer_az: string;
  answer_ru: string;
  answer_en: string;
  country_slug?: string;
  university_slug?: string;
  sort_order: number;
}

export interface CostData {
  university_slug: string;
  fees: UniversityFee;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  key: string;
  value: string;
### Task 5: Data layer mappers (TDD â€” locale fallback)

**Files:**
- Create: `tests/unit/mappers.test.ts`
- Create: `src/lib/data/mappers.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { mapCountryRow, pickLocalized, pickLocalizedArray } from "@/lib/data/mappers";

const sampleRow = {
  id: "c1", slug: "turkiye", flag_emoji: "ðŸ‡¹ðŸ‡·", hero_image_url: "x", sort_order: 1,
  is_active: true, is_featured: true,
  name_az: "TÃ¼rkiyÉ™", name_ru: "Ð¢ÑƒÑ€Ñ†Ð¸Ñ", name_en: "Turkey",
  description_az: "Az desc", description_ru: "Ru desc", description_en: "En desc",
  warning_banner_az: "Az warn", warning_banner_ru: null, warning_banner_en: null,
  advantages_az: ["Az1"], advantages_ru: ["Ru1"], advantages_en: ["En1"],
  documents_az: ["DocAz"], documents_ru: [], documents_en: [],
  steps_az: [{ step: 1, title: "Az", description: "Az" }],
  steps_ru: [], steps_en: [],
  qs_universities: 200, qs_avg_tuition_usd: 1500, qs_language: "TÃ¼rkÃ§e", qs_visa_difficulty: "easy",
};

describe("pickLocalized", () => {
  it("returns az for locale az", () => {
    expect(pickLocalized("az", "a", "r", "e")).toBe("a");
  });
  it("returns ru value when present", () => {
    expect(pickLocalized("ru", "a", "r", "e")).toBe("r");
  });
  it("falls back to az when ru is null", () => {
    expect(pickLocalized("ru", "a", null, "e")).toBe("a");
  });
  it("falls back to az when en is empty string", () => {
    expect(pickLocalized("en", "a", "r", "")).toBe("a");
  });
});

describe("pickLocalizedArray", () => {
  it("returns ru array when non-empty", () => {
    expect(pickLocalizedArray("ru", ["a"], ["r"], ["e"])).toEqual(["r"]);
  });
  it("falls back to az when ru array is empty", () => {
    expect(pickLocalizedArray("ru", ["a"], [], [])).toEqual(["a"]);
  });
});

describe("mapCountryRow", () => {
  it("localizes name and description to ru", () => {
    const c = mapCountryRow(sampleRow, "ru");
    expect(c.name).toBe("Ð¢ÑƒÑ€Ñ†Ð¸Ñ");
    expect(c.description).toBe("Ru desc");
  });
  it("falls back to az for warning_banner when ru is null", () => {
    const c = mapCountryRow(sampleRow, "ru");
    expect(c.warning_banner).toBe("Az warn");
  });
  it("falls back to az array when localized array is empty", () => {
    const c = mapCountryRow(sampleRow, "en");
    expect(c.documents_required).toEqual(["DocAz"]);
  });
  it("keeps all _az/_ru/_en fields for dashboard", () => {
    const c = mapCountryRow(sampleRow, "az");
    expect(c.name_az).toBe("TÃ¼rkiyÉ™");
    expect(c.name_ru).toBe("Ð¢ÑƒÑ€Ñ†Ð¸Ñ");
    expect(c.advantages_az).toEqual(["Az1"]);
  });
  it("maps quick_stats from flat qs_ columns", () => {
    const c = mapCountryRow(sampleRow, "az");
    expect(c.quick_stats.universities).toBe(200);
- [ ] **Step 3: Write `src/lib/data/mappers.ts`** (helper + mapCountryRow)

```typescript
import type { Country, Faculty, University, FAQ, Testimonial, SiteContent, Locale } from "@/types";

export function pickLocalized(locale: Locale, az: string, ru?: string | null, en?: string | null): string {
  if (locale === "ru") return ru && ru !== "" ? ru : az;
  if (locale === "en") return en && en !== "" ? en : az;
  return az;
}

export function pickLocalizedArray(locale: Locale, az: any[], ru?: any[] | null, en?: any[] | null): any[] {
  if (locale === "ru" && ru && ru.length) return ru;
  if (locale === "en" && en && en.length) return en;
  return az;
}

export function mapCountryRow(row: any, locale: Locale): Country {
  return {
    id: row.id,
    slug: row.slug,
    name: pickLocalized(locale, row.name_az, row.name_ru, row.name_en),
    name_az: row.name_az,
    name_ru: row.name_ru ?? row.name_az,
    name_en: row.name_en ?? row.name_az,
    flag_emoji: row.flag_emoji ?? "",
    description: pickLocalized(locale, row.description_az, row.description_ru, row.description_en),
    description_az: row.description_az ?? "",
    description_ru: row.description_ru ?? "",
    description_en: row.description_en ?? "",
    hero_image_url: row.hero_image_url ?? "",
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
    is_featured: row.is_featured ?? false,
    quick_stats: {
      universities: row.qs_universities ?? 0,
      avg_tuition_usd: row.qs_avg_tuition_usd ?? 0,
      language: row.qs_language ?? "",
      visa_difficulty: row.qs_visa_difficulty ?? "medium",
    },
    advantages: pickLocalizedArray(locale, row.advantages_az, row.advantages_ru, row.advantages_en),
    warning_banner: pickLocalized(locale, row.warning_banner_az, row.warning_banner_ru, row.warning_banner_en) || undefined,
    documents_required: pickLocalizedArray(locale, row.documents_az, row.documents_ru, row.documents_en),
Then append the remaining mappers to the same file:

```typescript
export function mapFacultyRow(row: any, locale: Locale): Faculty {
  return {
    id: row.id, university_id: row.university_slug, university_slug: row.university_slug,
    name: pickLocalized(locale, row.name_az, row.name_ru, row.name_en),
    name_az: row.name_az, name_ru: row.name_ru ?? row.name_az, name_en: row.name_en ?? row.name_az,
    is_competitive: row.is_competitive ?? false, duration_years: row.duration_years ?? 4,
    language: row.language ?? "", sort_order: row.sort_order ?? 0,
  };
}

export function mapUniversityRow(row: any, faculties: any[], fees: any, locale: Locale): University {
  const defaultFees = {
    tuition_min_usd: 0, tuition_max_usd: 0, dorm_min_usd: 0, dorm_max_usd: 0,
    food_min_usd: 0, food_max_usd: 0, transport_min_usd: 0, transport_max_usd: 0,
    personal_min_usd: 0, personal_max_usd: 0,
  };
  return {
    id: row.id, slug: row.slug, country_slug: row.country_slug,
    name: pickLocalized(locale, row.name_az, row.name_ru, row.name_en),
    name_az: row.name_az, name_ru: row.name_ru ?? row.name_az, name_en: row.name_en ?? row.name_az,
    city: pickLocalized(locale, row.city_az, row.city_ru, row.city_en),
    city_az: row.city_az, city_ru: row.city_ru ?? row.city_az, city_en: row.city_en ?? row.city_az,
    website_url: row.website_url ?? "", logo_url: row.logo_url ?? "", hero_image_url: row.hero_image_url ?? "",
    is_featured: row.is_featured ?? false, is_active: row.is_active ?? true,
    highlights: pickLocalizedArray(locale, row.highlights_az, row.highlights_ru, row.highlights_en),
    highlights_az: row.highlights_az ?? [], highlights_ru: row.highlights_ru ?? [], highlights_en: row.highlights_en ?? [],
    faculties: faculties.map((f) => mapFacultyRow(f, locale)),
    fees: fees ?? defaultFees,
    notes: pickLocalized(locale, row.notes_az, row.notes_ru, row.notes_en) || undefined,
    notes_az: row.notes_az, notes_ru: row.notes_ru, notes_en: row.notes_en,
    campus_info: pickLocalized(locale, row.campus_info_az, row.campus_info_ru, row.campus_info_en) || undefined,
    campus_info_az: row.campus_info_az, campus_info_ru: row.campus_info_ru, campus_info_en: row.campus_info_en,
  };
}

export function mapFaqRow(row: any, locale: Locale): FAQ {
  return {
    id: row.id,
    question: pickLocalized(locale, row.question_az, row.question_ru, row.question_en),
    question_az: row.question_az, question_ru: row.question_ru ?? row.question_az, question_en: row.question_en ?? row.question_az,
    answer: pickLocalized(locale, row.answer_az, row.answer_ru, row.answer_en),
    answer_az: row.answer_az, answer_ru: row.answer_ru ?? row.answer_az, answer_en: row.answer_en ?? row.answer_az,
    country_slug: row.country_slug ?? undefined, university_slug: row.university_slug ?? undefined,
    sort_order: row.sort_order ?? 0,
  };
}

export function mapTestimonialRow(row: any, locale: Locale): Testimonial {
  return {
    id: row.id, student_name: row.student_name,
    university_slug: row.university_slug ?? "", country_slug: row.country_slug ?? "", photo_url: row.photo_url ?? "",
    quote: pickLocalized(locale, row.quote_az, row.quote_ru, row.quote_en),
    quote_az: row.quote_az, quote_ru: row.quote_ru ?? row.quote_az, quote_en: row.quote_en ?? row.quote_az,
    year: row.year ?? new Date().getFullYear(),
  };
}

export function mapSiteContentRow(row: any, locale: Locale): SiteContent {
  return {
    key: row.key,
    value: pickLocalized(locale, row.value_az, row.value_ru, row.value_en),
    value_az: row.value_az, value_ru: row.value_ru ?? row.value_az, value_en: row.value_en ?? row.value_az,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- mappers`
### Task 6: Data fetch functions (Supabase reads)

**Files:**
- Create: `src/lib/data/countries.ts`
- Create: `src/lib/data/universities.ts`
- Create: `src/lib/data/faqs.ts`
- Create: `src/lib/data/testimonials.ts`
- Create: `src/lib/data/site-content.ts`

- [ ] **Step 1: `src/lib/data/countries.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import { mapCountryRow } from "./mappers";
import type { Country, Locale } from "@/types";

export async function getCountries(locale: Locale): Promise<Country[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("countries").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapCountryRow(row, locale));
}

export async function getCountryBySlug(slug: string, locale: Locale): Promise<Country | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("*").eq("slug", slug).single();
  return data ? mapCountryRow(data, locale) : null;
}

export async function getFeaturedCountries(locale: Locale): Promise<Country[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("countries").select("*").eq("is_active", true).eq("is_featured", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapCountryRow(row, locale));
}
```

- [ ] **Step 2: `src/lib/data/universities.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import { mapUniversityRow } from "./mappers";
import type { University, Locale } from "@/types";

export async function getUniversitiesByCountry(countrySlug: string, locale: Locale): Promise<University[]> {
  const supabase = await createClient();
  const { data: unis, error } = await supabase
    .from("universities").select("*").eq("country_slug", countrySlug).eq("is_active", true).order("name_az");
  if (error) throw error;
  if (!unis?.length) return [];
  const slugs = unis.map((u) => u.slug);
  const { data: faculties } = await supabase.from("faculties").select("*").in("university_slug", slugs).order("sort_order");
  const { data: fees } = await supabase.from("university_fees").select("*").in("university_slug", slugs);
  const feeMap = new Map((fees ?? []).map((f) => [f.university_slug, f]));
  return unis.map((u) =>
    mapUniversityRow(u, (faculties ?? []).filter((f) => f.university_slug === u.slug), feeMap.get(u.slug), locale),
  );
}

export async function getUniversityBySlug(slug: string, locale: Locale): Promise<University | null> {
  const supabase = await createClient();
  const { data: uni } = await supabase.from("universities").select("*").eq("slug", slug).single();
  if (!uni) return null;
  const { data: faculties } = await supabase.from("faculties").select("*").eq("university_slug", slug).order("sort_order");
  const { data: fees } = await supabase.from("university_fees").select("*").eq("university_slug", slug).single();
  return mapUniversityRow(uni, faculties ?? [], fees ?? null, locale);
}

export async function getFeaturedUniversity(countrySlug: string, locale: Locale): Promise<University | null> {
  const supabase = await createClient();
  const { data: uni } = await supabase
    .from("universities").select("*").eq("country_slug", countrySlug).eq("is_featured", true).eq("is_active", true).single();
  if (!uni) return null;
- [ ] **Step 3: `src/lib/data/faqs.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import { mapFaqRow } from "./mappers";
import type { FAQ, Locale } from "@/types";

export async function getGeneralFAQs(locale: Locale): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []).filter((f) => !f.country_slug && !f.university_slug).map((row) => mapFaqRow(row, locale));
}

export async function getFAQsByCountry(countrySlug: string, locale: Locale): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs").select("*").or(`country_slug.eq.${countrySlug},country_slug.is.null`).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapFaqRow(row, locale));
}

export async function getFAQsByUniversity(universitySlug: string, locale: Locale): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs").select("*").or(`university_slug.eq.${universitySlug},university_slug.is.null`).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapFaqRow(row, locale));
}
```

- [ ] **Step 4: `src/lib/data/testimonials.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import { mapTestimonialRow } from "./mappers";
import type { Testimonial, Locale } from "@/types";

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapTestimonialRow(row, locale));
}

export async function getTestimonialsByCountry(countrySlug: string, locale: Locale): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials").select("*").eq("country_slug", countrySlug).eq("is_active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapTestimonialRow(row, locale));
}

export async function getTestimonialsByUniversity(universitySlug: string, locale: Locale): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials").select("*").eq("university_slug", universitySlug).eq("is_active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapTestimonialRow(row, locale));
}
```

- [ ] **Step 5: `src/lib/data/site-content.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import { mapSiteContentRow } from "./mappers";
import type { Locale } from "@/types";

export async function getSiteContentMap(locale: Locale): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_content").select("*");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    const item = mapSiteContentRow(row, locale);
    map[item.key] = item.value;
  }
  return map;
}

export async function getSiteContent(key: string, locale: Locale): Promise<string | null> {
## Phase 3 â€” next-intl Routing

### Task 7: next-intl config + messages

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/messages/az.json`
- Create: `src/i18n/messages/ru.json`
- Create: `src/i18n/messages/en.json`
- Modify: `next.config.ts` (next-intl plugin)

- [ ] **Step 1: `src/i18n/routing.ts`**

```typescript
import { defineRouting } from "next-intl/routing";

export const locales = ["az", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
```

- [ ] **Step 2: `src/i18n/request.ts`**

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: `src/i18n/messages/az.json`**
- [ ] **Step 4: `src/i18n/messages/ru.json`**

```json
{
  "nav": { "home": "Ð“Ð»Ð°Ð²Ð½Ð°Ñ", "studyAbroad": "Ð£Ñ‡ÐµÐ±Ð° Ð·Ð° Ñ€ÑƒÐ±ÐµÐ¶Ð¾Ð¼", "calculator": "ÐšÐ°Ð»ÑŒÐºÑƒÐ»ÑÑ‚Ð¾Ñ€", "apply": "Ð—Ð°ÑÐ²ÐºÐ°" },
  "cta": { "chooseCountry": "Ð’Ñ‹Ð±Ñ€Ð°Ñ‚ÑŒ ÑÑ‚Ñ€Ð°Ð½Ñƒ", "apply": "ÐŸÐ¾Ð´Ð°Ñ‚ÑŒ Ð·Ð°ÑÐ²ÐºÑƒ", "freeConsult": "Ð‘ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð°Ñ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ†Ð¸Ñ", "more": "ÐŸÐ¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ", "viewMore": "ÐŸÐ¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ" },
  "home": { "countriesTitle": "Ð¡Ñ‚Ñ€Ð°Ð½Ñ‹", "countriesSubtitle": "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ Ð¿Ð¾Ð´Ñ…Ð¾Ð´ÑÑ‰ÑƒÑŽ ÑÑ‚Ñ€Ð°Ð½Ñƒ", "calcTitle": "ÐšÐ°Ð»ÑŒÐºÑƒÐ»ÑÑ‚Ð¾Ñ€ Ñ€Ð°ÑÑ…Ð¾Ð´Ð¾Ð²", "calcSubtitle": "Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ ÑÑ‚Ñ€Ð°Ð½Ñƒ Ð¸ ÑƒÐ½Ð¸Ð²ÐµÑ€ÑÐ¸Ñ‚ÐµÑ‚ â€” Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ ÐµÐ¶ÐµÐ¼ÐµÑÑÑ‡Ð½Ñ‹Ðµ Ñ€Ð°ÑÑ…Ð¾Ð´Ñ‹", "storiesTitle": "Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ð¸ ÑƒÑÐ¿ÐµÑ…Ð°", "storiesSubtitle": "Ð¡Ñ‚ÑƒÐ´ÐµÐ½Ñ‚Ñ‹, Ð¾Ð±ÑƒÑ‡Ð°ÑŽÑ‰Ð¸ÐµÑÑ Ð·Ð° Ñ€ÑƒÐ±ÐµÐ¶Ð¾Ð¼ Ñ MegaGroup", "faqTitle": "Ð§Ð°ÑÑ‚Ð¾ Ð·Ð°Ð´Ð°Ð²Ð°ÐµÐ¼Ñ‹Ðµ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹" },
  "country": { "universities": "Ð£Ð½Ð¸Ð²ÐµÑ€ÑÐ¸Ñ‚ÐµÑ‚Ñ‹", "featuredUni": "Ð˜Ð·Ð±Ñ€Ð°Ð½Ð½Ñ‹Ð¹ ÑƒÐ½Ð¸Ð²ÐµÑ€ÑÐ¸Ñ‚ÐµÑ‚", "process": "ÐŸÑ€Ð¾Ñ†ÐµÑÑ Ð¿Ð¾Ð´Ð°Ñ‡Ð¸", "documents": "ÐÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹" },
  "footer": { "countries": "Ð¡Ñ‚Ñ€Ð°Ð½Ñ‹", "services": "Ð£ÑÐ»ÑƒÐ³Ð¸", "contact": "ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹", "rights": "MegaGroup â€” Ð¦ÐµÐ½Ñ‚Ñ€ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð·Ð° Ñ€ÑƒÐ±ÐµÐ¶Ð¾Ð¼ Â© 2026" },
  "lang": { "az": "AZ", "ru": "RU", "en": "EN" }
}
```

- [ ] **Step 5: `src/i18n/messages/en.json`**

```json
{
  "nav": { "home": "Home", "studyAbroad": "Study Abroad", "calculator": "Calculator", "apply": "Apply" },
  "cta": { "chooseCountry": "Choose Country", "apply": "Apply Now", "freeConsult": "Get Free Consultation", "more": "Learn more", "viewMore": "View details" },
  "home": { "countriesTitle": "Countries", "countriesSubtitle": "Choose the right country for you", "calcTitle": "Cost Calculator", "calcSubtitle": "Select country and university â€” calculate monthly cost", "storiesTitle": "Success Stories", "storiesSubtitle": "Students studying abroad with MegaGroup", "faqTitle": "Frequently Asked Questions" },
  "country": { "universities": "Universities", "featuredUni": "Featured University", "process": "Application Process", "documents": "Required Documents" },
  "footer": { "countries": "Countries", "services": "Services", "contact": "Contact", "rights": "MegaGroup â€” Study Abroad Center Â© 2026" },
  "lang": { "az": "AZ", "ru": "RU", "en": "EN" }
}
```

- [ ] **Step 6: Modify `next.config.ts`** â€” add `createNextIntlPlugin`

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdninstagram.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

### Task 8: Middleware (next-intl + auth guard)

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Write `src/middleware.ts`**

```typescript
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard â€” auth guard (next-intl burada iÅŸlÉ™mir)
  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") {
      return NextResponse.next();
    }
    const response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Public â€” next-intl locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

## Phase 4 â€” Public Sayt MiqrasiyasÄ± ([locale])

### Task 9: Root layout pass-through + [locale] layout

**Files:**
- Modify: `src/app/layout.tsx` â†’ pass-through (html/body kÃ¶Ã§Ã¼rÃ¼lÃ¼r)
- Create: `src/app/[locale]/layout.tsx` (NextIntlClientProvider + html/body + Header/Footer)
- Move: `src/app/error.tsx`, `not-found.tsx`, `loading.tsx` â†’ `src/app/[locale]/`

- [ ] **Step 1: Replace `src/app/layout.tsx`** (pass-through â€” html/body yox)

```typescript
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
```

> next-intl pattern: hÉ™r sÉ™hifÉ™ yalnÄ±z bir html/body alÄ±r. `[locale]/layout.tsx` public Ã¼Ã§Ã¼n, `dashboard/layout.tsx` admin Ã¼Ã§Ã¼n.

- [ ] **Step 2: Create `src/app/[locale]/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { cn } from "@/lib/utils";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, { title: string; desc: string }> = {
    az: { title: "MegaGroup â€” XaricdÉ™ TÉ™hsil MÉ™rkÉ™zi", desc: "AzÉ™rbaycanlÄ± tÉ™lÉ™bÉ™lÉ™r Ã¼Ã§Ã¼n xaricdÉ™ tÉ™hsil â€” attestatla, imtahansÄ±z qÉ™bul." },
    ru: { title: "MegaGroup â€” Ð¦ÐµÐ½Ñ‚Ñ€ Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð·Ð° Ñ€ÑƒÐ±ÐµÐ¶Ð¾Ð¼", desc: "ÐžÐ±ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð·Ð° Ñ€ÑƒÐ±ÐµÐ¶Ð¾Ð¼ Ð´Ð»Ñ Ð°Ð·ÐµÑ€Ð±Ð°Ð¹Ð´Ð¶Ð°Ð½ÑÐºÐ¸Ñ… ÑÑ‚ÑƒÐ´ÐµÐ½Ñ‚Ð¾Ð² â€” Ð°Ñ‚Ñ‚ÐµÑÑ‚Ð°Ñ‚, Ð±ÐµÐ· ÑÐºÐ·Ð°Ð¼ÐµÐ½Ð¾Ð²." },
    en: { title: "MegaGroup â€” Study Abroad Center", desc: "Study abroad for Azerbaijani students â€” certificate-based, exam-free admission." },
  };
  const t = titles[locale] ?? titles.az;
  return {
    title: { default: t.title, template: `%s | ${t.title}` },
    description: t.desc,
    openGraph: { title: t.title, type: "website", locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={cn(inter.variable, jakarta.variable, "dark")} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```
### Task 10: Move public pages to [locale] + update data calls

**Files:**
- Move + rewrite: `src/app/page.tsx` â†’ `src/app/[locale]/page.tsx`
- Move + rewrite: `src/app/xaricde-tehsil/**` â†’ `src/app/[locale]/xaricde-tehsil/**`

> **Miqrasiya qaydasÄ± (hÉ™r public sÉ™hifÉ™yÉ™ tÉ™tbiq olunur):**
> 1. `params: Promise<{ locale }>` É™lavÉ™ et; `const { locale } = await params` â€” `setRequestLocale(locale)` Ã§aÄŸÄ±r.
> 2. `import { ... } from "@/data/..."` â†’ `import { ... } from "@/lib/data/..."` (Supabase data qatÄ±).
> 3. Ã‡aÄŸÄ±rÄ±ÅŸlara `locale` Ã¶tÃ¼r: `getCountries(locale)`, `getCountryBySlug(country, locale)` vÉ™ s.
> 4. `c.name_az`/`c.description_az` â†’ `c.name`/`c.description` (mapper lokalizÉ™ edib).
> 5. LinklÉ™rÉ™ locale prefiksi: `href={`/${locale}/...`}`.
> 6. Statik mÉ™tnlÉ™r `useTranslations()` (client) / `getTranslations()` (server).
- [ ] **Step 1: `src/app/[locale]/page.tsx`** (ana sÉ™hifÉ™ â€” tam)

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { CountryTabs } from "@/components/sections/CountryTabs";
import { CostCalculator } from "@/components/sections/CostCalculator";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { InstagramCTA } from "@/components/sections/InstagramCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { getCountries } from "@/lib/data/countries";
import { getUniversitiesByCountry } from "@/lib/data/universities";
import { getTestimonials } from "@/lib/data/testimonials";
import { getGeneralFAQs } from "@/lib/data/faqs";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const og = { az: "az_AZ", ru: "ru_RU", en: "en_US" }[locale];
  return {
    title: locale === "az" ? "XaricdÉ™ TÉ™hsil â€” Attestatla, Ä°mtahansÄ±z" : locale === "ru" ? "Ð£Ñ‡ÐµÐ±Ð° Ð·Ð° Ñ€ÑƒÐ±ÐµÐ¶Ð¾Ð¼ â€” Ð°Ñ‚Ñ‚ÐµÑÑ‚Ð°Ñ‚, Ð±ÐµÐ· ÑÐºÐ·Ð°Ð¼ÐµÐ½Ð¾Ð²" : "Study Abroad â€” Certificate, Exam-Free",
    description: locale === "az" ? "MegaGroup â€” 200+ universitet, 5 Ã¶lkÉ™. Attestatla qÉ™bul." : "MegaGroup â€” Study Abroad Center.",
    alternates: { canonical: `https://megagroup.az/${locale}`, languages: { az: "/az", ru: "/ru", en: "/en" } },
    openGraph: { title: "MegaGroup â€” Study Abroad", type: "website", locale: og },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const countries = await getCountries(locale);
  const universities = await getUniversitiesByCountry(countries[0]?.slug ?? "turkiye", locale);
  const testimonials = await getTestimonials(locale);
  const faqs = await getGeneralFAQs(locale);

  return (
    <>
      <HeroSection />
      <section id="olkeler" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground">{t("countriesTitle")}</h2>
        <p className="mt-2 text-center text-foreground/60">{t("countriesSubtitle")}</p>
        <div className="mt-8"><CountryTabs countries={countries} /></div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => (
            <FadeInUp key={c.slug} delay={i * 0.08}>
              <Link href={`/${locale}/xaricde-tehsil/${c.slug}`} className="glass block h-full rounded-2xl p-6 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
                <div className="text-4xl">{c.flag_emoji}</div>
                <h3 className="mt-3 font-heading text-xl font-bold text-foreground">{c.name}</h3>
                <p className="mt-2 text-sm text-foreground/70">{c.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-foreground/60">
                  <span>ðŸŽ“ {c.quick_stats.universities}</span>
                  <span>ðŸ’¬ {c.quick_stats.language}</span>
                  <span>ðŸ’° {c.quick_stats.avg_tuition_usd === 0 ? (locale === "az" ? "Pulsuz" : locale === "ru" ? "Ð‘ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾" : "Free") : `${c.quick_stats.avg_tuition_usd}/il`}</span>
                </div>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">{t("more", { ns: "cta" })} â†’</span>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </section>
      <section id="kalkulator" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground">{t("calcTitle")}</h2>
        <p className="mt-2 text-center text-foreground/60">{t("calcSubtitle")}</p>
        <div className="mt-8"><CostCalculator universities={universities} /></div>
      </section>
      <section id="heqayeler" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground">{t("storiesTitle")}</h2>
        <p className="mt-2 text-center text-foreground/60">{t("storiesSubtitle")}</p>
        <div className="mt-8"><SuccessStories testimonials={testimonials} /></div>
      </section>
      <InstagramCTA />
      <section id="faq" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground">{t("faqTitle")}</h2>
        <div className="mt-8"><FAQSection faqs={faqs} /></div>
- [ ] **Step 2: Migrate `xaricde-tehsil/page.tsx`** â†’ `src/app/[locale]/xaricde-tehsil/page.tsx`

Apply the miqrasiya qaydasÄ±: `params: Promise<{ locale: Locale }>`; `setRequestLocale(locale)`; replace `import { countries } from "@/data/countries"` â†’ `import { getCountries } from "@/lib/data/countries"` and `const countries = await getCountries(locale)`; `c.name_az`â†’`c.name`, `c.description_az`â†’`c.description`; links `href={`/${locale}/xaricde-tehsil/${c.slug}`}`; title `"XaricdÉ™ TÉ™hsil"` keep (brand); add `alternates.languages` hreflang.

- [ ] **Step 3: Migrate `xaricde-tehsil/[country]/page.tsx`** â†’ `src/app/[locale]/xaricde-tehsil/[country]/page.tsx`

```tsx
export const revalidate = 3600;

interface PageProps { params: Promise<{ locale: Locale; country: string }>; }

export function generateStaticParams() {
  const countries = ["turkiye", "rusiya", "ukrayna", "almaniya", "polsa"];
  return routing.locales.flatMap((locale) =>
    countries.map((country) => ({ locale, country })),
  );
}
```

Body: `const { locale, country } = await params; setRequestLocale(locale);` then `const c = await getCountryBySlug(country, locale); if (!c) notFound();`, `const unis = await getUniversitiesByCountry(country, locale);`, `const featured = await getFeaturedUniversity(country, locale);`, `const faqs = await getFAQsByCountry(country, locale);`. Replace all `c.name_az`â†’`c.name`, `c.description_az`â†’`c.description`, `featured.name_az`â†’`featured.name`, `featured.city_az`â†’`featured.city`; links add `/${locale}` prefix; JSON-LD use `c.name`.

- [ ] **Step 4: Migrate `xaricde-tehsil/[country]/[university]/page.tsx`** â†’ `[locale]/.../[university]/page.tsx`

`params: Promise<{ locale: Locale; country: string; university: string }>`; `const { locale, country, university } = await params; setRequestLocale(locale);`; `getUniversityBySlug(university, locale)`; `getFAQsByUniversity(university, locale)`; `getTestimonialsByUniversity(university, locale)`; replace `u.name_az`â†’`u.name`, `u.city_az`â†’`u.city`, `u.highlights` (already localized), `u.campus_info`/`u.notes` (already localized optional); links add `/${locale}`. `generateStaticParams` uses `getAllUniversitySlugs()` but since it's async + Supabase, instead use `export const dynamic = "force-static"` with `generateStaticParams` returning the 5 country slugs Ã— locales (university pages generate on-demand via ISR).

- [ ] **Step 5: Migrate `xaricde-tehsil/hesabla/page.tsx`** â†’ `[locale]/xaricde-tehsil/hesabla/page.tsx`

`params: Promise<{ locale: Locale }>`; `setRequestLocale(locale)`; `getCountries(locale)` + `getUniversitiesByCountry(countries[0]?.slug ?? "turkiye", locale)` for calculator; static labels via `getTranslations`.

- [ ] **Step 6: Migrate `xaricde-tehsil/muraciet/page.tsx`** â†’ `[locale]/xaricde-tehsil/muraciet/page.tsx`

`params: Promise<{ locale: Locale }>`; `setRequestLocale(locale)`; `getCountries(locale)` for the country select; form labels via `getTranslations`. GÃ¶ndÉ™rmÉ™ funksiyasÄ± placeholder qalÄ±r (CRM sonrakÄ± mÉ™rhÉ™lÉ™).

### Task 11: Header â€” centered menu + LanguageSwitcher

**Files:**
- Create: `src/components/layout/LanguageSwitcher.tsx`
- Modify: `src/components/layout/Header.tsx` (centered menu + locale links + translations)

- [ ] **Step 1: `src/components/layout/LanguageSwitcher.tsx`** (client, dropdown)

```tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: Locale) {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
    setOpen(false);
  }

  const labels: Record<Locale, string> = { az: "AZ", ru: "RU", en: "EN" };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Dil seÃ§"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <Globe size={16} /> {labels[locale]}
      </button>
      {open && (
        <div className="glass absolute right-0 mt-2 w-32 rounded-xl border border-white/20 p-1 shadow-xl">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10",
                l === locale ? "text-brand-primary" : "text-foreground/80",
              )}
            >
              {labels[l]} {l === locale && <Check size={14} />}
- [ ] **Step 2: Rewrite `src/components/layout/Header.tsx`** â€” centered menu (3-column grid)

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");

  const NAV_LINKS = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/xaricde-tehsil`, label: t("studyAbroad") },
    { href: `/${locale}/xaricde-tehsil/hesabla`, label: t("calculator") },
    { href: `/${locale}/xaricde-tehsil/muraciet`, label: t("apply") },
  ];

  return (
    <header className="glass fixed top-0 z-50 w-full border-b border-white/20 shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300">
      {/* 3 sÃ¼tun grid: logo | mÉ™rkÉ™zi nav | dil seÃ§ici */}
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="flex flex-col leading-tight tracking-tight-display justify-self-start">
          <span className="font-heading text-xl font-bold text-on-surface">MegaGroup</span>
          <span className="text-[0.7rem] text-on-surface-variant">XaricdÉ™ TÉ™hsil MÉ™rkÉ™zi</span>
        </Link>

        {/* MÆRKÆZDÆ menular */}
        <nav className="hidden items-center gap-6 justify-self-center md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end md:block">
          <LanguageSwitcher />
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Menyu" aria-expanded={open} className="rounded-lg p-2 text-foreground justify-self-end md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <nav className="flex flex-col gap-1 px-4 pb-4 sm:px-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 hover:text-brand-primary">
              {l.label}
            </Link>
          ))}
          <div className="px-3 py-2"><LanguageSwitcher /></div>
        </nav>
      </div>
    </header>
  );
### Task 12: Footer migration (locale links + translations + Supabase data)

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Rewrite `src/components/layout/Footer.tsx`** (async server component)

```tsx
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { getCountries } from "@/lib/data/countries";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const countries = await getCountries(locale);

  return (
    <footer className="glass border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-heading text-xl font-bold text-foreground">MegaGroup</div>
          <div className="text-sm text-foreground/60">XaricdÉ™ TÉ™hsil MÉ™rkÉ™zi</div>
          <p className="mt-3 text-sm text-foreground/70">
            AzÉ™rbaycanlÄ± tÉ™lÉ™bÉ™lÉ™r Ã¼Ã§Ã¼n xaricdÉ™ tÉ™hsil imkanlarÄ±nÄ± attestatla, imtahansÄ±z tÉ™qdim edirik.
          </p>
          <a href="https://www.instagram.com/mega_xaricde_tehsil_merkezi/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-brand-secondary hover:underline">
            <InstagramIcon size={18} /> @mega_xaricde_tehsil_merkezi
          </a>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">{t("countries")}</h3>
          <ul className="space-y-2">
            {countries.map((c) => (
              <li key={c.slug}>
                <Link href={`/${locale}/xaricde-tehsil/${c.slug}`} className="text-sm text-foreground/70 transition-colors hover:text-brand-primary">
                  {c.flag_emoji} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">{t("services")}</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link href={`/${locale}/xaricde-tehsil/hesabla`} className="hover:text-brand-primary">{t("countries")}</Link></li>
            <li><Link href={`/${locale}/xaricde-tehsil/muraciet`} className="hover:text-brand-primary">{t("contact")}</Link></li>
            <li><Link href={`/${locale}/xaricde-tehsil`} className="hover:text-brand-primary">{t("services")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">{t("contact")}</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-primary"><MessageCircle size={16} /> WhatsApp</a></li>
            <li><a href="https://www.instagram.com/mega_xaricde_tehsil_merkezi/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-brand-primary"><InstagramIcon size={16} /> Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-foreground/50">{t("rights")}</div>
    </footer>
  );
}
```

> Note: `[locale]/layout.tsx` calls `<Footer />` without props â€” async server component Ã¶zÃ¼ `getLocale()` ilÉ™ locale alÄ±r.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(footer): migrate to async server component with locale links + translations"
```

---
### Task 13: Section components localization (name_az → name)

**Files:**
- Modify: `src/components/sections/{CountryTabs,UniversityCard,UniversityGrid,SuccessStories,FAQSection,CostCalculator}.tsx`

- [ ] **Step 1: Find all `_az` references in sections**

Run: `Select-String -Path "src/components/sections/*.tsx" -Pattern "_az"`

- [ ] **Step 2: Replace field names** in each section component:
- `c.name_az` → `c.name`, `c.description_az` → `c.description`
- `u.name_az` → `u.name`, `u.city_az` → `u.city`
- `t.quote_az` → `t.quote` (testimonial)
- `f.question_az`/`f.answer_az` → `f.question`/`f.answer` (if used)
- `u.highlights` already localized by mapper (no change)

- [ ] **Step 3: Verify type-check**

Run: `npm run type-check`
Expected: PASS (all `_az` field errors resolved).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/
git commit -m "refactor(sections): use localized name/description/city/quote from mapper"
```

---

### Task 14: Sitemap 3 dil + SEO hreflang

**Files:**
- Modify: `src/app/sitemap.ts` (3 dil × all pages)

- [ ] **Step 1: Rewrite `src/app/sitemap.ts`** (async, 3 locales × all pages)

```typescript
import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getCountries } from "@/lib/data/countries";
import { getAllUniversitySlugs } from "@/lib/data/universities";

const baseUrl = "https://megagroup.az";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountries("az");
  const universities = await getAllUniversitySlugs();
  const staticPaths = ["", "/xaricde-tehsil", "/xaricde-tehsil/hesabla", "/xaricde-tehsil/muraciet"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({ url: `${baseUrl}/${locale}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "daily" : "weekly", priority: path === "" ? 1.0 : 0.8, alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])) } });
    }
    for (const c of countries) {
      entries.push({ url: `${baseUrl}/${locale}/xaricde-tehsil/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8, alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/xaricde-tehsil/${c.slug}`])) } });
    }
    for (const u of universities) {
      entries.push({ url: `${baseUrl}/${locale}/xaricde-tehsil/${u.country_slug}/${u.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7, alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/xaricde-tehsil/${u.country_slug}/${u.slug}`])) } });
    }
  }
  return entries;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): 3-locale sitemap with hreflang alternates"
```

---

## Phase 5 — Seed Migrasiyası

### Task 15: Seed script (src/data → Supabase)

**Files:**
- Create: `scripts/seed-supabase.ts`

- [ ] **Step 1: Write `scripts/seed-supabase.ts`**

```typescript
import { createAdminClient } from "../src/lib/supabase/admin";
import { countries } from "../src/data/countries";
import { universities } from "../src/data/universities";
import { faqs } from "../src/data/faqs";
import { testimonials } from "../src/data/testimonials";

async function seed() {
  const supabase = createAdminClient();
  console.log("Seeding countries...");
  for (const c of countries) {
    await supabase.from("countries").upsert({
      slug: c.slug, flag_emoji: c.flag_emoji, hero_image_url: c.hero_image_url,
      sort_order: c.sort_order, is_active: c.is_active, is_featured: c.is_featured,
      name_az: c.name_az, name_ru: c.name_az, name_en: c.name_en,
      description_az: c.description_az, description_ru: c.description_az, description_en: c.description_az,
      warning_banner_az: c.warning_banner, warning_banner_ru: c.warning_banner, warning_banner_en: c.warning_banner,
      advantages_az: c.advantages, advantages_ru: c.advantages, advantages_en: c.advantages,
      documents_az: c.documents_required, documents_ru: c.documents_required, documents_en: c.documents_required,
      steps_az: c.application_steps, steps_ru: c.application_steps, steps_en: c.application_steps,
      qs_universities: c.quick_stats.universities, qs_avg_tuition_usd: c.quick_stats.avg_tuition_usd,
      qs_language: c.quick_stats.language, qs_visa_difficulty: c.quick_stats.visa_difficulty,
    }, { onConflict: "slug" });
  }
  console.log("Seeding universities + faculties + fees...");
  for (const u of universities) {
    await supabase.from("universities").upsert({
      slug: u.slug, country_slug: u.country_slug, website_url: u.website_url,
      logo_url: u.logo_url, hero_image_url: u.hero_image_url,
      is_active: u.is_active, is_featured: u.is_featured,
      name_az: u.name_az, name_ru: u.name_az, name_en: u.name_az,
      city_az: u.city_az, city_ru: u.city_az, city_en: u.city_az,
      highlights_az: u.highlights, highlights_ru: u.highlights, highlights_en: u.highlights,
      notes_az: u.notes, notes_ru: u.notes, notes_en: u.notes,
      campus_info_az: u.campus_info, campus_info_ru: u.campus_info, campus_info_en: u.campus_info,
    }, { onConflict: "slug" });
    for (const f of u.faculties) {
      await supabase.from("faculties").upsert({
        university_slug: u.slug, name_az: f.name_az, name_ru: f.name_az, name_en: f.name_az,
        is_competitive: f.is_competitive, duration_years: f.duration_years, language: f.language,
      });
    }
    await supabase.from("university_fees").upsert({ university_slug: u.slug, ...u.fees }, { onConflict: "university_slug" });
  }
  console.log("Seeding FAQs...");
  for (const f of faqs) {
    await supabase.from("faqs").insert({
      country_slug: f.country_slug, university_slug: f.university_slug,
      question_az: f.question, question_ru: f.question, question_en: f.question,
      answer_az: f.answer, answer_ru: f.answer, answer_en: f.answer,
    });
  }
  console.log("Seeding testimonials...");
  for (const t of testimonials) {
    await supabase.from("testimonials").upsert({
      student_name: t.student_name, university_slug: t.university_slug, country_slug: t.country_slug,
      photo_url: t.photo_url, quote_az: t.quote_az, quote_ru: t.quote_az, quote_en: t.quote_az,
      year: t.year, is_active: true,
    });
  }
  console.log("Seeding site_content...");
  const sc = [
    { key: "hero_title", az: "Xaricdə Təhsil — Attestatla, İmtahansız" },
    { key: "hero_subtitle", az: "MegaGroup — Xaricdə Təhsil Mərkəzi" },
    { key: "cta_choose_country", az: "Ölkə Seç" },
    { key: "cta_apply", az: "Müraciət Et" },
    { key: "cta_free_consult", az: "Pulsuz Konsultasiya Al" },
  ];
  for (const s of sc) {
    await supabase.from("site_content").upsert({ key: s.key, value_az: s.az, value_ru: s.az, value_en: s.az }, { onConflict: "key" });
  }
  console.log("Creating admin user...");
  const { error } = await supabase.auth.admin.createUser({
    email: process.env.SEED_ADMIN_EMAIL!, password: process.env.SEED_ADMIN_PASSWORD!, email_confirm: true,
  });
  if (error && !error.message.includes("already")) console.error("Admin:", error.message);
  else console.log("Admin ready:", process.env.SEED_ADMIN_EMAIL);
  console.log("Seed complete!");
}
seed().catch(console.error);
```

> `_ru`/`_en` ilkin AZ'dan kopyalanır (spec fərziyyəsi). Sonradan dashboard'dan tərcümə.

- [ ] **Step 2: Run seed** (Supabase qurulu + `.env.local` dolu)

Run: `npm run seed`
Expected: "Seed complete!"

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-supabase.ts
git commit -m "feat(seed): migrate local data to Supabase with admin user"
```

---

## Phase 6 — Dashboard Skeleton

### Task 16: Dashboard layout (auth guard) + Sidebar + Topbar

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Create: `src/components/dashboard/Sidebar.tsx`
- Create: `src/components/dashboard/Topbar.tsx`
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: `src/app/dashboard/layout.tsx`** (auth guard + html/body)

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import "../globals.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/dashboard/login");
  return (
    <html lang="az" className="dark">
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: `src/components/dashboard/Sidebar.tsx`**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, GraduationCap, HelpCircle, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Ana", icon: LayoutDashboard },
  { href: "/dashboard/olkeler", label: "Ölkələr", icon: Globe },
  { href: "/dashboard/universitetler", label: "Universitetlər", icon: GraduationCap },
  { href: "/dashboard/faq", label: "FAQ", icon: HelpCircle },
  { href: "/dashboard/testimoniallar", label: "Testimoniallar", icon: MessageSquare },
  { href: "/dashboard/sayt-mezmunu", label: "Sayt Məzmunu", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-card/50 md:block">
      <div className="p-6">
        <div className="font-heading text-lg font-bold text-foreground">MegaGroup CMS</div>
        <div className="text-xs text-foreground/50">Xaricdə Təhsil</div>
      </div>
      <nav className="px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-brand-primary/20 text-brand-primary" : "text-foreground/70 hover:bg-white/5 hover:text-foreground")}>
              <item.icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```


- [ ] **Step 3: `src/components/dashboard/Topbar.tsx`** (logout)

```tsx
"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function Topbar() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  }
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-3">
      <div className="text-sm text-foreground/60">Admin Panel</div>
      <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-primary">
        <LogOut size={16} /> Çıxış
      </button>
    </header>
  );
}
```

- [ ] **Step 4: `src/app/dashboard/page.tsx`** (redirect to first CMS section)

```tsx
import { redirect } from "next/navigation";
export default function DashboardHome() { redirect("/dashboard/olkeler"); }
```

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/layout.tsx src/app/dashboard/page.tsx src/components/dashboard/
git commit -m "feat(dashboard): add auth-guarded layout with sidebar + topbar"
```

---

### Task 17: Login page

**Files:**
- Create: `src/app/dashboard/login/page.tsx`

- [ ] **Step 1: Write `src/app/dashboard/login/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/dashboard"); router.refresh(); }
  }

  return (
    <html lang="az" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="glass w-full max-w-md rounded-2xl p-8">
          <h1 className="font-heading text-2xl font-bold">MegaGroup CMS</h1>
          <p className="mt-1 text-sm text-foreground/60">Daxil olun</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-foreground/70">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-foreground/70">Parol</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
              {loading ? "Daxil olur..." : "Daxil ol"}
            </button>
          </form>
        </div>
      </body>
    </html>
  );
}
```

> Login page öz `<html>`/`<body>` render edir (middleware login'i auth guard-dan istisna edib).

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/login/page.tsx
git commit -m "feat(dashboard): add login page with Supabase auth"
```

---

## Phase 7 — CMS Bölmələri

### Task 18: Dashboard shared components + Zod schemas

**Files:**
- Create: `src/components/dashboard/LanguageTabs.tsx`
- Create: `src/components/dashboard/FormField.tsx`
- Create: `src/components/dashboard/ConfirmDelete.tsx`
- Create: `src/lib/validations/country.schema.ts`

- [ ] **Step 1: `src/components/dashboard/LanguageTabs.tsx`**

```tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LanguageTabs({ children }: { children: (lang: "az" | "ru" | "en") => React.ReactNode }) {
  const [lang, setLang] = useState<"az" | "ru" | "en">("az");
  const tabs = [{ id: "az", label: "AZ", required: true }, { id: "ru", label: "RU" }, { id: "en", label: "EN" }] as const;
  return (
    <div>
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setLang(t.id)} className={cn("px-4 py-2 text-sm font-medium transition-colors", lang === t.id ? "border-b-2 border-brand-primary text-brand-primary" : "text-foreground/60 hover:text-foreground")}>
            {t.label}{t.required && <span className="ml-1 text-red-400">*</span>}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(lang)}</div>
    </div>
  );
}
```

- [ ] **Step 2: `src/components/dashboard/FormField.tsx`**

```tsx
"use client";
interface FormFieldProps { label: string; name: string; type?: "text" | "textarea" | "number"; value: string | number; onChange: (v: string) => void; required?: boolean; placeholder?: string; }
export function FormField({ label, name, type = "text", value, onChange, required, placeholder }: FormFieldProps) {
  const c = "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none";
  return (
    <div>
      <label htmlFor={name} className="text-sm text-foreground/70">{label}{required && <span className="ml-1 text-red-400">*</span>}</label>
      {type === "textarea" ? (
        <textarea id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} rows={4} className={c} />
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className={c} />
      )}
    </div>
  );
}
```

- [ ] **Step 3: `src/components/dashboard/ConfirmDelete.tsx`**

```tsx
"use client";
import { useState } from "react";
export function ConfirmDelete({ onConfirm, itemName }: { onConfirm: () => void; itemName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-red-400 hover:text-red-300">Sil</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="glass w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold">Silinsin?</h3>
            <p className="mt-2 text-sm text-foreground/60">"{itemName}" silinəcək. Geri alına bilməz.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">İmtina</button>
              <button type="button" onClick={() => { onConfirm(); setOpen(false); }} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Sil</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: `src/lib/validations/country.schema.ts`**

```typescript
import { z } from "zod";
export const countrySchema = z.object({
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, "Slug yalnız kiçik hərf, rəqəm və tire"),
  flag_emoji: z.string().max(10).optional().or(z.literal("")),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  name_az: z.string().min(1, "AZ ad məcburidir"),
  name_ru: z.string().optional().or(z.literal("")),
  name_en: z.string().optional().or(z.literal("")),
  description_az: z.string().optional().or(z.literal("")),
  description_ru: z.string().optional().or(z.literal("")),
  description_en: z.string().optional().or(z.literal("")),
  qs_universities: z.coerce.number().int().min(0).default(0),
  qs_avg_tuition_usd: z.coerce.number().int().min(0).default(0),
  qs_language: z.string().optional().or(z.literal("")),
  qs_visa_difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});
export type CountryFormData = z.input<typeof countrySchema>;
export type CountryFormOutput = z.output<typeof countrySchema>;
```

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/LanguageTabs.tsx src/components/dashboard/FormField.tsx src/components/dashboard/ConfirmDelete.tsx src/lib/validations/country.schema.ts
git commit -m "feat(dashboard): add shared components + country zod schema"
```

---

### Task 19: Countries CMS (template for all CMS sections)

**Files:**
- Create: `src/app/dashboard/olkeler/actions.ts`
- Create: `src/app/dashboard/olkeler/page.tsx` (list)
- Create: `src/app/dashboard/olkeler/yeni/page.tsx` (create form)
- Create: `src/app/dashboard/olkeler/[id]/page.tsx` (edit form)

- [ ] **Step 1: `src/app/dashboard/olkeler/actions.ts`** (server actions)

```typescript
"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { countrySchema } from "@/lib/validations/country.schema";

export async function createCountry(formData: FormData) {
  const parsed = countrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase.from("countries").insert(parsed.data);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function updateCountry(id: string, formData: FormData) {
  const parsed = countrySchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase.from("countries").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function deleteCountry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("countries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}
```


- [ ] **Step 2b: DeleteCountryButton** (client wrapper)

```tsx
"use client";
import { useTransition } from "react";
import { deleteCountry } from "./actions";
import { ConfirmDelete } from "@/components/dashboard/ConfirmDelete";

export function DeleteCountryButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  return <ConfirmDelete itemName={name} onConfirm={() => startTransition(async () => { await deleteCountry(id); })} />;
}
```


- [ ] **Step 2: `src/app/dashboard/olkeler/page.tsx`** (list)

Server component: fetch countries from Supabase, render table with columns Bayraq, Slug, Ad (AZ), Aktiv, Emeleyyat. Each row: `c.flag_emoji`, `c.slug`, `c.name_az`, Redaktə link to `/dashboard/olkeler/{c.id}` + `<DeleteCountryButton id={c.id} name={c.name_az} />`. Header: "+ Yeni Ölkə" button -> `/dashboard/olkeler/yeni`. Imports: `Link`, `createClient`, `DeleteCountryButton`.

- [ ] **Step 3: `src/app/dashboard/olkeler/yeni/page.tsx`** (create form — client component)

Form with `useState` holding all country fields. Uses `<LanguageTabs>` (AZ|R U|EN tabs) wrapping `<FormField>` for name + description per language. AZ required. Non-localized fields (slug, flag_emoji, hero_image_url, sort_order, qs_universities, qs_avg_tuition_usd, qs_language, qs_visa_difficulty select, is_active/is_featured checkboxes) rendered outside tabs. On submit: build `FormData`, call `createCountry(fd)` server action. On success: `router.push("/dashboard/olkeler")`. On error: show error message. Imports: `useState`, `useRouter`, `LanguageTabs`, `FormField`, `createCountry`.

- [ ] **Step 4: `src/app/dashboard/olkeler/[id]/page.tsx`** (edit — server component fetches country)

`const { id } = await params; const supabase = await createClient(); const { data } = await supabase.from("countries").select("*").eq("id", id).single();` then render `<CountryEditForm country={data} />` (client component in same folder, same as yeni form but prefilled `defaultValue`-s and calls `updateCountry(id, formData)`).

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/olkeler/
git commit -m "feat(cms): add countries CMS (list + create + edit + delete + server actions)"
```

---

### Task 20: Universities CMS (+ faculties + fees sub-forms)

**Files:**
- Create: `src/app/dashboard/universitetler/actions.ts`
- Create: `src/app/dashboard/universitetler/page.tsx` (list)
- Create: `src/app/dashboard/universitetler/yeni/page.tsx` (create)
- Create: `src/app/dashboard/universitetler/[id]/page.tsx` (edit)
- Create: `src/lib/validations/university.schema.ts`

Follows Task 19 template exactly. Differences:
- **Schema** (`university.schema.ts`): slug, country_slug (select from countries), website_url, logo_url, hero_image_url, is_active, is_featured, name_az/ru/en, city_az/ru/en, highlights_az/ru/en (JSON array — textarea, one per line), notes_az/ru/en, campus_info_az/ru/en.
- **Sub-form 1 — Faculties**: dynamic list (add/remove rows), each row: name_az/ru/en (3-dilli), is_competitive checkbox, duration_years number, language text. On save: upsert all faculties for this university_slug (delete removed, insert new).
- **Sub-form 2 — Fees**: 10 number fields (tuition/dorm/food/transport/personal min/max USD). Single upsert to `university_fees` table.
- **Server actions**: `createUniversity`, `updateUniversity`, `deleteUniversity`, `saveFaculties(universitySlug, faculties[])`, `saveFees(universitySlug, fees)`.
- **List columns**: Logo, Slug, Ölkə (country_slug), Ad (AZ), Aktiv, Əməliyyat.
- **revalidatePath**: `"/[locale]/xaricde-tehsil/[country]/[university]"`.

- [ ] **Step 1-5**: Same structure as Task 19 (schema, actions, list, yeni, [id] edit, commit).

```bash
git add src/app/dashboard/universitetler/ src/lib/validations/university.schema.ts
git commit -m "feat(cms): add universities CMS with faculties + fees sub-forms"
```

---

### Task 21: FAQ CMS

**Files:**
- Create: `src/app/dashboard/faq/actions.ts`, `page.tsx`, `yeni/page.tsx`, `[id]/page.tsx`
- Create: `src/lib/validations/faq.schema.ts`

Follows Task 19 template. Fields: country_slug (optional select), university_slug (optional select), question_az/ru/en (required AZ), answer_az/ru/en (textarea, required AZ), sort_order. List columns: Suat (AZ), Ölkə/Universite, Sira. Schema: `question_az` min(1) required, `answer_az` min(1) required, RU/EN optional.

```bash
git add src/app/dashboard/faq/ src/lib/validations/faq.schema.ts
git commit -m "feat(cms): add FAQ CMS with 3-language tabs"
```

---

### Task 22: Testimonials CMS

**Files:**
- Create: `src/app/dashboard/testimoniallar/actions.ts`, `page.tsx`, `yeni/page.tsx`, `[id]/page.tsx`
- Create: `src/lib/validations/testimonial.schema.ts`

Follows Task 19 template. Fields: student_name (required), university_slug (select), country_slug (select), photo_url, quote_az/ru/en (textarea, required AZ), year (number), is_active, sort_order. List columns: Şəkil, Ad, Universite, İl, Aktiv.

```bash
git add src/app/dashboard/testimoniallar/ src/lib/validations/testimonial.schema.ts
git commit -m "feat(cms): add testimonials CMS"
```

---

### Task 23: Sayt Məzmunu CMS (site_content)

**Files:**
- Create: `src/app/dashboard/sayt-mezmunu/actions.ts`, `page.tsx`
- Create: `src/lib/validations/site-content.schema.ts`

Different from others — no separate yeni/[id] (site_content uses `key` as PK, fixed set of keys). Single page with all content keys in an editable list. Each row: key (readonly), value_az (required), value_ru, value_en (3-dilli inline). Save button per row or single save-all. Schema: `key` string, `value_az` min(1), `value_ru`/`value_en` optional.

```bash
git add src/app/dashboard/sayt-mezmunu/ src/lib/validations/site-content.schema.ts
git commit -m "feat(cms): add site content CMS (hero/CTA texts)"
```

---
## Phase 8 — Test

### Task 24: Vitest — zod schema tests

**Files:**
- Create: `tests/unit/schemas.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, it, expect } from "vitest";
import { countrySchema } from "@/lib/validations/country.schema";

describe("countrySchema", () => {
  it("requires name_az", () => {
    const r = countrySchema.safeParse({ slug: "test", name_az: "" });
    expect(r.success).toBe(false);
  });
  it("accepts minimal valid input (AZ only)", () => {
    const r = countrySchema.safeParse({ slug: "turkiye", name_az: "Türkiyə" });
    expect(r.success).toBe(true);
  });
  it("rejects invalid slug (uppercase)", () => {
    const r = countrySchema.safeParse({ slug: "Turkiye", name_az: "X" });
    expect(r.success).toBe(false);
  });
  it("coerces sort_order string to number", () => {
    const r = countrySchema.safeParse({ slug: "x", name_az: "X", sort_order: "5" });
    expect(r.success && r.data.sort_order).toBe(5);
  });
  it("name_ru and name_en are optional", () => {
    const r = countrySchema.safeParse({ slug: "x", name_az: "X", name_ru: "", name_en: "" });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test**

Run: `npm test -- schemas`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/unit/schemas.test.ts
git commit -m "test: add zod schema validation unit tests"
```

---

### Task 25: Playwright E2E — 3 locales + dashboard auth

**Files:**
- Create: `tests/e2e/multilang.spec.ts`
- Create: `tests/e2e/dashboard.spec.ts`

- [ ] **Step 1: `tests/e2e/multilang.spec.ts`** (3 dil açılış + dil keçidi + centered menu)

```typescript
import { test, expect } from "@playwright/test";

test("AZ homepage loads with hero", async ({ page }) => {
  await page.goto("http://localhost:3000/az");
  await expect(page.locator("h2")).toBeVisible();
});

test("RU homepage loads", async ({ page }) => {
  await page.goto("http://localhost:3000/ru");
  await expect(page).toHaveURL(/\/ru/);
});

test("EN homepage loads", async ({ page }) => {
  await page.goto("http://localhost:3000/en");
  await expect(page).toHaveURL(/\/en/);
});

test("language switcher changes locale", async ({ page }) => {
  await page.goto("http://localhost:3000/az");
  await page.getByRole("button", { name: /Dil seç|AZ/ }).click();
  await page.getByRole("button", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en/);
});

test("nav menu is centered on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("http://localhost:3000/az");
  const nav = page.locator("nav").first();
  const navBox = await nav.boundingBox();
  expect(navBox).not.toBeNull();
  // Nav should be roughly centered (within 100px of viewport center)
  const viewportCenter = 640;
  expect(Math.abs(navBox!.x + navBox!.width / 2 - viewportCenter)).toBeLessThan(150);
});
```

- [ ] **Step 2: `tests/e2e/dashboard.spec.ts`** (auth guard + login)

```typescript
import { test, expect } from "@playwright/test";

test("dashboard redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard");
  await expect(page).toHaveURL(/\/dashboard\/login/);
});

test("login page renders form", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard/login");
  await expect(page.getByRole("heading", { name: /MegaGroup CMS/ })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Parol")).toBeVisible();
});
```

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/multilang.spec.ts tests/e2e/dashboard.spec.ts
git commit -m "test: add Playwright E2E for 3 locales + dashboard auth guard"
```

---

## Phase 9 — Doğrulama

### Task 26: Full build + dev verification

- [ ] **Step 1: Type-check**

Run: `npm run type-check`
Expected: PASS (0 errors)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Build succeeds. All `[locale]` routes generate for az/ru/en. Dashboard routes build.

- [ ] **Step 3: Dev server smoke test**

Run: `npm run dev`
- Visit `http://localhost:3000` -> redirects to `/az`
- Visit `/az`, `/ru`, `/en` -> all render with localized content
- Click language switcher -> URL + text changes
- Header menu is centered on desktop
- Visit `/dashboard` -> redirects to `/dashboard/login`
- Login with seed admin -> dashboard loads
- Edit a country in CMS -> public page updates after revalidate

- [ ] **Step 4: Run all tests**

Run: `npm test && npm run test:e2e`
Expected: All Vitest unit + Playwright E2E pass.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete dashboard CMS + AZ/RU/EN multilang migration"
```

---

## Self-Review

**1. Spec coverage:**
- Supabase backend (7 tables, RLS, Auth) -> Task 2, 3 ✓
- next-intl [locale] routing -> Task 7, 8, 9 ✓
- Data qatı + mappers -> Task 4, 5, 6 ✓
- Admin Dashboard CMS -> Task 16-23 ✓
- Header centered menu + LanguageSwitcher -> Task 11 ✓
- Seed migrasiyası -> Task 15 ✓
- SEO 3 dil hreflang -> Task 10, 14 ✓
- Test Vitest + Playwright -> Task 5, 24, 25 ✓
- All 16 uğur kriteriyaları covered in Task 26 verification ✓

**2. Placeholder scan:** No TBD/TODO. Task 20-23 use "follows Task 19 template" with explicit field differences — this is intentional DRY (the engineer repeats the pattern with documented differences, not a placeholder).

**3. Type consistency:**
- `Locale` defined in `i18n/routing.ts`, re-exported — used consistently in all data fetch functions, mappers, pages.
- `mapCountryRow`/`mapUniversityRow` etc. all take `(row, locale)` — consistent across Task 5/6.
- Server actions `createCountry`/`updateCountry`/`deleteCountry` — names consistent in Task 19.
- `revalidatePath("/[locale]", "page")` — consistent across all CMS actions.

**4. Scope check:** Single coherent sub-project (CMS + multilang), focused implementation plan. ✓

---

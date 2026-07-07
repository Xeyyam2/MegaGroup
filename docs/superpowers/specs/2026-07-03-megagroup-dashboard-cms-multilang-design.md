# MegaGroup — Admin Dashboard (CMS) + Çoxdilli (AZ/RU/EN): Dizayn Spec

> **Tarix:** 2026-07-03
> **Mənbə spec:** `xaricdetehsil.md` (v1.1.0) — bölmə 9 (Admin Dashboard), bölmə 4 (i18n routing), bölmə 5 (DB şema)
> **Alt-layihə:** 2/4 + 3/4 birləşmiş — Backend (Supabase) + Admin CMS Dashboard + Çoxdilli miqrasiya
> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Shadcn/ui · Supabase (Postgres + Auth + RLS) · next-intl
> **Əlaqəli spec:** `2026-07-02-megagroup-study-abroad-visual-site-design.md` (alt-layihə 1 — vizual ictimai sayt, hazırdır)

---

## 1. Məqsəd

Mövcud vizual ictimai saytı (alt-layihə 1) Supabase backend-inə qoşmaq, admin dashboard'dan sayt məzmununu (ölkələr, universitetlər, fakültələr, qiymətlər, FAQ, testimoniallar, hero/CTA mətnləri) redaktə etmək imkanı yaratmaq və saytı AZ/RU/ENG üç dildə tam çoxdilli hala gətirmək. Bu mərhələdə **yalnız CMS** var — müraciətlər/leads CRM və realtime bildirişlər sonrakı mərhələyə saxlanılır.

### Brend (alt-layihə 1-dən dəyişməz)

- **Ana brend:** MegaGroup · **Xidmət adı:** Xaricdə Təhsil Mərkəzi
- **Logoda:** MegaGroup · **Başlıqlarda:** "MegaGroup — Xaricdə Təhsil Mərkəzi"

---

## 2. Sahə (Scope)

### Daxildir

1. **Supabase backend qurulumu:** Postgres şema (çoxdilli sütunlarla), Auth (email/parol), RLS siyasətləri (public SELECT, authenticated admin INSERT/UPDATE/DELETE)
2. **Çoxdilli routing miqrasiyası:** next-intl + `[locale]/` qovluğu — bütün public səhifələr `/az/`, `/ru/`, `/en/` prefiksi alır (AZ default)
3. **Data qatı:** `src/lib/data/*` — tək erişim nöqtəsi, Supabase'dən oxuyub lokalizə olunmuş tiplərə çevirər (fallback: RU/EN boşsa AZ'ya)
4. **Admin Dashboard (CMS):** `/dashboard/*` — auth protected, 3 dilli tab formaları ilə məzmun redaktəsi
   - Ölkələr CMS (slug, ad, bayraq, şəkil, təsvir, üstünlüklər, sənədlər, addımlar, quick_stats)
   - Universitetlər CMS (ad, şəhər, veb, logo, hero, highlights, notes, campus_info + fakültələr + qiymətlər)
   - FAQ CMS (çoxdilli sual/cavab, ölkə/universitet spesifik)
   - Testimonial CMS (tələbə adı, foto, sitat, il)
   - Sayt məzmunu CMS (`site_content` cədvəli — hero başlığı/subtitle, CTA düymə mətnləri)
5. **Dil keçid UI:** Header'da AZ/RU/EN dil seçici; ana saytda menular **mərkəzdə** yer alır
6. **SEO miqrasiyası:** `generateMetadata` 3 dil üçün hreflang, `sitemap.ts` 3 dil × bütün səhifələr
7. **Seed miqrasiyası:** `src/data/*.ts` seed faylları bir dəfəlik Supabase'ə köçürülər (`scripts/seed-supabase.ts`); `_ru` sahələri ilkin olaraq AZ'dan kopyalanar
8. **Test:** Vitest unit (mapper fallback, zod sxemaları), Playwright E2E (3 dildə açılış, dil keçidi, dashboard login + ölkə redaktə)

### Xaricdir (sonrakı alt-layihələrə)

- **Leads CRM:** müraciətlər cədvəli/kanban, realtime bildiriş (Supabase Realtime), email (Resend), WhatsApp Business API
- **Statistika dashboard:** stats kartları, grafiklər (leads yoxdur, ona görə bu mərhələdə boş)
- **İstifadəçi idarəetmə:** çoxlu admin/rol sistemi
- **Instagram Graph API canlı feed** (alt-layihə 4)
- **Blog CMS** (alt-layihə 4)

---

## 3. Arxitektura Ümumi Baxış

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│  /az/  /ru/  /en/  ← next-intl [locale] routing        │
│  /dashboard/*      ← admin CMS (auth protected)         │
└───────────────┬─────────────────────────────────────────┘
                │
   ┌────────────┴─────────────┐
   │  Next.js App Router      │
   │  ├─ [locale]/ (public)   │  ← data: Supabase (public read)
   │  └─ dashboard/ (admin)   │  ← data: Supabase (admin write)
   │  middleware.ts           │  ← next-intl + auth guard
   └────────────┬─────────────┘
                │
         ┌──────┴───────┐
         │  Data Layer  │  src/lib/data/*  (tək erişim nöqtəsi)
         │  src/lib/    │  supabase/client.ts (browser)
         │  supabase/   │  supabase/server.ts (RSC/server actions)
         └──────┬───────┘
## 4. Texniki Stack (əlavələr)

| Qat | Texnologiya | Status |
|---|---|---|
| Backend | Supabase (Postgres + Auth + RLS) | **YENİ** |
| i18n | next-intl | **YENİ** |
| Dashboard UI | Shadcn/ui (Table, Dialog, Tabs, Form, Button) | **YENİ** |
| Form | react-hook-form + zod (mövcud) | bərpa olunur |
| Supabase client | `@supabase/supabase-js` + `@supabase/ssr` | **YENİ** |
| Test | Vitest (unit), Playwright (E2E) | mövcud |

> Mövcud stack (Next.js 16, React 19, TS strict, Tailwind v4, three/gsap/lenis, framer-motion) dəyişməz. Vizual effektlər (3D hero, glassmorphism, smooth scroll) toxunulmaz.

---

## 5. Supabase Şema (Çoxdilli)

### 5.1 Cədvəllər

```sql
-- ÖLKƏLƏR
countries (
  id            UUID PK DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,           -- 'turkiye'
  flag_emoji    TEXT,                           -- '🇹🇷'
  hero_image_url TEXT,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  is_featured   BOOLEAN DEFAULT false,
  name_az       TEXT NOT NULL,
  name_ru       TEXT,
  name_en       TEXT,
  description_az TEXT,  description_ru TEXT,  description_en TEXT,
  warning_banner_az TEXT,  warning_banner_ru TEXT,  warning_banner_en TEXT,
  advantages_az JSONB DEFAULT '[]',  advantages_ru JSONB DEFAULT '[]',  advantages_en JSONB DEFAULT '[]',
  documents_az  JSONB DEFAULT '[]',  documents_ru  JSONB DEFAULT '[]',  documents_en  JSONB DEFAULT '[]',
  steps_az      JSONB DEFAULT '[]',  steps_ru      JSONB DEFAULT '[]',  steps_en      JSONB DEFAULT '[]',
  qs_universities INT, qs_avg_tuition_usd INT, qs_language TEXT, qs_visa_difficulty TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
)

-- UNIVERSITETLƏR
universities (
  id            UUID PK DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  country_slug  TEXT NOT NULL REFERENCES countries(slug),
  website_url   TEXT, logo_url TEXT, hero_image_url TEXT,
  is_active     BOOLEAN DEFAULT true, is_featured BOOLEAN DEFAULT false,
  name_az TEXT NOT NULL, name_ru TEXT, name_en TEXT,
  city_az TEXT NOT NULL,  city_ru TEXT,  city_en TEXT,
  highlights_az JSONB DEFAULT '[]', highlights_ru JSONB DEFAULT '[]', highlights_en JSONB DEFAULT '[]',
  notes_az TEXT, notes_ru TEXT, notes_en TEXT,
  campus_info_az TEXT, campus_info_ru TEXT, campus_info_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
)

-- FAKÜLTƏLƏR
faculties (
  id UUID PK DEFAULT gen_random_uuid(),
  university_slug TEXT NOT NULL REFERENCES universities(slug) ON DELETE CASCADE,
  name_az TEXT NOT NULL, name_ru TEXT, name_en TEXT,
  is_competitive BOOLEAN, duration_years INT, language TEXT,
  sort_order INT DEFAULT 0
)

-- QİYMƏTLƏR (universitet başına bir sətir)
university_fees (
  university_slug TEXT PK REFERENCES universities(slug) ON DELETE CASCADE,
  tuition_min_usd INT, tuition_max_usd INT,
  dorm_min_usd INT, dorm_max_usd INT,
  food_min_usd INT, food_max_usd INT,
  transport_min_usd INT, transport_max_usd INT,
  personal_min_usd INT, personal_max_usd INT
)

-- FAQ
faqs (
  id UUID PK DEFAULT gen_random_uuid(),
  country_slug TEXT REFERENCES countries(slug) ON DELETE CASCADE,
  university_slug TEXT REFERENCES universities(slug) ON DELETE CASCADE,
  question_az TEXT NOT NULL, question_ru TEXT, question_en TEXT,
  answer_az TEXT NOT NULL, answer_ru TEXT, answer_en TEXT,
  sort_order INT DEFAULT 0
)

-- TESTIMONIALLAR
testimonials (
  id UUID PK DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  university_slug TEXT REFERENCES universities(slug) ON DELETE SET NULL,
  country_slug TEXT REFERENCES countries(slug) ON DELETE SET NULL,
  photo_url TEXT,
  quote_az TEXT NOT NULL, quote_ru TEXT, quote_en TEXT,
  year INT, is_active BOOLEAN DEFAULT true, sort_order INT DEFAULT 0
)

-- SAYT MƏZMUNU (hero başlığı, CTA mətnləri və s.)
site_content (
  key TEXT PK,                           -- 'hero_title', 'hero_subtitle', 'cta_apply', ...
  value_az TEXT NOT NULL, value_ru TEXT, value_en TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
)

-- İndekslər
CREATE INDEX idx_universities_country_slug ON universities(country_slug);
CREATE INDEX idx_faculties_university_slug ON faculties(university_slug);
CREATE INDEX idx_faqs_country_slug ON faqs(country_slug);
CREATE INDEX idx_faqs_university_slug ON faqs(university_slug);
```

### 5.2 RLS Siyasəti

```sql
-- Bütün public cədvəllər üçün eyni pattern
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON countries FOR SELECT USING (true);
CREATE POLICY "admin write" ON countries FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- eyni: universities, faculties, university_fees, faqs, testimonials, site_content
## 6. Fayl Strukturu (miqrasiya edilmiş)

```
src/
├── app/
│   ├── [locale]/                       # PUBLIC (next-intl: az, ru, en)
│   │   ├── layout.tsx                  # NextIntlClientProvider + Header + Footer + SmoothScrollProvider
│   │   ├── page.tsx                    # Ana səhifə
│   │   ├── xaricde-tehsil/
│   │   │   ├── page.tsx
│   │   │   ├── hesabla/page.tsx
│   │   │   ├── muraciet/page.tsx
│   │   │   ├── [country]/page.tsx
│   │   │   └── [country]/[university]/page.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── loading.tsx
│   ├── dashboard/                      # ADMIN (auth protected, dildən asılı deyil)
│   │   ├── layout.tsx                  # Auth guard + Sidebar + Topbar (dil toggle)
│   │   ├── page.tsx                    # CMS ana (cədvəl siyahısı / yönləndirmə)
│   │   ├── login/
│   │   │   └── page.tsx                # Auth login forması
│   │   ├── olkeler/
│   │   │   ├── page.tsx                # siyahı (DataTable)
│   │   │   ├── actions.ts              # server actions: create/update/delete
│   │   │   ├── yeni/page.tsx           # yarat formu
│   │   │   └── [id]/page.tsx           # redaktə formu (3 dilli tab)
│   │   ├── universitetler/             # eyni pattern (+ fakültə + qiymət alt-formlar)
│   │   ├── faq/                        # eyni pattern
│   │   ├── testimoniallar/             # eyni pattern
│   │   └── sayt-mezmunu/               # site_content CMS
│   ├── sitemap.ts                      # 3 dil × bütün səhifələr + hreflang
│   ├── robots.ts
│   ├── globals.css
│   └── layout.tsx                      # kök layout (yalnız <html><body>)
├── components/
│   ├── three/                          # mövcud (toxunulmaz)
│   ├── motion/                         # mövcud (toxunulmaz)
│   ├── sections/                       # mövcud — data qatı çağırışları miqrasiya olunar
│   ├── layout/
│   │   ├── Header.tsx                  # YENİLƏNİR: menular mərkəzdə + dil seçici
│   │   ├── Footer.tsx                  # miqrasiya: next-intl useTranslations
│   │   ├── LanguageSwitcher.tsx        # YENİ: AZ/RU/EN dropdown
│   │   ├── StudyAbroadNav.tsx
│   │   └── WhatsAppFloat.tsx
│   ├── dashboard/                      # YENİ
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx                  # dil toggle + çıxış
│   │   ├── LanguageTabs.tsx            # 3 dilli form tab (AZ | RU | EN)
│   │   ├── DataTable.tsx               # generic sortable/searchable/paginated
│   │   ├── ContentForm.tsx             # 3 dilli form wrapper
│   │   ├── ConfirmDelete.tsx
│   │   └── FormField.tsx               # text/textarea/number/select/json-array
│   └── ui/                             # Shadcn/ui (yeni: table, dialog, tabs, dropdown-menu)
├── data/                               # mövcud seed — miqrasiya skriptinə mənbə kimi istifadə olunar
├── hooks/                              # mövcud
├── i18n/                               # YENİ
│   ├── routing.ts                      # next-intl routing config (locales, defaultLocale)
│   ├── request.ts                      # next-intl request config
│   └── messages/
│       ├── az.json                     # statik UI etiketləri
│       ├── ru.json
│       └── en.json
├── lib/
│   ├── utils.ts                        # mövcud (cn)
│   ├── seo.ts                          # mövcud — hreflang 3 dil üçün yenilənər
│   ├── supabase/                       # YENİ
│   │   ├── client.ts                   # browser client (createBrowserClient)
│   │   ├── server.ts                   # server client (createServerClient, cookies)
│   │   └── admin.ts                    # service role (yalnız seed skripti)
│   ├── data/                           # YENİ — tək data qatı
│   │   ├── countries.ts                # getCountries(locale), getCountryBySlug(slug, locale), ...
│   │   ├── universities.ts
│   │   ├── faqs.ts
│   │   ├── testimonials.ts
│   │   ├── site-content.ts
│   │   └── mappers.ts                  # mapCountryRow, mapUniversityRow (locale fallback)
│   └── validations/                    # mövcud + yeni
│       ├── contact.schema.ts           # mövcud
│       ├── country.schema.ts           # YENİ (3 dilli zod)
│       ├── university.schema.ts        # YENİ
│       ├── faq.schema.ts               # YENİ
│       ├── testimonial.schema.ts       # YENİ
│       └── site-content.schema.ts      # YENİ
└── types/
    └── index.ts                        # YENİLƏNİR: _ru sahələri əlavə, Locale tipi
scripts/
└── seed-supabase.ts                    # YENİ — src/data/*.ts → Supabase köçürmə
middleware.ts                           # YENİ — next-intl + auth guard
supabase/
└── migrations/
    └── 0001_init_multilang_cms.sql     # YENİ — tam şema + RLS + trigger
.env.local                              # YENİ — Supabase env vars
```

### İzolasiya Prinsipi (alt-layihə 1-dən qorunur)
## 7. Çoxdilli Routing (next-intl)

### 7.1 Konfiqurasiya

```typescript
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
export const locales = ["az", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "az" satisfies Locale;
export const routing = defineRouting({ locales, defaultLocale, localePrefix: "always" });
```

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) locale = routing.defaultLocale;
  return { locale, messages: (await import(`./messages/${locale}.json`)).default };
});
```

### 7.2 Middleware

`src/middleware.ts` — next-intl middleware (`createMiddleware`) `/dashboard` istisna olmaqla bütün public routeları `[locale]`-ə yönləndirər. `/dashboard/*` yalnız Supabase auth session yoxlanışı keçər (session yoxdursa `/dashboard/login`-ə).

### 7.3 Statik UI mesajları nümunə (`src/i18n/messages/az.json`)

```json
{
  "nav": { "home": "Ana Səhifə", "studyAbroad": "Xaricdə Təhsil", "calculator": "Kalkulator", "apply": "Müraciət" },
  "cta": { "chooseCountry": "Ölkə Seç", "apply": "Müraciət Et", "freeConsult": "Pulsuz Konsultasiya Al" },
  "hero": { "badge": "Xaricdə Təhsil", "titleKey": "hero_title", "subtitleKey": "hero_subtitle" },
  "faq": { "title": "Tez-tez verilən suallar" },
  "footer": { "rights": "Bütün hüquqlar qorunur" }
}
```

`ru.json` və `en.json` analoji. Hero başlığı/subtitle **dinamik** olduğu üçün `site_content` cədvəlindən gəlir — JSON'da yalnız açar (`hero_title`) saxlanır, komponent `getSiteContent("hero_title", locale)` çağırar.

### 7.4 Mövcud səhifələrin miqrasiyası

Bütün `src/app/*.tsx` public səhifələr `src/app/[locale]/` altına köçürülər. Hər səhifədə:
- `params: { locale }` əldə edilər
- data qatı funksiyalarına `locale` ötürülər: `getCountries(locale)`, `getCountryBySlug(country, locale)`
- statik mətnlər `useTranslations()` / `getTranslations()` ilə gəlir
- `generateMetadata` 3 dil üçün hreflang əlavə olunar

---

## 8. Data Qatı (Lokalizasiya Mantığı)

### 8.1 Mapper nümunəsi (fallback: RU/EN boşsa AZ)

```typescript
// src/lib/data/mappers.ts
import type { Country, Locale } from "@/types";

export function mapCountryRow(row: any, locale: Locale): Country {
  const pick = (az: string, ru?: string | null, en?: string | null) =>
    locale === "ru" ? (ru ?? az) : locale === "en" ? (en ?? az) : az;
  const pickArr = (az: any[], ru?: any[] | null, en?: any[] | null) =>
    locale === "ru" ? (ru?.length ? ru : az) : locale === "en" ? (en?.length ? en : az) : az;

  return {
    id: row.id,
    slug: row.slug,
    name_az: row.name_az,
    name_en: row.name_en ?? row.name_az,
    flag_emoji: row.flag_emoji,
    description_az: pick(row.description_az, row.description_ru, row.description_en),
    hero_image_url: row.hero_image_url,
    sort_order: row.sort_order,
    is_active: row.is_active,
    is_featured: row.is_featured,
    quick_stats: {
      universities: row.qs_universities,
      avg_tuition_usd: row.qs_avg_tuition_usd,
      language: row.qs_language,
      visa_difficulty: row.qs_visa_difficulty,
    },
    advantages: pickArr(row.advantages_az, row.advantages_ru, row.advantages_en),
    warning_banner: pick(row.warning_banner_az, row.warning_banner_ru, row.warning_banner_en) || undefined,
    documents_required: pickArr(row.documents_az, row.documents_ru, row.documents_en),
    application_steps: pickArr(row.steps_az, row.steps_ru, row.steps_en),
  };
}
```

> Qeyd: `Country` tipinə əlavə `name_ru: string` və lokalizə olunmuş `name: string` field əlavə olunar (bölmə 6 — `types` yenilənməsi). Mapper `name`-i locale'ə görə doldurur: `locale === "ru" ? (row.name_ru ?? row.name_az) : locale === "en" ? (row.name_en ?? row.name_az) : row.name_az`. `name_az`/`name_en`/`name_ru` hamı saxlanılır (alt-layihə 1 uyğunluğu üçün). UI komponentləri yalnız `country.name` (lokalizə olunmuş) istifadə edər.

### 8.2 Fetch funksiyaları (server-side, RSC)

```typescript
## 9. Admin Dashboard (CMS)

### 9.1 Layout

```
┌──────────────────────────────────────────────────────┐
│ [MegaGroup CMS]        AZ ▾ RU  EN    [Çıxış]        │  ← Topbar (dil toggle UI daxili)
├──────────┬───────────────────────────────────────────┤
│ Ana      │                                           │
│ Ölkələr  │      (seçilmiş bölmənin məzmunu)          │
│ Univers. │                                           │
│ FAQ      │                                           │
│ Testim.  │                                           │
│ Sayt     │                                           │
│ məzmunu  │                                           │
└──────────┴───────────────────────────────────────────┘
```

- **Sidebar** (`Sidebar.tsx`): nav linklər — Ana, Ölkələr, Universitetlər, FAQ, Testimoniallar, Sayt məzmunu. Mobil: collapsed/hamburger.
- **Topbar** (`Topbar.tsx`): brend + dashboard daxili dil toggle (AZ/RU/EN — form etiketləri üçün) + Çıxış düyməsi.
- **Auth guard** (`dashboard/layout.tsx`): Supabase session yoxlanışı. Session yoxdursa `/dashboard/login`-ə redirect. Mövcud istifadəçi yoxdursa login forması göstərilir.

### 9.2 CMS bölmə pattern (hər bölmə eyni)

- **Siyahı** (`page.tsx`): `DataTable` (sortable, search, pagination 20/səhifə) — Supabase'dən oxuma, hər sətiradə Redaktə/Sil düymələri.
- **Yeni** (`yeni/page.tsx`): `ContentForm` + `LanguageTabs` (AZ | RU | EN). AZ məcburi, RU/EN optional.
- **Redaktə** (`[id]/page.tsx`): eyni forma, mövcud data ilə dolu.
- **Server Actions** (`actions.ts`): `createX`, `updateX`, `deleteX` — `@supabase/ssr` server client ilə. Yazıdan sonra `revalidatePath("/[locale]/...")` — sayt dərhal yenilənər.

### 9.3 Universitetlər CMS (xüsusi)

Universitet formasında 3 alt bölmə var:
1. Əsas məlumat (ad, şəhər, slug, veb, logo, hero, highlights, notes, campus_info) — 3 dilli tab
2. Fakültələr alt-cədvəl (ad, rəqabətli, müddət, dil) — əlavə/sil dinamik, 3 dilli
3. Qiymətlər (10 ədədi field: tution/dorm/food/transport/personal min/max USD) — dilsiz

### 9.4 Validasiya (Zod, 3 dilli)

```typescript
// src/lib/validations/country.schema.ts
export const countrySchema = z.object({
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  flag_emoji: z.string().max(10).optional(),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  name_az: z.string().min(1, "Az dilində ad məcburidir"),
  name_ru: z.string().optional(),
  name_en: z.string().optional(),
  description_az: z.string().optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  advantages_az: z.array(z.string()).default([]),
  advantages_ru: z.array(z.string()).default([]),
  advantages_en: z.array(z.string()).default([]),
  // ... documents, steps, warning_banner, quick_stats
});
```

AZ sahələri məcburi (`min(1)`), RU/EN optional. Formda `LanguageTabs` AZ tab-ını məcburi kimi qeyd edər.

## 10. Header — Mərkəzi Menyu + Dil Seçici

Mövcud `Header.tsx` yenilənər — istək uyğun **menular mərkəzdə** yer alır:

```
┌──────────────────────────────────────────────────────────┐
│  MegaGroup        Ana Səhifə · Xaricdə Təhsil ·        AZ │
│  Xaricdə Təhsil   Kalkulator · Müraciət               ▾  │
│  Mərkəzi                                              RU │
│                                                       EN │
└──────────────────────────────────────────────────────────┘
```

- **Layout:** sol'da logo (2 sətir), **mərkəzdə nav linklər** (`justify-center` + nav `position: absolute` və ya grid 3 sütun), sağ'da `LanguageSwitcher` (AZ/RU/EN dropdown).
- **Nav linklər** artıq `useTranslations("nav")` ilə lokalizə olunur: `t("home")`, `t("studyAbroad")`, `t("calculator")`, `t("apply")`.
- **Linklər** `[locale]` prefiksi alır: `/{locale}`, `/{locale}/xaricde-tehsil`, və s.
- **Mobil:** hamburger menyu (mövcud pattern qorunur) + dil seçici dropdown altında.
- **LanguageSwitcher** (`LanguageSwitcher.tsx`): Shadcn DropdownMenu — cari dil işarəli, seçəndə `/{newLocale}/...`-ə keçid (`usePathname` + `useRouter` ilə locale seqmentini əvəz edər).

---

## 11. Data Migrasiyası (Seed)

`scripts/seed-supabase.ts` — bir dəfəlik köçürmə:

1. `src/data/countries.ts` → `countries` cədvəli. `_ru` sahələri ilkin olaraq AZ mətnindən kopyalanar (sonra dashboard'dan tərcümə).
2. `src/data/universities.ts` → `universities` + `faculties` + `university_fees`.
3. `src/data/faqs.ts` → `faqs`. `testimonials.ts` → `testimonials`.
4. `site_content` üçün ilkin açarlar: `hero_title`, `hero_subtitle`, `hero_badge`, `cta_choose_country`, `cta_apply`, `cta_free_consult`, `faq_title`, `footer_rights` (AZ'dan RU/EN kopyalanar).
5. İlk admin istifadəçisi yaradılar (env'dən email/parol).

Skript `supabase admin` client (service role key) istifadə edər — yalnız server tərəfdə, bir dəfəlik. `npm run seed` əmri ilə işlədilər.

---

## 12. Xəta İdarəetmə

## 13. SEO Miqrasiyası

- `generateMetadata` hər route 3 dil üçün: `title`, `description` lokalizə olunmuş, `alternates.languages` hreflang:
  ```typescript
  alternates: { languages: { az: `/az/...`, ru: `/ru/...`, en: `/en/...` } }
  ```
- `sitemap.ts` dinamik: 3 dil × (statik səhifələr + ölkələr + universitetlər).
- JSON-LD (`EducationalOrganization`, `FAQPage`) lokalizə olunmuş `name`/`description` ilə.
- `<html lang={locale}>` `[locale]/layout.tsx`-da təyin olunar.

---

## 14. Test Strategiyası

- **Vitest (unit):**
  - `mappers.ts` — fallback mantığı (`_ru` boş → AZ, `_en` boş → AZ, massiv boş → AZ massiv)
  - zod sxemaları (AZ məcburi, RU/EN optional, slug regex)
  - dil keçid yardımçı funksiyaları (locale seqment əvəzi)
- **Playwright (E2E):**
  - `/az/`, `/ru/`, `/en/` ana səhifə açılış — hero + nav görünür
  - dil keçid: AZ → RU → EN — URL və mətn dəyişir
  - menular mərkəzdə (layout assertion)
  - dashboard login axını + ölkə redaktə (yaz → revalidate → public səhifədə gör)
  - `/dashboard` qorunur (login olmadan redirect)
- **Manual:** Supabase bağlantısını kəs → public `error.tsx` göstərilir.

---

## 15. Fazalar (bu alt-layihə daxilində)

1. **Supabase qurulum** — layihə yarat, env, `migrations/0001_init_multilang_cms.sql` (şema + RLS + trigger), `@supabase/ssr` install
2. **Data qatı** — `lib/supabase/*`, `lib/data/*` + mappers, `types`-a `_ru` + `Locale`
3. **next-intl** — `i18n/routing`, `i18n/request`, `messages/{az,ru,en}.json`, `middleware.ts`
4. **Public miqrasiya** — `app/*.tsx` → `app/[locale]/*.tsx`, data qatı çağırışları, `useTranslations`, Header mərkəzi menyu + LanguageSwitcher, SEO hreflang, sitemap 3 dil
5. **Seed miqrasiyası** — `scripts/seed-supabase.ts`, `npm run seed`, məlumatların Supabase'də olduğunu doğrula
6. **Dashboard iskelet** — `dashboard/layout.tsx` (auth guard), Sidebar, Topbar, login forması
7. **CMS bölmələri** — ölkələr, universitetlər (+fakültə+qiymət), FAQ, testimoniallar, sayt məzmunu; hər biri siyahı + yeni + redaktə + server actions + zod
8. **Test** — Vitest mapper/zod, Playwright 3 dil + dashboard axını
9. **Doğrulama** — `npm run dev` tam işləyir, 3 dil açılır, dashboard'dan redaktə → public səhifə yenilənir

---

## 16. Uğur Kriteriyaları

- [ ] Supabase layihə qurulu, env təyin olunub, şema + RLS işləyir
- [ ] Seed skripti mövcud dataları Supabase'ə köçürüb (5 ölkə, universitetlər, FAQ, testimoniallar, site_content)
- [ ] `/az/`, `/ru/`, `/en/` — üç dildə sayt tam açılır, məzmun lokalizə olunur
- [ ] Dil keçid UI işləyir (Header AZ/RU/EN), URL locale seqmentini dəyişir
- [ ] Ana səhifədə menular mərkəzdə yer alır
- [ ] Header/Footer statik mətnləri next-intl mesajlarından gəlir; dinamik məzmun Supabase'dən
- [ ] `/dashboard/login` — email/parol ilə daxil olur
- [ ] `/dashboard/*` — auth qorunur (login olmadan redirect)
- [ ] Ölkələr CMS: siyahı + yarat + redaktə (3 dilli tab) + sil işləyir
- [ ] Universitetlər CMS: əsas + fakültə + qiymət alt-formları işləyir
- [ ] FAQ, Testimonial, Sayt məzmunu CMS işləyir
- [ ] Dashboard'da redaktə → `revalidatePath` → public səhifə dərhal yenilənir
- [ ] RLS: anon oxuya bilir, yalnız authenticated yazıla bilir
- [ ] SEO: hər route 3 dil hreflang, sitemap 3 dil, JSON-LD lokalizə
- [ ] Vitest (mapper fallback + zod) + Playwright (3 dil + dashboard axını) keçir
- [ ] Mövcud vizual effektlər (3D hero, glassmorphism, smooth scroll) toxunulmaz qalır

---

## 17. Qeydlər və Fərziyyələr

- **Fərziyyə:** Supabase layihə (URL + anon key + service role key) istifadəçi tərəfindən təmin ediləcək / yaradılacaq. Spec Supabase qurulu sayılır, amma env dəyərləri implementasiya zamanı tələb olunur.
- **Fərziyyə:** `_ru` tərcümələri ilkin mərhələdə AZ'dan kopyalanır; sonradan dashboard'dan real tərcümə daxil edilir. Bu, saytın RU/EN-də dərhal işləməsini təmin edir (AZ mətni göstərilir, boş səhifə yox).
- **Fərziyyə:** Bu mərhələdə yalnız 1 admin istifadəçi var (rol sistemi yoxdur). Çoxlu admin/rol sonrakı alt-layihəyə.
- **Məhdudiyyət:** Müraciətlər/leads CRM bu spec'də yoxdur — `muraciet` forması göndərmə funksiyası placeholder olaraq qalır (alt-layihə 1-dəki kimi), yalnız UI tərəfi 3 dilli olur.
- **Məhdudiyyət:** Dashboard dili (AZ/RU/EN toggle) yalnız dashboard UI etiketləri üçündür; data redaktə hər zaman 3 dilli tab-larda (AZ məcburi + RU/EN optional) aparılır.
- **Brend:** `xaricdetehsil.md`-dəki "XaricTəhsil.az" istinadları alt-layihə 1-də olduğu kimi "MegaGroup" brendinə əvəz olunur.

---

*Bu spec `xaricdetehsil.md` (v1.1.0) bölmə 4 (i18n), 5 (DB şema), 9 (Admin Dashboard) əsasında və `2026-07-02-megagroup-study-abroad-visual-site-design.md` (alt-layihə 1) üzərinə qurularaq hazırlanmışdır. Sonrakı alt-layihə (leads CRM + realtime + email) ayrıca spec alacaq.*
| Ssenari | Davranış |
|---|---|
| Supabase bağlantı xətası (public) | Mövcud `error.tsx` (glassmorphism 500) göstərilir |
| Supabase bağlantı xətası (dashboard) | Toast mesaj + forma saxlanılır |
| Auth uğursuz / session yoxdur | `/dashboard/login`-ə redirect |
| Login uğursuz (yanlış parol) | Login formasında xəta mesajı |
| Zod validasiya xətası | Form səviyyəsində sahə xətaları (mövcud pattern) |
| RLS rədd (icazə yoxdur) | Dashboard'da "İcazə yoxdur" mesajı |
| Slug konflikt (unique) | Form xətası: "Bu slug artıq istifadə olunur" |
| Silinən ölkəyə bağlı universitet | `ON DELETE CASCADE` avtomatik silər (faq/testimonial `SET NULL`) |

---

### 9.5 Komponent siyahısı (`src/components/dashboard/`)

| Komponent | Məsuliyyət | Asılılıq |
|---|---|---|
| `Sidebar.tsx` | Nav linkləri render, active state | next-intl (dashboard dili) |
| `Topbar.tsx` | Brend + dil toggle + çıxış | Supabase auth (signOut) |
| `LanguageTabs.tsx` | 3 dilli tab (AZ/RU/EN), AZ məcburi işarəsi | Shadcn Tabs |
| `DataTable.tsx` | Generic sortable/searchable/paginated cədvəl | Shadcn Table |
| `ContentForm.tsx` | react-hook-form wrapper + LanguageTabs | zod resolver |
| `ConfirmDelete.tsx` | Silmə təsdiq dialoqu | Shadcn Dialog |
| `FormField.tsx` | text/textarea/number/select/json-array input | react-hook-form |

---

// src/lib/data/countries.ts
import { createClient } from "@/lib/supabase/server";
import { mapCountryRow } from "./mappers";
import type { Country, Locale } from "@/types";

export async function getCountries(locale: Locale): Promise<Country[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("countries").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((row) => mapCountryRow(row, locale));
}

export async function getCountryBySlug(slug: string, locale: Locale): Promise<Country | null> {
  const supabase = createClient();
  const { data } = await supabase.from("countries").select("*").eq("slug", slug).single();
  return data ? mapCountryRow(data, locale) : null;
}
```

`universities.ts`, `faqs.ts`, `testimonials.ts`, `site-content.ts` analoji pattern. Hər biri `map*Row(row, locale)` çağırar.

---


Hər komponentin tək məsuliyyəti qorunur. `Sidebar` yalnız naviqasiya, `LanguageTabs` yalnız 3 dilli tab render, `DataTable` yalnız cədvəl göstər. Data `src/lib/data/`-dan prop kimi gəlir — komponent Supabase'i görməz. Mapper funksiyaları (`mapCountryRow`) locale fallback mantığını tək yerdə cəmləyir, bütün komponentlər lokalizə olunmuş tip alır.

---

```

### 5.3 Auth

- Supabase Auth email/parol. İlk admin istifadəçisi seed skripti ilə yaradılar (`scripts/seed-supabase.ts`).
- Session Supabase cookies-də saxlanılar (`@supabase/ssr`).
- Environment: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (yalnız seed üçün, server tərəfdə).

### 5.4 `updated_at` avtomatik yeniləmə

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- (universities üçün də eyni)
```

---

                │
         ┌──────┴───────┐
         │  Supabase    │  Postgres + Auth + RLS
         │  Tables:     │  countries, universities, faculties,
         │              │  university_fees, faqs, testimonials,
         │              │  site_content
         └──────────────┘
```

### Mərkəzi Prinsiplər

- **Tək data qatı** (`src/lib/data/`): bütün fetch funksiyaları burada — `getCountries(locale)`, `getUniversityBySlug(slug, locale)` və s. Komponentlər Supabase'i birbaşa import etməz. Bu, növbəti alt-layihələrdə (leads, blog) dəyişikliyi asanlaşdırar.
- **Çoxdilli şema:** hər məzmun cədvəlində `_az`, `_ru`, `_en` sütunları. AZ məcburi (`NOT NULL`), RU/EN optional (fallback AZ'ya).
- **Lokalizasiya data qatında cəmlənər:** `mapCountryRow(row, locale)` kimi mapper funksiyaları row → lokalizə olunmuş tipə çevirər. Komponentlər hər zaman `country.name` (lokalizə olunmuş) alar, `_az/_ru` mantığını görməz.
- **İkiqat məzmun qatı:** statik UI etiketləri (nav, düymələr, form label) → next-intl JSON mesajları; dinamik məzmun (ölkə adları, FAQ, hero) → Supabase. Bu ayrılıq vacibdir.
- **İzolasiya:** hər komponentin tək məsuliyyəti. `Sidebar` yalnız naviqasiya, `LanguageTabs` yalnız 3 dilli tab, `DataTable` yalnız cədvəl render. Data prop kimi gəlir.

---

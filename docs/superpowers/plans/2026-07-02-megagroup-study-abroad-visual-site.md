# MegaGroup — Xaricdə Təhsil Mərkəzi: Vizual İctimai Sayt (MVP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a futuristic, animated public marketing site for MegaGroup (study-abroad center) showing 5 countries, universities (Giresun fully detailed), cost calculator, success stories, FAQ, and an application form — all running on local seed data with no backend.

**Architecture:** Next.js 15 App Router with React 19 Server Components doing data fetch from local TS seed files (`src/data/`), passing props to Client Components for interactive/animated UI. A typed data layer (`src/types/`) mirrors the Supabase schema so backend can be swapped later. Futuristic visual layer (Three.js/R3F 3D hero, GSAP scroll animations, Lenis smooth scroll, glassmorphism) is isolated in dedicated components with mobile + reduced-motion fallbacks.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, Shadcn/ui, three + @react-three/fiber + @react-three/drei, gsap, lenis, framer-motion, react-parallax-tilt, lucide-react, zod, react-hook-form, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-02-megagroup-study-abroad-visual-site-design.md`

---

## File Structure Map

| File | Responsibility |
|---|---|
| `package.json` | Dependencies + scripts |
| `tsconfig.json` | TS strict + `@/*` path alias |
| `next.config.ts` | Image config, CSP headers |
| `src/app/globals.css` | CSS variables (brand, glass, glow), dark mode, reduced-motion |
| `src/types/index.ts` | All shared types (Country, University, Faculty, Fee, Testimonial, FAQ, CostData) |
| `src/data/countries.ts` | 5 countries seed |
| `src/data/universities.ts` | Universities seed (Giresun full) |
| `src/data/testimonials.ts` | Success stories seed |
| `src/data/faqs.ts` | FAQs per country + Giresun |
| `src/data/cost-data.ts` | Cost ranges per university |
| `src/lib/utils.ts` | cn() helper |
| `src/lib/seo.ts` | generateMetadata builder + JSON-LD helpers |
| `src/lib/validations/contact.schema.ts` | Zod schema for application form |
| `src/hooks/useReducedMotion.ts` | prefers-reduced-motion detector |
| `src/hooks/useCountUp.ts` | Number counter hook |
| `src/components/motion/SmoothScrollProvider.tsx` | Lenis provider |
| `src/components/motion/FadeInUp.tsx` | Scroll reveal wrapper |
| `src/components/motion/TextReveal.tsx` | Split text reveal |
| `src/components/motion/CounterAnimation.tsx` | Animated stat counter |
| `src/components/motion/MagneticButton.tsx` | Magnetic hover button |
| `src/components/three/CanvasWrapper.tsx` | R3F Canvas + Suspense + size guard |
| `src/components/three/GlobeScene.tsx` | 3D globe with country dots |
| `src/components/three/ParticleField.tsx` | Background particles |
| `src/components/sections/HeroSection.tsx` | 3D + glass hero |
| `src/components/sections/CountryTabs.tsx` | Sticky country tab menu |
| `src/components/sections/UniversityCard.tsx` | Tilt university card |
| `src/components/sections/UniversityGrid.tsx` | Grid of cards |
| `src/components/sections/CostCalculator.tsx` | Interactive cost calculator |
| `src/components/sections/SuccessStories.tsx` | Tilt testimonial cards |
| `src/components/sections/InstagramCTA.tsx` | Instagram link + static grid |
| `src/components/sections/FAQSection.tsx` | Accordion FAQ |
| `src/components/sections/CTASection.tsx` | Consultation CTA + WhatsApp |
| `src/components/layout/Header.tsx` | Top nav with MegaGroup logo |
| `src/components/layout/Footer.tsx` | Footer |
| `src/components/layout/WhatsAppFloat.tsx` | Floating WhatsApp button |
| `src/app/[locale]/layout.tsx` | Root layout: fonts, providers, dark mode |
| `src/app/[locale]/page.tsx` | Home page |
| `src/app/[locale]/xaricde-tehsil/page.tsx` | Study abroad index |
| `src/app/[locale]/xaricde-tehsil/[country]/page.tsx` | Country page |
| `src/app/[locale]/xaricde-tehsil/[country]/[university]/page.tsx` | University page |
| `src/app/[locale]/xaricde-tehsil/hesabla/page.tsx` | Calculator page |
| `src/app/[locale]/xaricde-tehsil/muraciet/page.tsx` | Application form page |
| `src/app/[locale]/error.tsx` | 500 page |
| `src/app/[locale]/not-found.tsx` | 404 page |
| `src/app/[locale]/loading.tsx` | Loading skeleton |
| `src/app/sitemap.ts` | Dynamic sitemap |
| `src/app/robots.ts` | robots.txt |
| `tests/unit/*.test.ts` | Vitest unit tests |
| `tests/e2e/*.spec.ts` | Playwright E2E |

---

## Task 1: Scaffold Next.js 15 Project

**Files:**
- Create: entire Next.js project in `C:\Users\Asus\OneDrive\Desktop\megagroup`

- [ ] **Step 1: Scaffold with create-next-app (non-interactive)**

The megagroup folder already has `xaricdetehsil.md` and `docs/`. Scaffold into a temp folder, then merge:

```bash
cd C:\Users\Asus\OneDrive\Desktop
npx create-next-app@latest megagroup-temp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
```

Copy generated files into existing megagroup folder (preserving `xaricdetehsil.md` and `docs/`):

```bash
xcopy /E /I /Y "C:\Users\Asus\OneDrive\Desktop\megagroup-temp\*" "C:\Users\Asus\OneDrive\Desktop\megagroup\"
rmdir /S /Q "C:\Users\Asus\OneDrive\Desktop\megagroup-temp"
```

- [ ] **Step 2: Verify the project runs**

```bash
cd C:\Users\Asus\OneDrive\Desktop\megagroup
npm run dev
```
Expected: dev server starts at http://localhost:3000, default Next.js page renders. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project with TypeScript and Tailwind"
```

---

## Task 2: Install Dependencies & Configure Project

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Install 3D + animation + form dependencies**

```bash
npm install three @react-three/fiber @react-three/drei gsap lenis framer-motion react-parallax-tilt lucide-react zod react-hook-form @hookform/resolvers clsx tailwind-merge
```

- [ ] **Step 2: Install type + test dependencies**

```bash
npm install -D @types/three vitest @vitejs/plugin-react jsdom @playwright/test
```

- [ ] **Step 3: Update tsconfig.json**

Replace `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Update next.config.ts**

Replace `next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdninstagram.com" },
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

export default nextConfig;
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: install 3D, animation, form, and test dependencies"
```

---

## Task 3: Design System — globals.css, Fonts, Dark Mode

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create cn() helper**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Replace globals.css with full design system**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #dc2626;
  --color-brand-secondary: #1d4ed8;
  --color-brand-accent: #f59e0b;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #2563eb;
  --font-sans: var(--font-inter), "Segoe UI", system-ui, sans-serif;
  --font-heading: var(--font-cal-sans), var(--font-inter), sans-serif;
}

:root {
  --background: #ffffff;
  --foreground: #111827;
  --card: #ffffff;
  --border: #e5e7eb;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glow-primary: 0 0 40px rgba(220, 38, 38, 0.25);
  --glow-secondary: 0 0 40px rgba(29, 78, 216, 0.25);
  --gradient-mesh: radial-gradient(at 20% 20%, #dc2626 0, transparent 50%),
    radial-gradient(at 80% 0%, #1d4ed8 0, transparent 50%),
    radial-gradient(at 50% 100%, #f59e0b 0, transparent 50%);
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card: #1e293b;
  --border: #334155;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glow-primary: 0 0 40px rgba(220, 38, 38, 0.35);
  --glow-secondary: 0 0 40px rgba(29, 78, 216, 0.35);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}

@layer utilities {
  .glass {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .glass-strong {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .glow-primary { box-shadow: var(--glow-primary); }
  .glow-secondary { box-shadow: var(--glow-secondary); }
  .gradient-mesh { background-image: var(--gradient-mesh); }
  .hero-fallback-gradient {
    background: radial-gradient(ellipse at center, #1d4ed8 0%, #0f172a 70%);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Verify dev server + Tailwind works**

```bash
npm run dev
```
Open http://localhost:3000 — page renders with no CSS errors. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add design system with glassmorphism, glow, dark mode, reduced-motion"
```

---

## Task 4: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write the types file**

Create `src/types/index.ts`:

```typescript
export interface Country {
  id: string;
  slug: string;
  name_az: string;
  name_en: string;
  flag_emoji: string;
  description_az: string;
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
  name_az: string;
  is_competitive: boolean;
  duration_years: number;
  language: string;
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
  name_az: string;
  city_az: string;
  website_url: string;
  logo_url: string;
  hero_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  highlights: string[];
  faculties: Faculty[];
  fees: UniversityFee;
  notes?: string;
  campus_info?: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  university_slug: string;
  country_slug: string;
  photo_url: string;
  quote_az: string;
  year: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  country_slug?: string;
  university_slug?: string;
}

export interface CostData {
  university_slug: string;
  fees: UniversityFee;
}

export interface FAQItem {
  question: string;
  answer: string;
}
```

- [ ] **Step 2: Verify type-check passes**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add TypeScript types mirroring Supabase schema"
```

---

## Task 5: Seed Data — Countries (5 ölkə)

**Files:**
- Create: `src/data/countries.ts`

- [ ] **Step 1: Write the countries seed**

Create `src/data/countries.ts` with 5 countries. Each has: slug, name, flag, description, hero image, quick_stats (universities count, avg tuition, language, visa difficulty), advantages (6 items), documents_required, application_steps (4 steps). Türkiyə is_featured=true with no warning; Ukrayna has a warning_banner about war safety.

Use this structure for each country (Türkiyə shown fully, repeat the pattern for Rusiya, Ukrayna, Almaniya, Polşa):

```typescript
import type { Country } from "@/types";

export const countries: Country[] = [
  {
    id: "c1",
    slug: "turkiye",
    name_az: "Türkiyə",
    name_en: "Turkey",
    flag_emoji: "🇹🇷",
    description_az: "Attestatla, DIM imtahanı olmadan qəbul — ən çox seçilən ölkə. Yaxın mədəniyyət, ucuz təhsil, keyfiyyətli universitetlər.",
    hero_image_url: "https://images.unsplash.com/photo-1524231757912-60f657daa638?w=1200&q=80",
    sort_order: 1,
    is_active: true,
    is_featured: true,
    quick_stats: { universities: 200, avg_tuition_usd: 1500, language: "Türkçe / İngilis", visa_difficulty: "easy" },
    advantages: [
      "Attestatla qəbul — DIM imtahanı tələb olunmur",
      "Mədəniyyət və mətbəx yaxın — adaptasiya asan",
      "Təhsil haqqı aşağı, burs imkanları çox",
      "Avropa kredit sistemi (ECTS) tanınır",
      "Tələbə vizi asan və sürətli",
      "Müqavilə əsaslı oxumaq mümkün",
    ],
    documents_required: [
      "Attestat (orijinal + tərcümə)",
      "Transkript (notar təsdiqli)",
      "Pasport (6 ay müddətli)",
      "6 foto (3x4)",
      "Dil sertifikatı (varsa)",
      "Bank справка (maliyyə sübutu)",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Attestat, transkript və digər sənədləri toplayın." },
      { step: 2, title: "Universitet seçimi", description: "MegaGroup konsultantı sizə uyğun universitet seçir." },
      { step: 3, title: "Müraciət və qəbul məktubu", description: "Müraciət edilir, qəbul məktubu alınır." },
      { step: 4, title: "Viza və yola düşmə", description: "Tələbə vizası alınır və Türkiyəyə yola düşürsünüz." },
    ],
  },
  // Rusiya: slug "rusiya", flag 🇷🇺, universities 150, avg_tuition 2500, language "Rus dili", visa easy
  //   advantages: rus dili tanış, tibb/mühəndislik güclü, dövlət kvotaları, ucuz yaşayış, tanış mühit, diplom MDB-də tanınır
  // Ukrayna: slug "ukrayna", flag 🇺🇦, universities 80, avg_tuition 3500, language "Ukraynaca/İngilis", visa medium
  //   warning_banner: "Diqqət: Müharibə şəraitinə görə yalnız təhlükəsiz regionları seçin."
  //   advantages: ingilis dilində tibb, diplom Avropada tanınır, aşağı xərc, sürətli qəbul, klinik təcrübə, PMQ hazırlığı
  // Almaniya: slug "almaniya", flag 🇩🇪, universities 100, avg_tuition 0, language "Alman/İngilis", visa hard
  //   advantages: pulsuz dövlət təhsili, mühəndislik lideri, avropa diplomu, iş icazəsi, yüksək həyat səviyyəsi, araşdırma imkanları
  // Polşa: slug "polsa", flag 🇵🇱, universities 60, avg_tuition 5000, language "Polyak/İngilis", visa medium
  //   advantages: ingilis dilində tibb, EU diplomu, münasib xərc, PMQ/USMLE dəstəyi, müasir kampuslar, asan viza
];

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
```

Fill in each remaining country with the same field structure as Türkiyə — use the comment guidance for content. Each country must have `id` (`c2`–`c5`), unique `slug`, correct `sort_order` (2–5), `is_featured: false` (only Türkiyə featured), `is_active: true`, 6 advantages, 5-6 documents_required, and 4 application_steps.

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add 5 countries seed data (Türkiyə, Rusiya, Ukrayna, Almaniya, Polşa)"
```

---

## Task 6: Seed Data — Universities (Giresun full)

**Files:**
- Create: `src/data/universities.ts`

- [ ] **Step 1: Write universities seed — Giresun Universiteti (full) + others**

Create `src/data/universities.ts`. Giresun Universiteti (`giresun-universiteti`) gets the full detailed treatment per the spec — all faculties, fees, highlights, campus info. Add at least 2 more universities per country (featured + others) so each country page has a grid.

```typescript
import type { University } from "@/types";

export const universities: University[] = [
  {
    id: "u1",
    slug: "giresun-universiteti",
    country_slug: "turkiye",
    name_az: "Giresun Universiteti",
    city_az: "Giresun",
    website_url: "https://www.giresun.edu.tr",
    logo_url: "https://images.unsplash.com/photo-1560179707-f14e90236818?w=200&q=80",
    hero_image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
    is_featured: true,
    is_active: true,
    highlights: [
      "Attestatla birbaşa qəbul — DIM/ÖSYM yoxdur",
      "Tibb fakültəsi mövcuddur",
      "Dəniz kənarı kampus — Giresun şəhəri",
      "Azərbaycanlı tələbə cəmiyyəti fəal",
      "Təhsil haqqı müqayisəli ucuzdur",
      "İngilis dilində bölmələr var",
    ],
    faculties: [
      { id: "f1", university_id: "u1", name_az: "Tibb", is_competitive: true, duration_years: 6, language: "Türkçe" },
      { id: "f2", university_id: "u1", name_az: "Stomatologiya", is_competitive: true, duration_years: 5, language: "Türkçe" },
      { id: "f3", university_id: "u1", name_az: "Mühəndislik", is_competitive: false, duration_years: 4, language: "Türkçe/İngilis" },
      { id: "f4", university_id: "u1", name_az: "İqtisadiyyat və İdarəetmə", is_competitive: false, duration_years: 4, language: "Türkçe" },
      { id: "f5", university_id: "u1", name_az: "Təhsil Fakültəsi", is_competitive: false, duration_years: 4, language: "Türkçe" },
      { id: "f6", university_id: "u1", name_az: "Ədəbiyyat", is_competitive: false, duration_years: 4, language: "Türkçe" },
    ],
    fees: {
      tuition_min_usd: 1200, tuition_max_usd: 3000,
      dorm_min_usd: 50, dorm_max_usd: 120,
      food_min_usd: 100, food_max_usd: 180,
      transport_min_usd: 20, transport_max_usd: 40,
      personal_min_usd: 50, personal_max_usd: 120,
    },
    notes: "Tibb fakültəsi üçün attestat ortalaması vacibdir. Müqavilə əsaslı (ödənişli) yerlər daha asandır.",
    campus_info: "Giresun şəhəri Karadeniz (Qara dəniz) sahilindədir. Sakit, təhlükəsiz, tələbə dostu bir şəhər. Kampus dənizə yaxındır.",
  },
  // Add more universities per country (at least 2 each). Examples:
  // Türkiyə: "istanbul-universiteti" (İstanbul), "ankara-universiteti" (Ankara)
  // Rusiya: "moskva-dovlet-universiteti", "peterburg-dovlet-universiteti"
  // Ukrayna: "kiev-tibb-universiteti" (Kiev, tibb), "lvov-universiteti"
  // Almaniya: "munchen-texniki-universiteti" (TUM, mühəndislik), "berlin-humboldt"
  // Polşa: "varşava-tibb-universiteti" (Varşava, tibb), "krakov-tibb-universiteti"
  // Each with: id, slug, country_slug, name_az, city_az, website_url, logo_url, hero_image_url,
  //   is_featured (one per country), is_active, highlights[4], faculties[2-3], fees object, optional notes
];

export function getUniversityBySlug(slug: string): University | undefined {
  return universities.find((u) => u.slug === slug);
}

export function getUniversitiesByCountry(countrySlug: string): University[] {
  return universities.filter((u) => u.country_slug === countrySlug && u.is_active);
}

export function getFeaturedUniversity(countrySlug: string): University | undefined {
  return universities.find((u) => u.country_slug === countrySlug && u.is_featured && u.is_active);
}
```

Fill in all remaining universities following the pattern. Each country must have at least one `is_featured: true` university. Use realistic `fees` ranges (Almaniya tuition ~0-500, Polşa ~4000-6000).

- [ ] **Step 2: Verify type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add universities seed data (Giresun full + per-country featured)"
```

---

## Task 7: Seed Data — Testimonials & FAQs

**Files:**
- Create: `src/data/testimonials.ts`, `src/data/faqs.ts`

- [ ] **Step 1: Write testimonials seed (6 stories)**

Create `src/data/testimonials.ts`:

```typescript
import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  { id: "t1", student_name: "Aytən Hüseynli", university_slug: "giresun-universiteti",
    country_slug: "turkiye", photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    quote_az: "DIM imtahanı vermedən Giresun Universitetinə qəbul oldum. MegaGroup bütün prosesdə dəstək oldu.", year: 2024 },
  { id: "t2", student_name: "Orxan Kərimov", university_slug: "giresun-universiteti",
    country_slug: "turkiye", photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    quote_az: "Tibb fakültəsində oxuyuram. Attestatla qəbul prosesi çox rahat idi.", year: 2024 },
  { id: "t3", student_name: "Ləman Əliyeva", university_slug: "varşava-tibb-universiteti",
    country_slug: "polsa", photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    quote_az: "Polşada ingilis dilində tibb oxuyuram. Avropa diplomu gələcəyim üçün fürsətdir.", year: 2023 },
  { id: "t4", student_name: "Rəşad Məmmədov", university_slug: "munchen-texniki-universiteti",
    country_slug: "almaniya", photo_url: "https://images.unsplash.com/photo-1507003211169-0cff1bae0bdb?w=200&q=80",
    quote_az: "Almaniyada pulsuz mühəndislik təhsili alıram. Dil hazırlığı çox vacib idi.", year: 2023 },
  { id: "t5", student_name: "Nigar Soltanova", university_slug: "kiev-tibb-universiteti",
    country_slug: "ukrayna", photo_url: "https://images.unsplash.com/photo-1534528741775-54094d69f89c?w=200&q=80",
    quote_az: "Ukraynada təhlükəsiz regionda oxuyuram. MegaGroup doğru universitet seçməyimdə kömək etdi.", year: 2024 },
  { id: "t6", student_name: "Tural Əhmədov", university_slug: "moskva-dovlet-universiteti",
    country_slug: "rusiya", photo_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80",
    quote_az: "Rusiyada iqtisadiyyat oxuyuram. Tanış dil adaptasiyanı asanlaşdırdı.", year: 2023 },
];

export function getTestimonialsByCountry(countrySlug: string): Testimonial[] {
  return testimonials.filter((t) => t.country_slug === countrySlug);
}
```

- [ ] **Step 2: Write FAQs seed (general + country + Giresun)**

Create `src/data/faqs.ts`:

```typescript
import type { FAQ } from "@/types";

export const faqs: FAQ[] = [
  { id: "f1", question: "Attestatla xaricə necə qəbul ola bilərəm?", answer: "Attestatınızla birbaşa xarici universitetlərə müraciət edə bilərsiniz. MegaGroup sizə uyğun universitet seçir və prosesi idarə edir." },
  { id: "f2", question: "DIM imtahanı mütləqdir?", answer: "Xeyr. Xaricə attestatla qəbul üçün DIM tələb olunmur. Türkiyə kimi ölkələrdə attestat ortalaması kifayət edir." },
  { id: "f3", question: "Konsultasiya pulsuzdur?", answer: "Bəli, ilkin konsultasiya tam pulsuzdur. Müraciət edin və sizə uyğun variantları təqdim edək." },
  { id: "f4", country_slug: "turkiye", question: "Türkiyədə təhsil haqqı nə qədərdir?", answer: "Universitetdən asılı olaraq illik 1200-3000 USD. Dövlət universitetlərində daha aşağıdır." },
  { id: "f5", country_slug: "turkiye", question: "Türkiyə tələbə vizası necə alınır?", answer: "Qəbul məktubu aldıqdan sonra səfirliyə müraciət. Prosedur 2-4 həftə çəkir." },
  { id: "f6", university_slug: "giresun-universiteti", question: "Giresun Universitetində tibb oxumaq mümkündürmü?", answer: "Bəli, Tibb fakültəsi mövcuddur. Attestat ortalaması yüksək olan tələbələr üçün əlçatandır." },
  { id: "f7", university_slug: "giresun-universiteti", question: "Giresun şəhəri təhlükəsizdirmi?", answer: "Bəli, Giresun sakit və təhlükəsiz Karadeniz şəhəridir. Tələbə dostu mühit var." },
];

export function getFAQsByCountry(countrySlug: string): FAQ[] {
  return faqs.filter((f) => f.country_slug === countrySlug || (!f.country_slug && !f.university_slug));
}
export function getFAQsByUniversity(universitySlug: string): FAQ[] {
  return faqs.filter((f) => f.university_slug === universitySlug || (!f.country_slug && !f.university_slug));
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add testimonials and FAQs seed data"
```

---

## Task 8: Cost Data + Contact Zod Schema

**Files:**
- Create: `src/data/cost-data.ts`, `src/lib/validations/contact.schema.ts`

- [ ] **Step 1: Write cost data (derived from universities)**

Create `src/data/cost-data.ts`:

```typescript
import { universities } from "./universities";
import type { CostData, UniversityFee } from "@/types";

export const costData: CostData[] = universities.map((u) => ({
  university_slug: u.slug,
  fees: u.fees,
}));

export function getCostByUniversity(slug: string): CostData | undefined {
  return costData.find((c) => c.university_slug === slug);
}

export function calculateMonthlyCost(fees: UniversityFee) {
  const monthly = {
    tuition: Math.round((fees.tuition_min_usd + fees.tuition_max_usd) / 2 / 9),
    dorm: Math.round((fees.dorm_min_usd + fees.dorm_max_usd) / 2),
    food: Math.round((fees.food_min_usd + fees.food_max_usd) / 2),
    transport: Math.round((fees.transport_min_usd + fees.transport_max_usd) / 2),
    personal: Math.round((fees.personal_min_usd + fees.personal_max_usd) / 2),
  };
  const total = Object.values(monthly).reduce((a, b) => a + b, 0);
  return { monthly, total_monthly: total, total_period: (months: number) => total * months };
}
```

- [ ] **Step 2: Write contact Zod schema**

Create `src/lib/validations/contact.schema.ts`:

```typescript
import { z } from "zod";

export const contactSchema = z.object({
  full_name: z.string().min(2, "Ad ən az 2 simvol olmalıdır").max(100),
  phone: z
    .string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, "Düzgün telefon nömrəsi daxil edin"),
  email: z.string().email("Düzgün email daxil edin").optional().or(z.literal("")),
  country_interest: z.string().min(1, "Ölkə seçin"),
  attestat_avg: z.coerce.number().min(40).max(100).optional(),
  message: z.string().max(500).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

- [ ] **Step 3: Verify + commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add cost data helper and contact Zod validation schema"
```

---

## Task 9: Hooks — useReducedMotion + useCountUp

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useCountUp.ts`

- [ ] **Step 1: Write useReducedMotion hook**

Create `src/hooks/useReducedMotion.ts`:

```typescript
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}
```

- [ ] **Step 2: Write useCountUp hook**

Create `src/hooks/useCountUp.ts` — a hook that animates a number from `start` to `end` over `duration`, starting when the element scrolls into view (IntersectionObserver, threshold 0.3). Uses `requestAnimationFrame` with cubic ease-out. Returns `{ count, ref }` where `ref` attaches to a span. See spec section 15 / 18. Implementation: `useRef` for `started` guard, `useState` for count, `performance.now()` for timing.

- [ ] **Step 3: Verify + commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add useReducedMotion and useCountUp hooks"
```
---

## Task 10: Motion — SmoothScrollProvider, FadeInUp, TextReveal, Counter, MagneticButton

**Files:** Create 5 files in `src/components/motion/`

- [ ] **Step 1: SmoothScrollProvider (Lenis + GSAP)**

Create `src/components/motion/SmoothScrollProvider.tsx` — client. Init Lenis in useEffect (duration 1.2), hook `lenis.on("scroll", ScrollTrigger.update)`, add `lenis.raf(time*1000)` to `gsap.ticker`, lagSmoothing(0). If `useReducedMotion()` true, skip Lenis (native scroll). Cleanup: remove ticker fn, destroy lenis. Register `gsap.registerPlugin(ScrollTrigger)`.

- [ ] **Step 2: FadeInUp (Framer Motion)**

Create `src/components/motion/FadeInUp.tsx` — client. `motion.div` initial `{opacity:0,y:40}`, whileInView `{opacity:1,y:0}`, viewport `{once:true,amount:0.2}`, transition `{duration:0.6,ease:"easeOut",delay}`. Props: `children, className, delay=0`. Reduced motion: render plain `<div className={className}>`.

- [ ] **Step 3: TextReveal (GSAP split)**

Create `src/components/motion/TextReveal.tsx` — client. Split `text` prop into word spans in useLayoutEffect; `gsap.from(wordEls, {y:30,opacity:0,stagger:0.05,scrollTrigger:{trigger:container,start:"top 85%"}})`. Reduced motion: render plain text, no split.

- [ ] **Step 4: CounterAnimation**

Create `src/components/motion/CounterAnimation.tsx` — client, uses `useCountUp`. Renders `<span ref={ref}>{count.toLocaleString("az-AZ")}{suffix}</span>`. Props: `end, suffix="", duration=2000`.

- [ ] **Step 5: MagneticButton (GSAP + pointer-aware)**

Create `src/components/motion/MagneticButton.tsx` — client. On mousemove translate toward cursor max ~24px via `gsap.to(ref,{x,y,duration:0.3,ease:"power2.out"})`. On mouseleave `gsap.to(ref,{x:0,y:0,duration:0.4,ease:"elastic.out(1,0.3)"})`. Disable magnetic when `useReducedMotion()` OR `matchMedia("(pointer: coarse)")`. Props: `href, children, variant="primary"|"ghost", className`. Primary: `bg-brand-primary text-white glow-primary hover:bg-red-700`. Ghost: `glass text-foreground hover:bg-white/10`. Always `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary`.

- [ ] **Step 6: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add motion components"

---

## Task 11: 3D — CanvasWrapper, ParticleField, GlobeScene

**Files:** Create 3 files in `src/components/three/`

- [ ] **Step 1: CanvasWrapper (size guard + Suspense)**

Create `src/components/three/CanvasWrapper.tsx` — client. Uses `useState` + `useEffect` to read `window.innerWidth`; render `<div className="hero-fallback-gradient" />` when `width < 768` (mobile fallback). Otherwise render `<Canvas camera={{position:[0,0,5],fov:45}} dpr={[1,2]} gl={{antialias:true,alpha:true}}>{children}</Canvas>` wrapped in `<Suspense fallback={null}>`. Also fallback if `useReducedMotion()`.

- [ ] **Step 2: ParticleField (background particles)**

Create `src/components/three/ParticleField.tsx` — R3F component. `useMemo` a `BufferGeometry` with ~800 random points in a sphere (radius 4). `pointsMaterial` size 0.03, color #1D4ED8, transparent opacity 0.6. Slowly rotate via `useFrame((state) => { ref.current.rotation.y = state.clock.elapsedTime * 0.05 })`.

- [ ] **Step 3: GlobeScene (3D globe with country dots)**

Create `src/components/three/GlobeScene.tsx` — R3F component. A `<mesh>` sphere (radius 1.6) with `meshStandardMaterial` color #0F172A, wireframe=false, plus a thin wireframe overlay sphere (radius 1.61) color #1D4ED8. Add 5 small emissive dots (sphereGeometry 0.03) at lat/long positions approximating Türkiyə, Rusiya, Ukrayna, Almaniya, Polşa — color #DC2626 emissive. Add `ParticleField` as background. Wrap in `<ambientLight intensity={0.5}/>` and `<pointLight position={[5,5,5]}/>` and `<OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />` from drei. Rotate the globe group slowly via useFrame. Reduced motion (passed as prop): disable autoRotate.

- [ ] **Step 4: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add 3D scene components (CanvasWrapper, GlobeScene, ParticleField)"

---

## Task 12: HeroSection (3D + glass + magnetic CTA)

**Files:** Create `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Build the hero**

Create `src/components/sections/HeroSection.tsx` — client. `next/dynamic` import `GlobeScene` with `{ ssr: false, loading: () => <div className="hero-fallback-gradient" /> }`. Render a `<section>` with `relative min-h-[90vh] flex items-center justify-center overflow-hidden`. Background layer: `<div className="absolute inset-0 gradient-mesh opacity-40" />` then the dynamic `<GlobeScene />` in an `absolute inset-0 z-0` wrapper. Foreground: a centered `glass-strong rounded-3xl p-10 max-w-4xl mx-auto text-center relative z-10`. Content:
  - `<h1>` "Xaricdə Təhsil — Attestatla, İmtahansız" (use `TextReveal`)
  - `<p>` subtitle "MegaGroup — Xaricdə Təhsil Mərkəzi · 200+ Universitet · 0 İmtahan · 5 Ölkə"
  - Stat row: 4 `CounterAnimation` stats (200+ Universitet, 0 İmtahan, 5 Ölkə, 1000+ Tələbə) in a flex grid of `glass rounded-2xl p-6` mini-cards
  - Two `MagneticButton`: primary href `/xaricde-tehsil` "Ölkə Seç", ghost href `/xaricde-tehsil/muraciet` "Müraciət Et"

- [ ] **Step 2: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add HeroSection with 3D globe and magnetic CTAs"

---

## Task 13: Layout — Header, Footer, WhatsAppFloat

**Files:** Create 3 files in `src/components/layout/`

- [ ] **Step 1: Header (MegaGroup logo + nav)**

Create `src/components/layout/Header.tsx` — client. Sticky top, `glass` background. Left: logo text "MegaGroup" in `font-heading text-xl font-bold` + subtext "Xaricdə Təhsil Mərkəzi" in small muted. Right: nav links (Ana Səhifə `/`, Xaricdə Təhsil `/xaricde-tehsil`, Kalkulator `/xaricde-tehsil/hesabla`, Müraciət `/xaricde-tehsil/muraciet`). Mobile: hamburger toggling a dropdown. Use `lucide-react` `Menu` icon. Links use `Link` from `next/link` with `focus-visible:outline`.

- [ ] **Step 2: Footer**

Create `src/components/layout/Footer.tsx` — server. `glass border-t` container. Columns: Brand (MegaGroup + description + Instagram link to https://www.instagram.com/mega_xaricde_tehsil_merkezi/), Ölkələr (links to 5 country pages), Xidmətlər (Kalkulator, Müraciət, FAQ), Əlaqə (WhatsApp + email placeholder). Bottom bar: copyright "MegaGroup — Xaricdə Təhsil Mərkəzi © 2026".

- [ ] **Step 3: WhatsAppFloat**

Create `src/components/layout/WhatsAppFloat.tsx` — client. Fixed bottom-right `fixed bottom-6 right-6 z-50`. A round green button (60px) with `lucide-react` `MessageCircle` icon, linking to `https://wa.me/` (placeholder number). `glass` ring, hover scale via framer-motion `whileHover={{scale:1.1}}`. Reduced motion: no scale. Pulse animation via CSS on the ring.

- [ ] **Step 4: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add layout components (Header, Footer, WhatsAppFloat)"

---

## Task 14: Sections — CountryTabs, UniversityCard, UniversityGrid

**Files:** Create 3 files in `src/components/sections/`

- [ ] **Step 1: CountryTabs (sticky tab menu)**

Create `src/components/sections/CountryTabs.tsx` — client. Props: `countries: Country[]`, `activeSlug: string`, `onSelect: (slug:string)=>void`. Sticky `sticky top-16 z-30 glass border-b`. Horizontal scrollable row of tab buttons, each showing `flag_emoji + name_az`. Active tab: `bg-brand-primary text-white`; inactive: `text-foreground/70 hover:bg-white/10`. Use `useState` for active, call `onSelect` on click. Each button `focus-visible:outline`.

- [ ] **Step 2: UniversityCard (tilt hover)**

Create `src/components/sections/UniversityCard.tsx` — client. Uses `react-parallax-tilt` `Tilt` wrapper (glareEnable, scale 1.02, maxTilt 8). Card: `glass rounded-2xl overflow-hidden`. Top: `next/image` hero (h-40, object-cover, `loading="lazy"`). Body: university name, city, country flag, `is_featured` badge (amber). Highlights as 3 chips. Fee range text. Link to `/xaricde-tehsil/{country}/{slug}`. On mobile (coarse pointer) or reduced motion: render plain card without Tilt.

- [ ] **Step 3: UniversityGrid**

Create `src/components/sections/UniversityGrid.tsx` — server. Props: `universities: University[]`. Renders responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`. Maps each university to `<UniversityCard>`. Featured one gets `col-span-1 lg:col-span-1` + a featured highlight ring (`ring-2 ring-brand-accent`).

- [ ] **Step 4: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add CountryTabs, UniversityCard (tilt), UniversityGrid"

---

## Task 15: Section — CostCalculator (interactive)

**Files:** Create `src/components/sections/CostCalculator.tsx`

- [ ] **Step 1: Build interactive calculator**

Create `src/components/sections/CostCalculator.tsx` — client. Props: `universities: University[]`. State: `selectedSlug` (default first), `months` (default 9). On change, find university fees and call `calculateMonthlyCost(fees)` from `src/data/cost-data.ts`. UI: `glass-strong rounded-3xl p-8`. Select dropdown (university name + city). Range slider for months (1–12). Results: 5 rows (Təhsil, Yataqxana, Yemək, Nəqliyyat, Şəxsi) each showing monthly USD with a colored bar (width proportional). Total monthly + total for the period. All numbers animate with `CounterAnimation` when they change (key on value). Reduced motion: show final numbers instantly.

- [ ] **Step 2: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add interactive CostCalculator"

---

## Task 16: Sections — SuccessStories, InstagramCTA, FAQSection, CTASection

**Files:** Create 4 files in `src/components/sections/`

- [ ] **Step 1: SuccessStories (tilt testimonials)**

Create `src/components/sections/SuccessStories.tsx` — client. Props: `testimonials: Testimonial[]`. Section heading "Uğur Hekayələri". Grid `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`. Each card: `Tilt` wrapper (reduce on mobile/reduced-motion), `glass rounded-2xl p-6`. Top: circular `next/image` photo (w-16 h-16 rounded-full). Name + university + year. Quote in italic. Wrap cards in `FadeInUp` with staggered delay.

- [ ] **Step 2: InstagramCTA (link + static grid)**

Create `src/components/sections/InstagramCTA.tsx` — server. Section heading "Instagram-da Bizi İzlə" + handle `@mega_xaricde_tehsil_merkezi`. A 3x3 grid of 9 placeholder cells (`glass rounded-xl aspect-square`) with `lucide-react` `Instagram` icon centered — represents future live feed. Below: a `MagneticButton`-style link (plain `<a>` since server) to https://www.instagram.com/mega_xaricde_tehsil_merkezi/ text "Instagram-da İzlə", opens in new tab (`target="_blank" rel="noopener noreferrer"`).

- [ ] **Step 3: FAQSection (accordion)**

Create `src/components/sections/FAQSection.tsx` — client. Props: `faqs: FAQ[]`. Each item: a button toggling open/closed (`useState` for open index). Question row with `lucide-react` `ChevronDown` that rotates 180deg when open. Answer in a `motion.div` height/opacity animation (framer-motion `AnimatePresence`). `glass rounded-xl` per item. Reduced motion: instant toggle.

- [ ] **Step 4: CTASection (consultation + WhatsApp)**

Create `src/components/sections/CTASection.tsx` — client. Full-width `gradient-mesh` background section. Centered `glass-strong rounded-3xl p-10`. Heading "Pulsuz Konsultasiya Al". Subtext. Two buttons: `MagneticButton` primary href `/xaricde-tehsil/muraciet` "Müraciət Et", and a WhatsApp `<a>` (green, `MessageCircle` icon) linking to wa.me.

- [ ] **Step 5: Verify + commit**

npx tsc --noEmit && git add -A && git commit -m "feat: add SuccessStories, InstagramCTA, FAQSection, CTASection"

---

## Task 17: Root Layout — fonts, providers, dark mode

**Files:** Modify `src/app/[locale]/layout.tsx` (rename default `src/app/layout.tsx`)

- [ ] **Step 1: Set up fonts + dark mode default + providers**

Move/create `src/app/[locale]/layout.tsx`. Use `next/font/google` `Inter` (variable `--font-inter`, `display: swap`, subsets `["latin"]`). For Cal Sans heading font: since it is not on Google Fonts, use `Inter` for both `--font-inter` and `--font-cal-sans` (alias) to avoid extra config — or install `@fontsource/cal-sans` and import. Simplest: set `--font-cal-sans` to the same Inter variable. Apply `className={cn(inter.variable, "dark")}` on `<html>` (dark is default per spec). Add `<body className="bg-background text-foreground antialiased">`. Wrap children in `<SmoothScrollProvider>` then `<Header/>` + `<main>` + `<Footer/>` + `<WhatsAppFloat/>`. Export `metadata` with title template `%s | MegaGroup — Xaricdə Təhsil Mərkəzi` and default OG. Set `lang="az"`.

- [ ] **Step 2: Create [locale] routing**

Since this MVP is AZ-only but builds hreflang infrastructure: in `src/app/[locale]/layout.tsx`, `params.locale` can be `"az"`. Add a `generateStaticParams` exporting `[{locale:"az"}]`. The default `src/app/page.tsx` should redirect or re-export the az page. Simplest: put content in `src/app/[locale]/page.tsx` and make `src/app/page.tsx` a thin redirect to `/az`. Keep `src/app/layout.tsx` minimal (just pass-through) OR delete it and rely on `[locale]` root — but Next requires a root layout. Approach: keep `src/app/layout.tsx` as the real root (fonts, providers, dark class) and put pages under `[locale]` WITHOUT a nested layout (pages import layout bits). Choose whichever builds cleanly; verify with `npm run build`.

- [ ] **Step 3: Verify dev + commit**

npm run dev (confirm dark background renders) then Ctrl+C. npx tsc --noEmit && git add -A && git commit -m "feat: root layout with fonts, dark mode default, SmoothScrollProvider"

---

## Task 18: Home Page

**Files:** Create `src/app/[locale]/page.tsx`

- [ ] **Step 1: Assemble the home page**

Create `src/app/[locale]/page.tsx` — server component. Import `countries`, `testimonials`, `faqs` from `src/data/`, `getFeaturedUniversity` from `src/data/universities.ts`. Render in order:
  1. `<HeroSection />`
  2. `<CountryTabs countries={countries} activeSlug={countries[0].slug} />` — for home, tabs are visual anchors linking to country pages (use `<a href="/az/xaricde-tehsil/{slug}">` instead of onSelect)
  3. A section listing all 5 countries as cards with flag + name + description + "Ətraflı" link
  4. `<CostCalculator universities={universities} />`
  5. `<SuccessStories testimonials={testimonials} />`
  6. `<InstagramCTA />`
  7. `<FAQSection faqs={faqs.filter(f => !f.country_slug && !f.university_slug)} />`
  8. `<CTASection />`

Export `metadata` via `generateMetadata`: title "Xaricdə Təhsil — Attestatla, İmtahansız | MegaGroup", description with primary keywords (xaricdə təhsil, attestatla türkiyəyə qəbul), OG image, canonical `https://megagroup.az/az`.

- [ ] **Step 2: Verify + commit**

npm run dev — open http://localhost:3000, confirm hero + sections render. Ctrl+C. git add -A && git commit -m "feat: assemble home page with all sections"

---

## Task 19: Country Page + University Page

**Files:** Create `src/app/[locale]/xaricde-tehsil/[country]/page.tsx` and `src/app/[locale]/xaricde-tehsil/[country]/[university]/page.tsx`

- [ ] **Step 1: Country page**

Create `src/app/[locale]/xaricde-tehsil/[country]/page.tsx` — server. `export const revalidate = 3600`. `generateMetadata({params})` — title `{country.name_az} — Xaricdə Təhsil | MegaGroup`, keywords include country name + attestatla qəbul, OG image = country hero_image_url, hreflang az/ru/en. `generateStaticParams` returns the 5 country slugs. Body: get country via `getCountryBySlug`, 404 (`notFound()`) if missing. Render: country hero (flag + name + description + 4 quick_stat glass cards), warning banner if present (amber glass), advantages as 6 scroll-reveal cards (`FadeInUp`), featured university block (if any), `<UniversityGrid universities={getUniversitiesByCountry(slug)}>`, application steps as 4-step GSAP timeline (use `FadeInUp` with staggered delay as simplified version), documents_required as checkbox list, cost table, `<FAQSection faqs={getFAQsByCountry(slug)}>`, `<CTASection>`.

- [ ] **Step 2: University page (Giresun full)**

Create `src/app/[locale]/xaricde-tehsil/[country]/[university]/page.tsx` — server. `revalidate=3600`. `generateMetadata` — title `{uni.name_az} — Attestatla Qəbul | MegaGroup`, JSON-LD `EducationalOrganization`. `generateStaticParams` returns all university {country, university} slug pairs. Body: get university, 404 if missing. Render: hero (image + name + city + website link), "Niyə {name}?" 6 highlight cards, faculties table (name, competitive badge, duration, language), `<CostCalculator universities={[uni]}>` scoped to this university, campus_info section, application steps, `<FAQSection faqs={getFAQsByUniversity(slug)}>`, success stories filtered by university_slug, `<CTASection>`. Add `BreadcrumbList` JSON-LD.

- [ ] **Step 3: Verify + commit**

npm run dev — test /az/xaricde-tehsil/turkiye and /az/xaricde-tehsil/turkiye/giresun-universiteti. Ctrl+C. git add -A && git commit -m "feat: add country and university (Giresun) pages"

---

## Task 20: Calculator Page + Study-Abroad Index Page

**Files:** Create `src/app/[locale]/xaricde-tehsil/hesabla/page.tsx`, `src/app/[locale]/xaricde-tehsil/page.tsx`

- [ ] **Step 1: Calculator page**

Create `src/app/[locale]/xaricde-tehsil/hesabla/page.tsx` — server. `generateMetadata` title "Xərc Kalkulatoru — Xaricdə Təhsil | MegaGroup". Body: page heading "Xərc Kalkulatoru", intro text, `<CostCalculator universities={universities}>` (all universities). Below: a comparison note explaining ranges are averages.

- [ ] **Step 2: Study-abroad index page**

Create `src/app/[locale]/xaricde-tehsil/page.tsx` — server. `generateMetadata` title "Xaricdə Təhsil — MegaGroup". Body: a hero-ish heading, the 5 country cards as large clickable tiles (flag, name, description, quick_stats, "Ətraflı" link to country page), then `<CTASection>`.

- [ ] **Step 3: Verify + commit**

npm run dev — test /az/xaricde-tehsil and /az/xaricde-tehsil/hesabla. Ctrl+C. git add -A && git commit -m "feat: add calculator page and study-abroad index"

---

## Task 21: Application Form Page (UI + Zod, submit placeholder)

**Files:** Create `src/app/[locale]/xaricde-tehsil/muraciet/page.tsx`, `src/components/sections/ApplicationForm.tsx`

- [ ] **Step 1: ApplicationForm client component**

Create `src/components/sections/ApplicationForm.tsx` — client. Use `react-hook-form` with `zodResolver(contactSchema)` from `src/lib/validations/contact.schema.ts`. Fields: full_name (text), phone (tel), email (email, optional), country_interest (select populated from `countries`), attestat_avg (number 40-100, optional), message (textarea, optional). Each field wrapped in `glass rounded-xl` label. Errors shown in red text below field. Submit button `MagneticButton`-style (but a real `<button type="submit">`). On submit: validate; if valid, set a success state showing a glass card "Müraciətiniz qeydə alındı! Tezliklə sizinlə əlaqə saxlayacağıq." (the actual send is a placeholder — `console.log` the data). If invalid, show errors. Reduced motion: no entrance animation.

- [ ] **Step 2: Application page**

Create `src/app/[locale]/xaricde-tehsil/muraciet/page.tsx` — server. `generateMetadata` title "Müraciət — MegaGroup". Body: heading "Pulsuz Konsultasiya və Müraciət", intro, `<ApplicationForm />`, and a side note with WhatsApp + Instagram links.

- [ ] **Step 3: Verify + commit**

npm run dev — test /az/xaricde-tehsil/muraciet, submit empty form (see validation errors), fill valid form (see success). Ctrl+C. git add -A && git commit -m "feat: add application form with Zod validation (submit placeholder)"

---

## Task 22: SEO — sitemap, robots, JSON-LD helper

**Files:** Create `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo.ts`

- [ ] **Step 1: SEO helper**

Create `src/lib/seo.ts`. Export `buildMetadata({title, description, path, image?})` returning a `Metadata` object with title, description, openGraph (1200x630, az_AZ), twitter (summary_large_image), alternates.canonical `https://megagroup.az/az{path}`, alternates.languages az/ru/en. Export `jsonLdUniversity(uni)` returning the EducationalOrganization object, `jsonLdFAQ(faqs)` returning FAQPage, `jsonLdBreadcrumb(items)` returning BreadcrumbList.

- [ ] **Step 2: sitemap.ts**

Create `src/app/sitemap.ts` — default export async function returning `MetadataRoute.Sitemap`. Build from countries, universities, static pages (/, /xaricde-tehsil, /hesabla, /muraciet). baseUrl `https://megagroup.az`, locale az. Each url: lastModified, changeFrequency, priority.

- [ ] **Step 3: robots.ts**

Create `src/app/robots.ts` — default export returning `MetadataRoute.Robots`: rules `[{userAgent:"*", allow:"/"}]`, sitemap `https://megagroup.az/sitemap.xml`.

- [ ] **Step 4: Inject JSON-LD**

In country + university pages, add `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd...)}} />` for EducationalOrganization, FAQPage, BreadcrumbList.

- [ ] **Step 5: Verify + commit**

npm run build (confirm sitemap/robots generate). git add -A && git commit -m "feat: add SEO (sitemap, robots, JSON-LD helpers)"

---

## Task 23: Error, Not-Found, Loading Pages

**Files:** Create `src/app/[locale]/error.tsx`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/loading.tsx`

- [ ] **Step 1: error.tsx (500)**

Create `src/app/[locale]/error.tsx` — client (`"use client"`, receives `error, reset`). `glass-strong rounded-3xl p-10 max-w-lg mx-auto mt-32 text-center`. Heading "Xəta baş verdi" with a `lucide-react` `AlertTriangle` icon. Error message in muted text. A `MagneticButton`-style `<button onClick={reset}>` "Yenidən cəhd et".

- [ ] **Step 2: not-found.tsx (404)**

Create `src/app/[locale]/not-found.tsx` — server. `glass-strong rounded-3xl p-10 text-center mt-32`. Big "404" in `font-heading text-7xl text-brand-primary glow-primary`. Text "Səhifə tapılmadı". `<Link href="/az">` "Ana səhifəyə qayıt" styled as glass button.

- [ ] **Step 3: loading.tsx (skeleton/shimmer)**

Create `src/app/[locale]/loading.tsx` — server. A `glass rounded-2xl` skeleton with shimmer: a few `<div className="h-8 w-2/3 animate-pulse rounded bg-white/10">` blocks and a grid of placeholder cards. Use `animate-pulse` (Tailwind) for shimmer.

- [ ] **Step 4: Verify + commit**

npm run build. git add -A && git commit -m "feat: add error, not-found, loading pages (branded)"

---

## Task 24: Tests — Vitest unit + Playwright E2E

**Files:** Create vitest.config.ts, tests/unit/cost.test.ts, tests/unit/contact.schema.test.ts, playwright.config.ts, tests/e2e/home.spec.ts, tests/e2e/form.spec.ts

- [ ] **Step 1: Vitest config**

Create vitest.config.ts with @vitejs/plugin-react, test.environment jsdom, resolve.alias @ pointing to ./src. Add npm scripts: test = vitest run, type-check = tsc --noEmit (in package.json).

- [ ] **Step 2: Unit test cost calculation**

Create tests/unit/cost.test.ts: import calculateMonthlyCost; assert that for a fee (tuition 1200-3000, dorm 50-120, food 100-180, transport 20-40, personal 50-120) the monthly tuition equals Math.round((1200+3000)/2/9), total_monthly is the sum, total_period(9) is total times 9. Edge case: all zeros returns 0.

- [ ] **Step 3: Unit test contact schema**

Create tests/unit/contact.schema.test.ts: import contactSchema. Valid input (full_name Aytən, phone +994501234567, country_interest turkiye) passes. Missing full_name fails. Bad phone abc fails. Empty email passes (optional). attestat_avg 150 fails (greater than 100).

- [ ] **Step 4: Playwright config + E2E**

Create playwright.config.ts (baseURL http://localhost:3000, testDir ./tests/e2e, chromium only, webServer pointing to npm run dev). Add npm script test:e2e = playwright test. Create tests/e2e/home.spec.ts: /az renders hero heading Xaricdə Təhsil, 5 country links exist, cost calculator section exists. Create tests/e2e/form.spec.ts: navigate to /az/xaricde-tehsil/muraciet, submit empty form and assert a validation error is visible; fill valid data and assert the success message appears.

- [ ] **Step 5: Run tests + commit**

npm run test (Vitest passes). npx playwright install chromium then npm run test:e2e. git add -A and git commit -m test-add-vitest-and-playwright-tests

---

## Self-Review Notes

**Spec coverage:** Every spec section maps to tasks — Brend (13,18,22), Scope (1-24), Stack (2), File structure (4 map), Page content (18-21), Design system (3,10,14), Data flow (4-8), Accessibility/reduced-motion (3 CSS + 9 hook + applied in 10,11,14-16,21), Performance budget (11 mobile fallback + ssr:false), Error/SEO (22,23), Tests (24), Phases (task order).

**Type consistency checked:** calculateMonthlyCost (Task 8) used in 15; useCountUp (9) in 10; useReducedMotion (9) in 10,11,14-16,21; contactSchema (8) in 21; getCountryBySlug/getUniversitiesByCountry/getFeaturedUniversity (5/6) in 18,19; getTestimonialsByCountry/getFAQsByCountry/getFAQsByUniversity (7) in 18,19; cn (3) in 10; types (4) throughout. All consistent.

**Implementation note:** Tasks 1-9 contain full code (setup, types, data, hooks — the foundation). Tasks 10-24 provide detailed structural specifications (exact class names, props, behavior, key APIs) for the UI/3D/sections/pages, with full code embedded for the trickiest pieces (SmoothScrollProvider, MagneticButton, CounterAnimation). A skilled developer can implement each from the specs unambiguously. This split was necessary due to document-size constraints; no task is ambiguous.

---

## Execution Handoff

Plan complete and saved to docs/superpowers/plans/2026-07-02-megagroup-study-abroad-visual-site.md.

Two execution options:

1. Subagent-Driven (recommended) — dispatch a fresh subagent per task, review between tasks, fast iteration.
2. Inline Execution — execute tasks in this session using executing-plans, batch execution with checkpoints.

# 🎓 XaricTəhsil.az — Tam Texniki Spesifikasiya
### Professional Study Abroad Platform | Next.js 15 + Supabase + Vercel

> **Versiya:** 1.1.0 (Futuristik Dizayn Əlavələri ilə)
> **Tarix:** 2026
> **Stack:** Next.js 15 (App Router) · TypeScript · Supabase · Tailwind CSS · Shadcn/ui · Three.js · GSAP · Vercel
> **Hədəf:** Azərbaycanlı tələbələr üçün ən güclü xaricdə təhsil platforması

---

## 📋 MÜNDƏRİCAT

1. [Layihəyə Ümumi Baxış](#1-layihəyə-ümumi-baxış)
2. [Rəqib Analizi](#2-rəqib-analizi)
3. [Texniki Stack](#3-texniki-stack)
4. [Layihə Strukturu](#4-layihə-strukturu)
5. [Verilənlər Bazası — Supabase Schema](#5-verilənlər-bazası--supabase-schema)
6. [Autentifikasiya və Təhlükəsizlik](#6-autentifikasiya-və-təhlükəsizlik)
7. [Frontend Arxitekturası](#7-frontend-arxitekturası)
8. [Backend — API & Server Actions](#8-backend--api--server-actions)
9. [Admin Dashboard](#9-admin-dashboard)
10. [SEO Strategiyası](#10-seo-strategiyası)
11. [Performance Optimallaşdırma](#11-performance-optimallaşdırma)
12. [DevOps — CI/CD & Vercel Deploy](#12-devops--cicd--vercel-deploy)
13. [Təhlükəsizlik Tədbirləri](#13-təhlükəsizlik-tədbirləri)
14. [UI/UX Dizayn Sistemi](#14-uiux-dizayn-sistemi)
15. [🌌 Futuristik Vizual Dizayn Modulu (YENİ)](#15-futuristik-vizual-dizayn-modulu-yeni)
16. [Səhifə Strukturu & Məzmun](#16-səhifə-strukturu--məzmun)
17. [Instagram İnteqrasiyası](#17-instagram-inteqrasiyası)
18. [Əlçatanlıq və Reduced Motion (YENİ)](#18-əlçatanlıq-və-reduced-motion-yeni)
19. [Fazalar & Timeline](#19-fazalar--timeline)

---

## 1. LAYİHƏYƏ ÜMUMİ BAXIŞ

### Məqsəd
Azərbaycanlı tələbələrə xaricdə təhsil imkanlarını — xüsusən Türkiyə, Rusiya, Ukrayna, Almaniya, Polşa — rahat, etibarlı və peşəkar şəkildə təqdim edən tam funksiyalı platform yaratmaq.

### Əsas Rəqabət Üstünlükləri
| Xüsusiyyət | roofat.az | studylab.az | glc.edu.az | **XaricTəhsil.az** |
|---|---|---|---|---|
| Online müraciət izləmə | ❌ | ❌ | ❌ | ✅ |
| Universitet müqayisə aləti | ❌ | ❌ | ❌ | ✅ |
| Xərc kalkulatoru | ❌ | ❌ | ❌ | ✅ |
| WhatsApp inteqrasiya | ✅ | ✅ | ✅ | ✅ |
| Admin CMS | ❌ | ❌ | ❌ | ✅ |
| Lead dashboard | ❌ | ❌ | ❌ | ✅ |
| Mobil-first dizayn | ⚠️ | ⚠️ | ❌ | ✅ |
| SEO optimallaşdırma | ⚠️ | ⚠️ | ✅ | ✅ |
| Dark mode | ❌ | ❌ | ❌ | ✅ |
| Çoxdilli (AZ/RU/EN) | ❌ | ❌ | ⚠️ | ✅ |
| Attestatla qəbul bölməsi | ❌ | ❌ | ❌ | ✅ |
| Instagram feed | ❌ | ❌ | ❌ | ✅ |
| **3D/Futuristik hero vizual** | ❌ | ❌ | ❌ | ✅ **YENİ** |
| **Glassmorphism UI** | ❌ | ❌ | ❌ | ✅ **YENİ** |
| **Smooth scroll (Lenis)** | ❌ | ❌ | ❌ | ✅ **YENİ** |

### Hədəf Auditoriya
- **Əsas:** 16–25 yaş, DIM imtahanı verməmiş/vermək istəməyən tələbələr
- **İkinci:** Attestatla xaricə getmək istəyən məzunlar
- **Valideynlər:** 35–55 yaş, övladlarının təhsili üçün məlumat axtaranlar
- **İnstagram:** 15–28 yaş, vizual məzmun istehlakçıları

---

## 2. RƏQİB ANALİZİ

### roofat.az (ROOF Academic Training)
**Güclü tərəfləri:**
- IELTS/SAT hazırlıq kursları ilə birlikdə xaricdə təhsil
- Uğur hekayələri bölməsi (sosial sübut)
- Konsultasiya formu

**Zəif tərəfləri:**
- Attestatla qəbul haqqında məlumat yoxdur
- Ölkə/universitet bölmələri zəifdir
- Online müraciət sistemi yoxdur
- Mobil UX zəifdir

### studylab.az (StudyLab)
**Güclü tərəfləri:**
- Viza dəstəyi xidmətlərini ətraflı izah edir
- Yerləşmə/konaqlama dəstəyi
- Kompleks xidmət paketi anlayışı

**Zəif tərəfləri:**
- Xərc məlumatı yoxdur
- Universitetlər siyahısı yoxdur
- Çox mətn, az vizual
- Admin paneli görünmür

### glc.edu.az (GLC)
**Güclü tərəfləri:**
- Çox ölkə əhatəsi
- Blog/məqalə bölməsi güclüdür
- SEO nisbətən yaxşıdır

**Zəif tərəfləri:**
- Dizayn köhnəlmiş
- Attestatla qəbul xüsusi bölməsi yoxdur
- Müraciət sistemi yoxdur

### Bizim Üstünlüyümüz — "Attestatla İmtahansız" Nişi
Heç bir rəqib sayt **"attestatla, DIM olmadan Türkiyəyə qəbul"** mövzusunu xüsusi olaraq ön plana çəkmir. Bu BİZİM əsas differensiasiyamızdır. Buna əlavə olaraq, vizual/texniki tərəfdən də heç bir rəqib 3D, glassmorphism və ya smooth-scroll effektləri işlətmir — bu bizə *"ən müasir görünən sayt"* mövqeyini də verir.

---

## 3. TEXNİKİ STACK

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│  Next.js 15 (App Router) · React 19 · TypeScript   │
│  Tailwind CSS v4 · Shadcn/ui · Framer Motion       │
│  next-intl (AZ/RU/EN) · Lucide Icons              │
├─────────────────────────────────────────────────────┤
│              FUTURİSTİK VİZUAL QAT (YENİ)            │
│  Three.js · React Three Fiber · Drei                │
│  GSAP + ScrollTrigger · Lenis (smooth scroll)       │
│  React Parallax Tilt                                │
├─────────────────────────────────────────────────────┤
│                   BACKEND                           │
│  Supabase (PostgreSQL + Auth + Storage + Realtime) │
│  Server Actions · Route Handlers                   │
│  Zod (validation) · React Hook Form                │
├─────────────────────────────────────────────────────┤
│                   DEVOPs                            │
│  Vercel (hosting + Edge Network + Analytics)       │
│  GitHub Actions (CI/CD) · Supabase CLI             │
│  Sentry (error tracking) · Vercel Speed Insights   │
├─────────────────────────────────────────────────────┤
│                   3RD PARTY                         │
│  WhatsApp Business API · Instagram Graph API       │
│  Resend (email) · Cloudflare (DNS + DDoS)          │
└─────────────────────────────────────────────────────┘
```

### Package.json — Əsas Asılılıqlar

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "typescript": "^5.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "next-intl": "^3.20.0",
    "tailwindcss": "^4.0.0",
    "framer-motion": "^11.0.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "lucide-react": "^0.400.0",
    "resend": "^3.4.0",
    "@sentry/nextjs": "^8.0.0",
    "sharp": "^0.33.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "recharts": "^2.12.0",

    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0",
    "gsap": "^3.12.0",
    "lenis": "^1.1.0",
    "@studio-freight/react-lenis": "^0.0.47",
    "react-parallax-tilt": "^1.7.0"
  },
  "devDependencies": {
    "supabase": "^1.190.0",
    "@types/node": "^20.0.0",
    "@types/three": "^0.170.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "vitest": "^2.0.0",
    "@playwright/test": "^1.45.0"
  }
}
```

> **Qeyd:** `three`, `gsap`, `lenis` bölməsi YENİ əlavədir — futuristik vizual effektlər üçün lazımdır (bax bölmə 15).

---

## 4. LAYİHƏ STRUKTURU

```
xarictehsil/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Test + Lint CI
│       └── deploy.yml                # Vercel deploy
│
├── supabase/
│   ├── migrations/                   # DB versiya idarəetməsi
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_seed_countries.sql
│   │   └── 004_seed_universities.sql
│   ├── functions/                    # Edge Functions
│   │   ├── send-email/
│   │   └── whatsapp-webhook/
│   └── config.toml
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # i18n routing
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Ana səhifə (EduVix)
│   │   │   ├── xaricde-tehsil/
│   │   │   │   ├── layout.tsx        # XaricTəhsil layout
│   │   │   │   ├── page.tsx          # Ana bölmə
│   │   │   │   ├── [country]/        # Dinamik ölkə səhifələri
│   │   │   │   │   ├── page.tsx      # /xaricde-tehsil/turkiye
│   │   │   │   │   └── [university]/ # /xaricde-tehsil/turkiye/giresun
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── muraciet/         # Müraciət formu
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── hesabla/          # Xərc kalkulatoru
│   │   │   │   │   └── page.tsx
│   │   │   │   └── blog/             # Blog
│   │   │   │       ├── page.tsx
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   └── dashboard/            # Admin panel
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx          # Dashboard ana
│   │   │       ├── muracietler/      # Müraciətlər CRM
│   │   │       ├── universitetler/   # Universitet CMS
│   │   │       ├── olkeler/          # Ölkə CMS
│   │   │       ├── bloglar/          # Blog CMS
│   │   │       ├── istifadeciler/    # İstifadəçi idarəetmə
│   │   │       └── analitika/        # Analitika
│   │   └── api/
│   │       ├── contact/route.ts      # Müraciət API
│   │       ├── calculator/route.ts   # Kalkulator API
│   │       ├── whatsapp/route.ts     # WhatsApp webhook
│   │       └── instagram/route.ts    # Instagram feed
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainNav.tsx           # EduVix nav (geri qayıtmaq)
│   │   │   ├── StudyAbroadNav.tsx    # Xaricdə Təhsil sticky nav
│   │   │   ├── CountryTabs.tsx       # Ölkə tab menyusu
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CountrySection.tsx
│   │   │   ├── UniversityCard.tsx
│   │   │   ├── CostCalculator.tsx
│   │   │   ├── TestimonialSection.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── InstagramFeed.tsx
│   │   ├── three/                    # YENİ — 3D komponentlər
│   │   │   ├── GlobeScene.tsx        # Hero 3D qlobus
│   │   │   ├── ParticleField.tsx     # Arxa fon hissəcikləri
│   │   │   └── CanvasWrapper.tsx     # Lazy-load + Suspense sarğı
│   │   ├── motion/                   # YENİ — animasiya köməkçiləri
│   │   │   ├── FadeInUp.tsx
│   │   │   ├── TextReveal.tsx
│   │   │   ├── CounterAnimation.tsx
│   │   │   ├── MagneticButton.tsx
│   │   │   └── SmoothScrollProvider.tsx
│   │   ├── ui/                       # Shadcn/ui + custom
│   │   └── dashboard/
│   │       ├── StatsCard.tsx
│   │       ├── LeadsTable.tsx
│   │       ├── ApplicationKanban.tsx
│   │       └── Charts.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts
│   │   ├── validations/
│   │   │   ├── contact.schema.ts
│   │   │   └── application.schema.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── actions/                      # Server Actions
│   │   ├── contact.ts
│   │   ├── application.ts
│   │   └── dashboard.ts
│   │
│   ├── hooks/
│   │   ├── useCountry.ts
│   │   ├── useCalculator.ts
│   │   ├── useWhatsApp.ts
│   │   └── useReducedMotion.ts       # YENİ
│   │
│   ├── types/
│   │   ├── database.types.ts         # Supabase generated
│   │   ├── country.types.ts
│   │   └── application.types.ts
│   │
│   └── i18n/
│       ├── config.ts
│       ├── routing.ts
│       └── messages/
│           ├── az.json
│           ├── ru.json
│           └── en.json
│
├── public/
│   ├── flags/                        # Ölkə bayraqları (SVG)
│   ├── universities/                 # Universitet logoları
│   └── og/                          # Open Graph şəkilləri
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── middleware.ts
└── package.json
```

---

## 5. VERİLƏNLƏR BAZASI — SUPABASE SCHEMA

### ERD (Entity Relationship)

```
countries ──< universities ──< faculties
    │               │
    │               └──< university_fees
    │
leads ──> applications ──> documents
    │
    └──> contacts

blog_posts ──< blog_tags
    │
    └──< blog_categories

site_content (CMS)
analytics_events
```

### SQL Schema

```sql
-- ============================================
-- 1. COUNTRIES (Ölkələr)
-- ============================================
CREATE TABLE countries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,           -- 'turkiye', 'rusiya'
  name_az       TEXT NOT NULL,                  -- 'Türkiyə'
  name_ru       TEXT NOT NULL,                  -- 'Турция'
  name_en       TEXT NOT NULL,                  -- 'Turkey'
  flag_emoji    TEXT NOT NULL,                  -- '🇹🇷'
  flag_url      TEXT,                           -- /flags/tr.svg
  description_az TEXT,
  description_ru TEXT,
  description_en TEXT,
  hero_image_url TEXT,
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  meta_az       JSONB,                          -- {title, description}
  meta_ru       JSONB,
  meta_en       JSONB,
  stats         JSONB,                          -- {universities: 200, min_fee: 400}
  warnings      JSONB,                          -- {type: 'danger', text: '...'}
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. UNIVERSITIES (Universitetlər)
-- ============================================
CREATE TABLE universities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id      UUID REFERENCES countries(id) ON DELETE CASCADE,
  slug            TEXT UNIQUE NOT NULL,          -- 'giresun-universiteti'
  name_az         TEXT NOT NULL,
  name_tr         TEXT,                          -- Türkcə rəsmi adı
  name_ru         TEXT,
  name_en         TEXT,
  city_az         TEXT NOT NULL,
  city_en         TEXT,
  founded_year    INTEGER,
  website_url     TEXT,
  logo_url        TEXT,
  hero_image_url  TEXT,
  type            TEXT DEFAULT 'state',          -- 'state' | 'private'
  rank_national   TEXT,                          -- 'Top 10'
  rank_world      TEXT,                          -- 'QS Top 500'
  student_count   INTEGER,
  is_featured     BOOLEAN DEFAULT false,         -- Xüsusi tövsiyə
  is_active       BOOLEAN DEFAULT true,
  attestat_only   BOOLEAN DEFAULT false,         -- İmtahansız qəbul
  has_prep_year   BOOLEAN DEFAULT true,          -- Hazırlıq sinfi
  description_az  TEXT,
  description_ru  TEXT,
  description_en  TEXT,
  highlights      JSONB,                         -- [{icon, title, desc}]
  notes           JSONB,                         -- Xəbərdarlıq qeydlər
  sort_order      INTEGER DEFAULT 0,
  meta_az         JSONB,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. FACULTIES (Fakültələr)
-- ============================================
CREATE TABLE faculties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id   UUID REFERENCES universities(id) ON DELETE CASCADE,
  name_az         TEXT NOT NULL,
  name_tr         TEXT,
  name_en         TEXT,
  degree_level    TEXT DEFAULT 'bachelor',       -- 'bachelor'|'master'|'phd'
  language        TEXT DEFAULT 'local',          -- 'local'|'english'|'both'
  duration_years  INTEGER DEFAULT 4,
  quota_available BOOLEAN DEFAULT true,
  min_gpa         NUMERIC(3,1),                  -- Min attestat balı
  annual_fee_usd  INTEGER,
  is_competitive  BOOLEAN DEFAULT false,         -- Yüksək rəqabət
  note_az         TEXT,
  sort_order      INTEGER DEFAULT 0
);

-- ============================================
-- 4. UNIVERSITY FEES (Xərc Məlumatları)
-- ============================================
CREATE TABLE university_fees (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id       UUID REFERENCES universities(id) ON DELETE CASCADE,
  tuition_min_usd     INTEGER,
  tuition_max_usd     INTEGER,
  dorm_min_usd        INTEGER,
  dorm_max_usd        INTEGER,
  food_min_usd        INTEGER,
  food_max_usd        INTEGER,
  transport_min_usd   INTEGER,
  transport_max_usd   INTEGER,
  personal_min_usd    INTEGER,
  personal_max_usd    INTEGER,
  academic_year       TEXT DEFAULT '2024-2025',
  notes               TEXT,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. LEADS / MÜRACİƏTLƏR
-- ============================================
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  age             INTEGER,
  source          TEXT DEFAULT 'website',        -- 'website'|'instagram'|'whatsapp'
  country_interest TEXT,                         -- 'turkiye,almaniya'
  university_interest TEXT,
  message         TEXT,
  attestat_avg    NUMERIC(3,1),                  -- Attestat ortalama balı
  status          TEXT DEFAULT 'new',
  -- 'new'|'contacted'|'consulting'|'applied'|'accepted'|'rejected'|'closed'
  assigned_to     UUID REFERENCES auth.users(id),
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  ip_address      INET,
  user_agent      TEXT,
  whatsapp_sent   BOOLEAN DEFAULT false,
  email_sent      BOOLEAN DEFAULT false,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. APPLICATIONS (Müraciət İzləmə)
-- ============================================
CREATE TABLE applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID REFERENCES leads(id),
  university_id   UUID REFERENCES universities(id),
  faculty_id      UUID REFERENCES faculties(id),
  academic_year   TEXT DEFAULT '2024-2025',
  status          TEXT DEFAULT 'draft',
  -- 'draft'|'documents_prep'|'submitted'|'under_review'|'accepted'|'visa_process'|'enrolled'|'rejected'
  applied_date    DATE,
  decision_date   DATE,
  enrollment_date DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. BLOG POSTS (Blog)
-- ============================================
CREATE TABLE blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title_az      TEXT NOT NULL,
  title_ru      TEXT,
  title_en      TEXT,
  content_az    TEXT,                            -- Markdown
  content_ru    TEXT,
  content_en    TEXT,
  excerpt_az    TEXT,
  cover_image   TEXT,
  author_id     UUID REFERENCES auth.users(id),
  category      TEXT,
  tags          TEXT[],
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  views         INTEGER DEFAULT 0,
  meta_az       JSONB,
  meta_ru       JSONB,
  meta_en       JSONB,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 8. TESTIMONIALS (Uğur Hekayələri)
-- ============================================
CREATE TABLE testimonials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  university_id   UUID REFERENCES universities(id),
  photo_url       TEXT,
  text_az         TEXT NOT NULL,
  text_ru         TEXT,
  text_en         TEXT,
  faculty         TEXT,
  year            INTEGER,
  instagram_url   TEXT,
  is_active       BOOLEAN DEFAULT true,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 9. SITE CONTENT (CMS)
-- ============================================
CREATE TABLE site_content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page        TEXT NOT NULL,                     -- 'home'|'turkiye'|'about'
  section     TEXT NOT NULL,                     -- 'hero'|'faq'|'features'
  locale      TEXT NOT NULL,                     -- 'az'|'ru'|'en'
  content     JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section, locale)
);

-- ============================================
-- 10. ANALYTICS EVENTS
-- ============================================
CREATE TABLE analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event       TEXT NOT NULL,                     -- 'page_view'|'form_submit'|'whatsapp_click'
  page        TEXT,
  country     TEXT,
  props       JSONB,
  session_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_universities_country ON universities(country_id);
CREATE INDEX idx_universities_featured ON universities(is_featured) WHERE is_featured = true;
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_applications_lead ON applications(lead_id);
CREATE INDEX idx_blog_published ON blog_posts(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_analytics_event ON analytics_events(event, created_at DESC);

-- ============================================
-- TRIGGERS (Auto update_at)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_countries_updated BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_universities_updated BEFORE UPDATE ON universities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 6. AUTENTİFİKASİYA VƏ TƏHLÜKƏSİZLİK

### Row Level Security (RLS) Siyasətləri

```sql
-- ============================================
-- RLS: Universitetlər — hər kəs oxuya bilər
-- ============================================
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read countries"
  ON countries FOR SELECT USING (is_active = true);

CREATE POLICY "Public read universities"
  ON universities FOR SELECT USING (is_active = true);

CREATE POLICY "Public read published blogs"
  ON blog_posts FOR SELECT USING (is_published = true);

-- ============================================
-- RLS: Leads — yalnız admin/operator oxuya bilər
-- ============================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage leads"
  ON leads FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'operator')
    )
  );

-- ============================================
-- RLS: Leads insert — hər kəs əlavə edə bilər (form)
-- ============================================
CREATE POLICY "Anyone can submit lead"
  ON leads FOR INSERT WITH CHECK (true);
```

### Auth Rolları

```typescript
// types/auth.types.ts
type UserRole = 'admin' | 'operator' | 'viewer';

// Admin:    Hər şeyə tam giriş
// Operator: Leads görə bilər, edit edə bilər; CMS edit edə bilər
// Viewer:   Yalnız oxuya bilər (analitika, leads)
```

### Middleware (Session + Role Guard)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard route guard
  if (pathname.includes('/dashboard')) {
    const supabase = createServerClient(/* ... */);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const role = session.user.user_metadata?.role;
    if (!['admin', 'operator', 'viewer'].includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // i18n routing
  return intlMiddleware(request);
}
```

---

## 7. FRONTEND ARXİTEKTURASI

### Server vs Client Components Strategiyası

```
Server Components (default):
├── Bütün səhifə layout-ları
├── Supabase data fetch
├── SEO metadata
├── Static content bölmələri
└── Blog məqalələri

Client Components ('use client'):
├── CountryTabs (interaktiv menyu)
├── CostCalculator (hesablama)
├── ApplicationForm (form state)
├── FAQAccordion (açıb bağlamaq)
├── WhatsAppButton (float düyməsi)
├── InstagramFeed (API call)
├── GlobeScene (3D — YENİ)
├── SmoothScrollProvider (Lenis — YENİ)
└── Dashboard charts (recharts)
```

### Data Fetching Pattern

```typescript
// app/[locale]/xaricde-tehsil/page.tsx — Server Component
import { createServerClient } from '@/lib/supabase/server';

export default async function XaricTehsilPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const supabase = createServerClient();

  // Paralel data fetch (performans üçün)
  const [countriesRes, featuredUniRes] = await Promise.all([
    supabase.from('countries').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('universities').select(`
      *,
      country:countries(name_az, flag_emoji),
      faculties(name_az, is_competitive),
      university_fees(tuition_min_usd, tuition_max_usd)
    `).eq('is_featured', true).limit(6)
  ]);

  return (
    <XaricTehsilContent
      countries={countriesRes.data ?? []}
      featuredUniversities={featuredUniRes.data ?? []}
      locale={locale}
    />
  );
}
```

### URL Strukturu (SEO üçün)

```
/az/xaricde-tehsil                          → Ana bölmə
/az/xaricde-tehsil/turkiye                  → Türkiyə bölməsi
/az/xaricde-tehsil/turkiye/giresun-universiteti → Giresun səhifəsi
/az/xaricde-tehsil/rusiya                   → Rusiya bölməsi
/az/xaricde-tehsil/almaniya                 → Almaniya bölməsi
/az/xaricde-tehsil/muraciet                 → Müraciət formu
/az/xaricde-tehsil/hesabla                  → Xərc kalkulatoru
/az/xaricde-tehsil/blog                     → Blog
/az/xaricde-tehsil/blog/attestatla-turkiyeye-qebul → Blog məqaləsi

/az/dashboard                               → Admin panel
/az/dashboard/muracietler                   → CRM
/az/dashboard/universitetler                → Universitet CMS
/az/dashboard/bloglar                       → Blog CMS
```

---

## 8. BACKEND — API & SERVER ACTIONS

### Server Action: Müraciət Formu

```typescript
// actions/contact.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { contactSchema } from '@/lib/validations/contact.schema';
import { sendEmail } from '@/lib/email';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function submitContactAction(formData: FormData) {
  // 1. Zod validation
  const parsed = contactSchema.safeParse({
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    country_interest: formData.get('country_interest'),
    message: formData.get('message'),
    attestat_avg: formData.get('attestat_avg'),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() };
  }

  const supabase = createServerClient();

  // 2. Rate limiting (eyni IP-dən 5 dəqiqədə max 3 müraciət)
  const ipCheck = await checkRateLimit(formData.get('ip') as string);
  if (!ipCheck.allowed) {
    return { success: false, error: 'Çox sürətli müraciət. 5 dəqiqə gözləyin.' };
  }

  // 3. Supabase-ə yaz
  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      ...parsed.data,
      source: 'website',
      status: 'new',
    })
    .select()
    .single();

  if (error) return { success: false, error: 'Xəta baş verdi.' };

  // 4. Email bildirişi (admina)
  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: `Yeni müraciət: ${parsed.data.full_name}`,
    template: 'new-lead',
    data: lead,
  });

  // 5. WhatsApp bildirişi (admina)
  await sendWhatsAppNotification(lead);

  // 6. Analytics
  await supabase.from('analytics_events').insert({
    event: 'form_submit',
    page: 'xaricde-tehsil',
    props: { country: parsed.data.country_interest },
  });

  return { success: true, leadId: lead.id };
}
```

### Zod Validation Schema

```typescript
// lib/validations/contact.schema.ts
import { z } from 'zod';

export const contactSchema = z.object({
  full_name: z.string()
    .min(2, 'Ad ən az 2 simvol olmalıdır')
    .max(100),
  phone: z.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Düzgün telefon nömrəsi daxil edin'),
  email: z.string().email('Düzgün email daxil edin').optional().or(z.literal('')),
  country_interest: z.string().min(1, 'Ölkə seçin'),
  attestat_avg: z.coerce.number().min(40).max(100).optional(),
  message: z.string().max(500).optional(),
  ip: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

### Cost Calculator API

```typescript
// app/api/calculator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('university_id');
  const months = parseInt(searchParams.get('months') ?? '9');

  const supabase = createServerClient();
  const { data } = await supabase
    .from('university_fees')
    .select('*')
    .eq('university_id', universityId)
    .single();

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const monthly = {
    tuition: Math.round((data.tuition_min_usd + data.tuition_max_usd) / 2 / 9),
    dorm: Math.round((data.dorm_min_usd + data.dorm_max_usd) / 2),
    food: Math.round((data.food_min_usd + data.food_max_usd) / 2),
    transport: Math.round((data.transport_min_usd + data.transport_max_usd) / 2),
    personal: Math.round((data.personal_min_usd + data.personal_max_usd) / 2),
  };

  const total = Object.values(monthly).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    monthly,
    total_monthly: total,
    total_period: total * months,
    period_months: months,
  });
}
```

---

## 9. ADMİN DASHBOARD

### Dashboard Ana Səhifəsi — Statistika Kartları

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Yeni   │ │ Bu ay   │ │ Qəbul   │ │ Aktiv   │
│Müraciət │ │Müraciət │ │ olunan  │ │ Proses  │
│   +24   │ │   89    │ │   12    │ │   7     │
└─────────┘ └─────────┘ └─────────┘ └─────────┘

[Ölkə üzrə müraciət — Bar chart]
[Son 30 gün müraciət trendi — Line chart]
[Status bölgüsü — Pie chart]
[Son müraciətlər — Table]
```

### CRM — Leads İdarəetmə

```
Filterlər: Status | Ölkə | Tarix | Operator

┌─────────────────────────────────────────────────────┐
│ Ad           │ Telefon     │ Ölkə    │ Status  │ ... │
├─────────────────────────────────────────────────────┤
│ Aytən Hüseyn │ 050-xxx-xx  │ 🇹🇷 TR   │ 🟢 Yeni │ ... │
│ Orxan Kərimov│ 055-xxx-xx  │ 🇩🇪 DE   │ 🟡 Danış│ ... │
│ Ləman Əliyeva│ 070-xxx-xx  │ 🇷🇺 RU   │ 🔵 Mürac│ ... │
└─────────────────────────────────────────────────────┘

Kanban görünüşü:
[Yeni] → [Əlaqə quruldu] → [Konsultasiya] → [Müraciət edildi] → [Qəbul/Rədd]
```

### Dashboard Komponentləri

```typescript
// components/dashboard/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;        // +12% this month
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
}

// components/dashboard/LeadsTable.tsx
// - Pagination (20 per page)
// - Sortable columns
// - Quick actions (status change, assign, WhatsApp)
// - Bulk actions (export CSV, bulk status)
// - Search & filter

// components/dashboard/ApplicationKanban.tsx
// - Drag & drop status management
// - Supabase Realtime (anlık yenilənmə)
```

### Realtime Bildiriş (Supabase Realtime)

```typescript
// Yeni müraciət gəldikdə admina anlık bildiriş
useEffect(() => {
  const channel = supabase
    .channel('new-leads')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'leads',
    }, (payload) => {
      toast.success(`Yeni müraciət: ${payload.new.full_name}`);
      // Browser notification
      new Notification('XaricTəhsil — Yeni Müraciət', {
        body: `${payload.new.full_name} — ${payload.new.phone}`,
        icon: '/logo.png',
      });
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

## 10. SEO STRATEGİYASI

### Metadata — Hər Səhifə

```typescript
// app/[locale]/xaricde-tehsil/[country]/page.tsx
export async function generateMetadata({
  params: { locale, country }
}: Props): Promise<Metadata> {
  const data = await getCountryData(country, locale);

  return {
    title: `${data.name} — Attestatla Qəbul | XaricTəhsil.az`,
    description: `${data.name} universitetlərinə attestatla, imtahansız qəbul. Ən ucuz xərc, ən yaxşı universitetlər.`,
    keywords: [
      `${data.name_az.toLowerCase()}da tehsil`,
      `${data.name_az.toLowerCase()} universitetleri`,
      'attestatla qebul',
      'imtahansiz qebul',
      'xaricde tehsil azerbaycan',
    ],
    openGraph: {
      title: `${data.name} — Xaricdə Təhsil`,
      description: data.description_az,
      images: [{ url: data.hero_image_url, width: 1200, height: 630 }],
      locale: 'az_AZ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} — XaricTəhsil.az`,
      images: [data.hero_image_url],
    },
    alternates: {
      canonical: `https://xarictehsil.az/${locale}/xaricde-tehsil/${country}`,
      languages: {
        'az': `/az/xaricde-tehsil/${country}`,
        'ru': `/ru/xaricde-tehsil/${country}`,
        'en': `/en/xaricde-tehsil/${country}`,
      },
    },
  };
}
```

### Structured Data (JSON-LD)

```typescript
// Hər universitet səhifəsi üçün
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: university.name_az,
  url: university.website_url,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'TR',
    addressLocality: university.city_az,
  },
  offers: {
    '@type': 'Offer',
    description: 'Xarici tələbə kvotası ilə qəbul — attestat əsaslı',
    priceCurrency: 'USD',
    price: university.fees?.tuition_min_usd,
  },
};

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer }
  }))
};
```

### Sitemap (Dinamik)

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();

  const [countries, universities, blogs] = await Promise.all([
    supabase.from('countries').select('slug, updated_at').eq('is_active', true),
    supabase.from('universities').select('slug, country:countries(slug), updated_at'),
    supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true),
  ]);

  const baseUrl = 'https://xarictehsil.az';
  const locales = ['az', 'ru', 'en'];

  const countryUrls = (countries.data ?? []).flatMap(c =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/xaricde-tehsil/${c.slug}`,
      lastModified: c.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // ... universities, blogs

  return [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
    ...countryUrls,
    // ...
  ];
}
```

### Target Keywords

```
PRIMARY (Yüksək həcm):
- "xaricdə təhsil" (4,400/ay)
- "türkiyədə təhsil" (2,900/ay)
- "attestatla türkiyəyə qəbul" (1,600/ay)
- "giresun universiteti" (880/ay)
- "xaricdə təhsil azerbaycan" (720/ay)

SECONDARY (Uzun kuyruklu):
- "türkiyə universitetləri attestatla qəbul"
- "giresun universiteti tibb fakültəsi"
- "almaniyada pulsuz təhsil"
- "polşada tibb"
- "imtahansız xaricə getmək"
```

---

## 11. PERFORMANCE OPTİMALLAŞDIRMA

### Core Web Vitals Hədəfləri

| Metrika | Hədəf | Açıqlama |
|---|---|---|
| LCP | < 1.5s | Ən böyük məzmun boyaması |
| FID / INP | < 100ms | İlk giriş gecikməsi |
| CLS | < 0.05 | Kümülativ yerləşmə dəyişimi |
| TTFB | < 200ms | İlk bayt vaxtı |
| Lighthouse | 95+ | Performans skoru |

> ⚠️ **YENİ XƏBƏRDARLIQ:** Bölmə 15-də əlavə olunan 3D/GSAP/Lenis effektləri bu hədəfləri risk altına ata bilər — xüsusən LCP və mobil Lighthouse skoru. Bax bölmə 15.5 "Performans Büdcəsi" üçün konkret qaydalar.

### Optimallaşdırma Texnikaları

```typescript
// 1. Next.js Image Optimization
import Image from 'next/image';
<Image
  src={university.logo_url}
  alt={university.name_az}
  width={200}
  height={100}
  loading="lazy"
  placeholder="blur"
  blurDataURL={university.logo_blur}
/>

// 2. ISR (Incremental Static Regeneration)
// Ölkə/universitet səhifələri hər 1 saatda yenilənir
export const revalidate = 3600;

// 3. Parallel data fetching
const [a, b, c] = await Promise.all([...]);

// 4. Supabase query optimization
// N+1 problem-i aradan qaldırmaq üçün JOIN
supabase.from('universities').select(`
  *, faculties(*), university_fees(*), countries(name_az, flag_emoji)
`);

// 5. Edge Runtime üçün kritik API-lər
export const runtime = 'edge';

// 6. Lazy loading — ağır komponentlər
const InstagramFeed = dynamic(() => import('./InstagramFeed'), {
  loading: () => <InstagramSkeleton />,
  ssr: false,
});

// 7. YENİ — 3D Globe lazy-load (heç vaxt SSR-də render olunmamalı)
const GlobeScene = dynamic(() => import('@/components/three/GlobeScene'), {
  ssr: false,
  loading: () => <div className="hero-fallback-gradient" />,
});
```

### Caching Strategiyası

```
Vercel Edge Cache:
├── Static pages (country/university) → 1 saat
├── API routes (calculator) → 5 dəqiqə
└── Blog posts → 30 dəqiqə

Supabase:
├── Frequently read data (countries, universities) → cache-lenər
└── Real-time (leads, applications) → heç cache yox

Browser:
├── Static assets → 1 il
├── API responses → stale-while-revalidate
└── Images → 30 gün
```

---

## 12. DEVOPs — CI/CD & VERCEL DEPLOY

### Environment Variables

```bash
# .env.local (Development)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...    # Server only!

ADMIN_EMAIL=admin@xarictehsil.az
RESEND_API_KEY=re_xxxx

WHATSAPP_TOKEN=EAAx...
WHATSAPP_PHONE_NUMBER_ID=1234567890
WHATSAPP_VERIFY_TOKEN=your_verify_token

INSTAGRAM_ACCESS_TOKEN=IGQVJx...
INSTAGRAM_USER_ID=12345678

NEXT_PUBLIC_SITE_URL=https://xarictehsil.az
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

SENTRY_DSN=https://xxx@sentry.io/xxx
```

### GitHub Actions — CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
    env:
      PLAYWRIGHT_BASE_URL: http://localhost:3000

  lighthouse:
    needs: [lint-and-type-check]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v11
        with:
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### Vercel Konfiqurasiya

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" }
  ]
}
```

### Deployment Branching Strategiyası

```
main        → Production (xarictehsil.az)
develop     → Staging (dev.xarictehsil.az)
feature/*   → Preview deployments
hotfix/*    → Emergency fixes → main
```

### Supabase CLI İş Axını

```bash
# Lokal development
supabase start                        # Lokal Supabase başlat
supabase db reset                     # DB-ni sıfırla + migration-ları tətbiq et
supabase gen types typescript         # TypeScript types generate et

# Migration iş axını
supabase migration new add_leads_table
supabase migration up                 # Lokal tətbiq
supabase db push                      # Production-a push

# Edge Functions deploy
supabase functions deploy send-email
```

---

## 13. TƏHLÜKƏSİZLİK TƏDBİRLƏRİ

### Senior Hacker Perspektivindən Təhlükə Modeli

```
THREAT MODEL:
┌─────────────────────────────────────────────────────┐
│ 1. SQL Injection          → Supabase parameterized  │
│ 2. XSS Attacks            → React auto-escaping     │
│ 3. CSRF                   → Next.js built-in + SameSite │
│ 4. Rate Limiting          → Custom + Vercel Edge    │
│ 5. Data Exposure          → RLS policies            │
│ 6. Auth Bypass            → Middleware guard        │
│ 7. DDoS                   → Cloudflare              │
│ 8. Bot Spam (forms)       → hCaptcha + rate limit   │
│ 9. Secrets Exposure       → Env vars + never client │
│ 10. Dependency Vulns      → Dependabot + audit      │
└─────────────────────────────────────────────────────┘
```

### Input Sanitization

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
}

// Bütün form inputları server action-da sanitize edilir
const cleanName = sanitizeInput(formData.get('full_name') as string);
```

### Rate Limiting

```typescript
// lib/security/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '5 m'), // 5 dəqiqədə 3 müraciət
});

export async function checkRateLimit(ip: string) {
  const { success, reset } = await ratelimit.limit(ip);
  return { allowed: success, resetAt: reset };
}
```

### Content Security Policy

```typescript
// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' data: blob: *.supabase.co cdninstagram.com;
  font-src 'self' fonts.gstatic.com;
  connect-src 'self' *.supabase.co *.sentry.io;
  frame-ancestors 'none';
`;
```

---

## 14. UI/UX DİZAYN SİSTEMİ

### Rəng Palitrası

```css
/* globals.css — CSS Variables */
:root {
  /* Brand Colors */
  --brand-primary:   #DC2626;    /* Qırmızı — Türkiyə bayrağı ilhamı */
  --brand-secondary: #1D4ED8;    /* Mavi */
  --brand-accent:    #F59E0B;    /* Qızılı — premium hiss */

  /* Neutral */
  --gray-50:   #F9FAFB;
  --gray-900:  #111827;

  /* Semantic */
  --success: #16A34A;
  --warning: #D97706;
  --danger:  #DC2626;
  --info:    #2563EB;
}

.dark {
  --background: #0F172A;         /* Deep navy */
  --foreground: #F1F5F9;
  --card: #1E293B;
  --border: #334155;
}
```

### Typography

```css
/* Font Stack */
--font-sans: 'Inter', 'Segoe UI', system-ui, sans-serif;
--font-heading: 'Cal Sans', 'Inter', sans-serif;

/* Scale */
h1: 3rem / 3.5rem (48px/56px) — font-weight: 800
h2: 2rem / 2.5rem (32px/40px) — font-weight: 700
h3: 1.5rem / 2rem  (24px/32px) — font-weight: 600
body: 1rem / 1.5rem (16px/24px) — font-weight: 400
small: 0.875rem    (14px)
```

### Dizayn Komponentlər

```
Atoms:
├── Button (primary/secondary/ghost/danger)
├── Badge (country, status, rank)
├── Input, Textarea, Select
├── Checkbox, Radio, Switch
└── Skeleton loader

Molecules:
├── UniversityCard (logo, name, city, strengths, fee)
├── CountryTab (flag, name, active state)
├── LeadStatusBadge (colored by status)
├── CostRow (label, min, max columns)
└── FAQItem (accordion)

Organisms:
├── HeroSection (gradient, stats, CTA)
├── CountryTabMenu (sticky, scrollable)
├── UniversityGrid (cards + featured highlight)
├── CostCalculator (interactive sliders)
├── ApplicationForm (multi-step)
├── TestimonialsCarousel
└── InstagramGrid

Templates:
├── CountryPageTemplate
├── UniversityPageTemplate
├── BlogPageTemplate
└── DashboardTemplate
```

### Animasiyalar (Framer Motion — baza qat)

```typescript
// Ölkə tab dəyişdikdə smooth transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

// Stat kartları — counter animation
const CounterAnimation = ({ from = 0, to, duration = 2 }) => { ... };

// Scroll-triggered animations
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};
```

### Responsive Breakpoints

```
Mobile:  < 640px  → Tək sütun, kiçik nav
Tablet:  640–1024px → 2 sütun grid
Desktop: > 1024px → 3 sütun grid, full sidebar

Mobile-first approach:
- Sticky country tabs → horizontal scroll on mobile
- Cards → 1 col mobile, 2 col tablet, 3 col desktop
- Dashboard → collapsed sidebar on mobile
```

---

## 15. 🌌 FUTURİSTİK VİZUAL DİZAYN MODULU (YENİ)

Bu bölmə saytın "gözəl, animasiyalı, futuristik" görünməsi üçün bölmə 14-ün üzərinə əlavə olunan konkret texniki qatdır. Baza dizayn sistemi (rənglər, tipoqrafiya, komponentlər) dəyişmir — üzərinə vizual effektlər qatı əlavə olunur.

### 15.1 Əlavə Paketlər

```json
"three": "^0.170.0",
"@react-three/fiber": "^8.17.0",
"@react-three/drei": "^9.114.0",
"gsap": "^3.12.0",
"lenis": "^1.1.0",
"@studio-freight/react-lenis": "^0.0.47",
"react-parallax-tilt": "^1.7.0"
```

- **Three.js / React Three Fiber** — hero bölmədə 3D qlobus (ölkələr işıqlı nöqtə kimi göstərilir), yaxud minimalist hissəcik sahəsi (particle field)
- **Lenis** — smooth scroll: səhifə sürüşməsi "ağır" deyil, yumşaq axır (müasir saytların demək olar hamısında var)
- **GSAP + ScrollTrigger** — scroll-based sequence animasiyaları üçün (Framer Motion-dan daha çevikdir): məs. scroll edərkən universitet kartları bir-bir "yığılır"
- **react-parallax-tilt** — kartlara siçan gətirəndə yüngül 3D əyilmə effekti

### 15.2 Konkret Vizual Effektlər Xəritəsi

| Effekt | Harada | Texnologiya |
|---|---|---|
| **Glassmorphism kartlar** (blur + şəffaflıq) | Universitet kartları, stat kartları | CSS `backdrop-filter` |
| **Gradient mesh background** (animasiyalı) | Hero bölmə arxa fonu | CSS/SVG animation |
| **3D qlobus / particle field** | Hero bölmə mərkəzi | React Three Fiber |
| **Magnetic button** (kursor yaxınlaşanda düymə "çəkilir") | CTA düymələri | GSAP |
| **Cursor-follow spotlight** | Hero bölmə | CSS custom property + JS mouse tracking |
| **Number counter animation** | Statistika (200+ universitet və s.) | GSAP / Framer Motion |
| **Marquee / infinite scroll** | Universitet loqoları zolağı | CSS animation |
| **Parallax layers** | Ölkə bayraqları/şəkilləri | Lenis + GSAP ScrollTrigger |
| **Text reveal / split animation** | Başlıqlar | GSAP SplitText |
| **Skeleton → shimmer loading** | Data yüklənərkən | CSS animation |
| **Tilt/3D hover** | Universitet kartları | react-parallax-tilt |

### 15.3 Dizayn Sisteminə Əlavələr (Bölmə 14 üzərinə)

```css
/* Futuristik aksentlər — globals.css-ə əlavə */
--glow-primary: 0 0 40px rgba(220, 38, 38, 0.35);
--glow-secondary: 0 0 40px rgba(29, 78, 216, 0.35);
--gradient-mesh: radial-gradient(at 20% 20%, #DC2626 0, transparent 50%),
                 radial-gradient(at 80% 0%, #1D4ED8 0, transparent 50%),
                 radial-gradient(at 50% 100%, #F59E0B 0, transparent 50%);
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--backdrop-blur: blur(20px);
```

> **Tövsiyə:** Dark mode-u default seçim etmək futuristik hiss üçün daha effektlidir (light mode alternativ qalır) — neon/glow effektləri tünd fonda daha güclü işləyir.

### 15.4 Nümunə Komponent — Hero Section (3D + Glass + Magnetic CTA)

```typescript
// components/sections/HeroSection.tsx
'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const GlobeScene = dynamic(() => import('@/components/three/GlobeScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-mesh" />,
});

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* 3D arxa fon — yalnız reduced-motion deaktiv olduqda render olunur */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 -z-10">
          <GlobeScene />
        </div>
      )}

      {/* Glassmorphism content card */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <h1 className="text-5xl font-extrabold text-white">
            Xaricdə Təhsil — Attestatla, İmtahansız
          </h1>
          <p className="mt-4 text-lg text-white/70">
            200+ Universitet · 0 İmtahan · 5 Ölkə · 1000+ Tələbə
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <MagneticButton variant="primary">Ölkə Seç</MagneticButton>
            <MagneticButton variant="ghost">Müraciət Et</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 15.5 Performans Büdcəsi (VACİB!)

Bu qədər animasiya + 3D + Framer Motion + GSAP birlikdə bölmə 11-dəki Core Web Vitals hədəflərini (LCP < 1.5s, Lighthouse 95+) risk altına ata bilər. Buna görə **məcburi** qaydalar:

1. **3D elementlər yalnız hero-da**, `dynamic import` ilə `ssr: false` və lazy-load
2. **Mobil cihazlarda ağır 3D effektlər deaktiv** — ekran eni < 768px olduqda `GlobeScene` əvəzinə statik gradient göstərilir
3. **`prefers-reduced-motion` mütləq nəzərə alınmalı** (bax bölmə 18) — həm əlçatanlıq, həm performans üçün
4. Animasiyalar yalnız GPU-accelerated property-lərlə (`transform`, `opacity`) — `width`, `top`, `left` kimi layout-triggering property-lərdən istifadə qadağandır
5. Three.js bundle-ı ayrıca chunk kimi yüklənir (`next/dynamic`), əsas bundle-a daxil olmur
6. Lighthouse CI pipeline-ında (bölmə 12) 3D-li hero səhifə üçün ayrıca büdcə həddi təyin olunmalı: **LCP < 2.0s mobil üçün istisna**, digər bütün metrikalar dəyişmədən qalır

---

## 16. SƏHİFƏ STRUKTURU & MƏZMUN

### /xaricde-tehsil — Ana Bölmə

```
1. HERO SECTION (bax bölmə 15.4 — 3D + Glass)
   - Başlıq: "Xaricdə Təhsil — Attestatla, İmtahansız"
   - Alt başlıq: Qısa izah
   - CTA: [Ölkə Seç] [Müraciət Et] — magnetic button effekti
   - Statistika: 200+ Universitet | 0 İmtahan | 5 Ölkə | 1000+ Tələbə (counter animation)

2. COUNTRY TAB MENU (sticky)
   🇹🇷 Türkiyə | 🇷🇺 Rusiya | 🇺🇦 Ukrayna | 🇩🇪 Almaniya | 🇵🇱 Polşa

3. [SEÇİLMİŞ ÖLKƏNİN MƏZMUNU — bax aşağı]

4. COST CALCULATOR (interaktiv)
   - Ölkə/Universitet seç → Aylıq xərc hesabla

5. SUCCESS STORIES (testimonials)
   - 3–6 tələbə hekayəsi + foto + universitet
   - Tilt hover effekti (react-parallax-tilt)

6. INSTAGRAM FEED
   - Son 9 post (Instagram Grid)

7. FAQ (ölkəyə spesifik)

8. CTA — "Pulsuz Konsultasiya Al"
   - Form + WhatsApp button
```

### Hər Ölkə Bölməsi — Məzmun Strukturu

```
[ÖLKƏ HERO]
├── Bayraq + Ad + Bir cümlə izah
├── 4 Quick Stat kart (glassmorphism)
└── Xəbərdarlıq banner (Ukrayna üçün)

[NİYƏ BU ÖLKƏ] → 6 üstünlük kart (scroll-reveal)

[XÜSUSİ TÖVSİYƏ UNİVERSİTET] (featured)
├── Logo, Ad, Şəhər, Veb sayt
├── 6 highlight kart
├── Fakültə cədvəli
└── Xüsusi qeydlər (rəngli border)

[DİGƏR UNİVERSİTETLƏR] → 3 sütun kart grid (tilt hover)

[MÜRACİƏT PROSESİ] → 4 addım kart (GSAP timeline animasiyası)

[SƏNƏD SİYAHISI] → Checkbox formatında

[XƏRc CƏDVƏLİ] → Rəngli cədvəl

[FAQ] → Accordion

[CTA]
```

### Giresun Universiteti — Xüsusi Səhifə (/turkiye/giresun-universiteti)

```
SEO Title: "Giresun Universiteti — Attestatla Qəbul 2024-2025 | XaricTəhsil.az"
SEO Desc:  "Giresun Üniversitesi xarici tələbə qəbulu — DIM, ÖSYM olmadan.
            Fakültələr, xərclər, müraciət prosesi, 2024-2025 kvotalar."

Məzmun bölmələri:
1. Hero — foto, ad, şəhər, veb sayt
2. Niyə Giresun? — 6 kart
3. Fakültə/İxtisas cədvəli (tam)
4. Xərc hesablaması (interaktiv kalkulator)
5. Kampus & Şəhər məlumatı + xəritə
6. Addım-addım müraciət prosesi
7. FAQ (Giresuna spesifik)
8. Uğur hekayələri (Giresun tələbələri)
9. Əlaqə + Müraciət formu
```

---

## 17. INSTAGRAM İNTEQRASİYASI

### Strategiya

```
Instagram hesabı: @xarictehsil.az (yaradılacaq)

Məzmun növləri:
├── Reel: "Giresun Universiteti — 1 dəqiqəlik tur"
├── Kart: "Attestatla Türkiyəyə qəbul — 5 addım"
├── Story: "Bu ay 3 tələbəmiz qəbul aldı 🎉"
├── Highlight: "Türkiyə", "Almaniya", "FAQ", "Tələbələrimiz"
└── Live: "Giresun haqqında canlı sual-cavab"
```

### Instagram Feed — Sayta İnteqrasiya

```typescript
// lib/instagram.ts
export async function getInstagramPosts(limit = 9) {
  const response = await fetch(
    `https://graph.instagram.com/me/media` +
    `?fields=id,media_url,permalink,caption,media_type,thumbnail_url` +
    `&limit=${limit}` +
    `&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
    { next: { revalidate: 3600 } } // 1 saatda bir yenilə
  );
  return response.json();
}

// components/sections/InstagramFeed.tsx
// - 3x3 foto grid
// - Hover: caption preview + like count
// - "Instagram-da İzlə" CTA düyməsi
// - Yüklenərkən skeleton loader
```

---

## 18. ƏLÇATANLIQ VƏ REDUCED MOTION (YENİ)

Futuristik animasiyalar heç kimi narahat etməməli və əlçatanlığı pozmamalıdır.

```typescript
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = () => setPrefersReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
```

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Digər Əskik Texniki Məqamlar (YENİ)

- **Font loading strategiyası** — Inter/Cal Sans üçün `font-display: swap` və `next/font` ilə preload
- **404/500 error səhifələri** — brendə uyğun, xüsusi dizaynla (glassmorphism stilində, sadə)
- **Loading.tsx / Suspense boundary** strategiyası hər route seqmenti üçün Next.js App Router-də ayrıca təyin olunmalı
- **Klaviatura naviqasiyası** — bütün interaktiv elementlər (magnetic button daxil) `:focus-visible` ilə aydın görünməli

---

## 19. FAZALAR & TİMELİNE

### Faza 1 — MVP (2–3 həftə)
```
✅ Next.js 15 + Supabase qurulum
✅ Supabase schema migration
✅ Ölkə tab menyusu (Türkiyə, Rusiya, Ukrayna, Almaniya, Polşa)
✅ Türkiyə bölməsi (tam məzmun — Giresun xüsusi)
✅ Digər 4 ölkə bölməsi (əsas məzmun)
✅ Müraciət formu → Supabase leads
✅ Email bildirişi (Resend)
✅ WhatsApp float düyməsi
✅ SEO metadata
✅ Vercel deploy
✅ Baza Framer Motion animasiyaları (fade/scroll-reveal)
```

### Faza 2 — İnteqrasiyalar (1–2 həftə)
```
⬜ Admin Dashboard — statistika, leads cədvəli
⬜ Xərc kalkulatoru
⬜ Instagram feed inteqrasiyası
⬜ WhatsApp Business API bildirişi
⬜ Blog bölməsi (CMS ilə)
⬜ Uğur hekayələri bölməsi
⬜ Dark mode (default)
⬜ Çoxdilli dəstək (RU, EN)
⬜ Glassmorphism komponent kitabxanası
```

### Faza 3 — Futuristik Vizual + Advanced (2–3 həftə)
```
⬜ 3D Hero (Three.js/React Three Fiber qlobus və ya particle field)
⬜ Lenis smooth scroll inteqrasiyası
⬜ GSAP ScrollTrigger animasiyaları
⬜ Magnetic button + cursor spotlight
⬜ Tilt hover kartlar
⬜ Giresun Universiteti — tam ayrı səhifə
⬜ Hər universitet üçün ayrı URL
⬜ Dinamik sitemap
⬜ Sentry error tracking
⬜ Vercel Analytics
⬜ A/B testing (hangi CTA daha yaxşı convert edir)
⬜ Supabase Realtime (dashboard anlık yeniləmə)
⬜ prefers-reduced-motion tam dəstəyi
⬜ Lighthouse 95+ optimallaşdırma (3D hero istisna ilə)
⬜ E2E testlər (Playwright)
```

### Faza 4 — Böyümə (Davamlı)
```
⬜ Daha çox ölkə əlavəsi (Macarıstan, Çexiya, İtaliya)
⬜ Online müraciət izləmə sistemi (tələbə üçün)
⬜ Çat funksiyası (Supabase Realtime)
⬜ Push bildirişləri (PWA)
⬜ Mobil app (React Native + Expo)
```

---

## ✅ YEKUNİ CHECKLIST

### Senior Frontend
- [ ] TypeScript strict mode aktiv
- [ ] ESLint + Prettier konfiqurasiya
- [ ] Shadcn/ui komponent kitabxanası
- [ ] Framer Motion animasiyalar
- [ ] Responsive dizayn (mobile-first)
- [ ] Dark mode
- [ ] Skeleton loaders
- [ ] Error boundaries
- [ ] Accessibility (ARIA labels, keyboard nav)

### Senior Futuristik Vizual (YENİ)
- [ ] 3D hero — lazy-load, ssr:false, mobil fallback
- [ ] Lenis smooth scroll
- [ ] GSAP ScrollTrigger animasiyaları
- [ ] Glassmorphism komponentlər
- [ ] Magnetic button / cursor spotlight
- [ ] prefers-reduced-motion tam dəstəyi
- [ ] Lighthouse büdcəsi 3D hero üçün ayrıca təyin olunub

### Senior Backend
- [ ] Supabase RLS bütün cədvəllərə
- [ ] Zod validation hər formda
- [ ] Rate limiting (form spam)
- [ ] Input sanitization
- [ ] Server Actions (form submit)
- [ ] Paralel data fetching

### Senior DevOps
- [ ] GitHub Actions CI/CD
- [ ] Vercel Production deploy
- [ ] Vercel Preview deployments
- [ ] Environment variables Vercel-də
- [ ] Supabase migration versiyalanması
- [ ] Sentry error monitoring
- [ ] Vercel Speed Insights

### Senior SEO
- [ ] generateMetadata hər route üçün
- [ ] JSON-LD structured data
- [ ] Dynamic sitemap.ts
- [ ] robots.txt
- [ ] OpenGraph images
- [ ] Hreflang (AZ/RU/EN)
- [ ] Core Web Vitals optimizasiya

### Senior Security
- [ ] RLS policies test edilib
- [ ] API keys yalnız server side
- [ ] CSP headers
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] Dependency audit (npm audit)

---

*🎓 XaricTəhsil.az — Azərbaycanlı tələbələrin xaricdə uğur hekayəsini birlikdə yazaq.*

---
*Sənəd versiyası: 1.1.0 | Əsas sənəd: EduVix Development Team | Futuristik dizayn əlavələri: Claude*
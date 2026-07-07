# MegaGroup — Xaricdə Təhsil Mərkəzi: Vizual İctimai Sayt (MVP)

> **Tarix:** 2026-07-02
> **Mənbə spec:** `xaricdetehsil.md` (v1.1.0)
> **Alt-layihə:** 1 / 4 — Vizual ictimai sayt
> **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Shadcn/ui · Three.js/R3F · GSAP · Lenis

---

## 1. Məqsəd

Azərbaycanlı tələbələrə xaricdə təhsil imkanlarını (Türkiyə, Rusiya, Ukrayna, Almaniya, Polşa) futuristik, animasiyalı və peşəkar dizaynda təqdim edən ictimai sayt. Bu alt-layihə **vizual MVP**-dir: sayt Supabase-siz tam görünüşlü işləyir, lokal seed dataları ilə. Backend (CRM, auth, canlı inteqrasiyalar) sonrakı alt-layihələrə saxlanılır.

### Brend

- **Ana brend:** MegaGroup
- **Xidmət adı:** Xaricdə Təhsil Mərkəzi
- **Logoda:** MegaGroup
- **Başlıqlarda:** "MegaGroup — Xaricdə Təhsil Mərkəzi"
- **Instagram:** `@mega_xaricde_tehsil_merkezi` (https://www.instagram.com/mega_xaricde_tehsil_merkezi/)

> Qeyd: `xaricdetehsil.md` sənədindəki bütün "XaricTəhsil.az" / `@xarictehsil.az` istinadları bu alt-layihədə yuxarıdakı brendlə əvəz olunur.

---

## 2. Sahə (Scope)

### Daxildir

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 + Shadcn/ui qurulumu
- Futuristik vizual qat: Three.js/R3F (3D hero qlobus), GSAP (scroll animasiyalar), Lenis (smooth scroll), glassmorphism, magnetic düymələr, tilt kartlar, counter animasiyalar, text reveal
- Səhifələr:
  - Ana səhifə (`/`): hero (3D + glass) + ölkə tabları + xərc kalkulatoru + uğur hekayələri + Instagram CTA + FAQ + müraciət CTA
  - Ölkə bölməsi (`/xaricde-tehsil/[country]`): 5 ölkə (Türkiyə, Rusiya, Ukrayna, Almaniya, Polşa)
  - Universitet səhifəsi (`/xaricde-tehsil/[country]/[university]`): Giresun Universiteti tam məzmunlu xüsusi səhifə + digər universitetlər
  - Xərc kalkulatoru (`/hesabla`): statik data əsasında interaktiv
  - Müraciət forması (`/muraciet`): UI + Zod validasiya (göndərmə funksiyası placeholder)
- Lokal seed dataları: `src/data/` (countries, universities, testimonials, faqs, cost data)
- SEO: `generateMetadata` hər route, JSON-LD, `sitemap.ts`, `robots.txt`, OG şəkillər, hreflang altyapısı (AZ default)
- Dark mode (default), `prefers-reduced-motion` tam dəstəyi, performans büdcəsi
- Error/loading səhifələri: `error.tsx`, `not-found.tsx`, `loading.tsx`
- WhatsApp float düyməsi (link-only, API deyil)

### Xaricdir (sonrakı alt-layihələrə)

- **Alt-layihə 2 — Backend:** Supabase (auth, RLS, realtime), leads cədvəli, server actions (forma göndərmə), email (Resend), WhatsApp Business API
- **Alt-layihə 3 — Admin CRM:** Dashboard, leads cədvəli/kanban, universitet/ölkə/blog CMS, analitika, istifadəçi idarəetmə
- **Alt-layihə 4 — Genişlənmə:** Instagram Graph API canlı feed, çoxdilli RU/EN (altyapı bu mərhələdə qurulur), blog CMS, Sentry, Vercel Analytics, A/B test, PWA

### Mərkəzi Arxitektura Qərarı

Bu mərhələdə **data mənbəyi = lokal seed faylları** (`src/data/*.ts`). Tip interfeysləri (`src/types/`) Supabase şemasına uyğun hazırlanır ki, sonradan data mənbəyini əvəz edəndə yalnız fetch qatı dəyişsin, komponentlər toxunulmasın. Animasiya altyapısı (Framer Motion + GSAP + Lenis) qurulur; 3D hero `dynamic import` + `ssr:false` + mobil fallback ilə.

---

## 3. Texniki Stack

| Qat | Texnologiya |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Dil | TypeScript (strict) |
| Stil | Tailwind CSS v4, Shadcn/ui |
| 3D | three, @react-three/fiber, @react-three/drei |
| Animasiya | GSAP + ScrollTrigger, Framer Motion |
| Smooth scroll | Lenis, @studio-freight/react-lenis |
| Tilt | react-parallax-tilt |
| İkonlar | lucide-react |
| Validasiya | Zod, react-hook-form, @hookform/resolvers |
| Font | Inter, Cal Sans (next/font, font-display: swap) |
| Test | Vitest (unit), Playwright (E2E) |

---

## 4. Fayl Strukturu

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Root: fontlar, SmoothScrollProvider, dark mode
│   │   ├── page.tsx                # Ana səhifə
│   │   ├── xaricde-tehsil/
│   │   │   ├── page.tsx            # Ana bölmə
│   │   │   ├── [country]/
│   │   │   │   ├── page.tsx        # Ölkə səhifəsi (revalidate=3600)
│   │   │   │   └── [university]/page.tsx
│   │   │   ├── hesabla/page.tsx    # Xərc kalkulatoru
│   │   │   └── muraciet/page.tsx   # Müraciət forması
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── loading.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css
├── components/
│   ├── three/
│   │   ├── GlobeScene.tsx          # Hero 3D qlobus (ssr:false)
│   │   ├── ParticleField.tsx       # Arxa fon hissəcikləri
│   │   └── CanvasWrapper.tsx       # Lazy-load + Suspense sarğı
│   ├── motion/
│   │   ├── FadeInUp.tsx
│   │   ├── TextReveal.tsx
│   │   ├── CounterAnimation.tsx
│   │   ├── MagneticButton.tsx
│   │   └── SmoothScrollProvider.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── CountryTabs.tsx
│   │   ├── UniversityGrid.tsx
│   │   ├── CostCalculator.tsx
│   │   ├── SuccessStories.tsx
│   │   ├── InstagramCTA.tsx
│   │   ├── FAQSection.tsx
│   │   └── CTASection.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── StudyAbroadNav.tsx
│   │   └── WhatsAppFloat.tsx
│   └── ui/                         # Shadcn/ui + glassmorphism kartlar
├── data/
│   ├── countries.ts
│   ├── universities.ts
│   ├── testimonials.ts
│   ├── faqs.ts
│   └── cost-data.ts
├── types/
│   └── index.ts                    # Country, University, Testimonial, FAQ, Fee tipləri
├── lib/
│   ├── utils.ts
│   ├── seo.ts                      # generateMetadata helper
│   └── validations/
│       └── contact.schema.ts       # Zod schema
└── hooks/
    ├── useReducedMotion.ts
    └── useCountUp.ts
```

### İzolasiya Prinsipi

Hər komponentin tək məsuliyyəti: `GlobeScene` yalnız 3D, `SmoothScrollProvider` yalnız Lenis, `MagneticButton` yalnız maqnit effekti. Data komponentin içinə girmir — `src/data/`-dan prop kimi gəlir. Tip interfeysləri `src/types/`-da mərkəzləşdirilib. Bu, sonradan Supabase əvəz edəndə yalnız data mənbəyini dəyişdirməyi asanlaşdırır.
---

## 5. Səhifə Məzmun Strukturu

### Ana Səhifə (`/`)

1. **HERO SECTION** — 3D qlobus + glassmorphism kart + magnetic CTA düymələri
   - Başlıq: "Xaricdə Təhsil — Attestatla, İmtahansız"
   - Statistika: 200+ Universitet · 0 İmtahan · 5 Ölkə · 1000+ Tələbə (counter animasiya)
   - CTA: [Ölkə Seç] [Müraciət Et]
2. **COUNTRY TAB MENU** (sticky) — Türkiyə · Rusiya · Ukrayna · Almaniya · Polşa
3. **SEÇİLMİŞ ÖLKƏNİN MƏZMUNU** — hero, 4 quick stat, niyə bu ölkə, featured universitet, digər universitetlər grid
4. **COST CALCULATOR** — ölkə/universitet seç → aylıq xərc
5. **SUCCESS STORIES** — 3-6 tələbə hekayəsi (tilt hover)
6. **INSTAGRAM CTA** — "Instagram-da izlə" + statik grid placeholder
7. **FAQ** — accordion (ölkəyə spesifik)
8. **CTA** — "Pulsuz Konsultasiya Al" + WhatsApp düyməsi

### Ölkə Səhifəsi (`/xaricde-tehsil/[country]`)

- Ölkə hero (bayraq + ad + 4 quick stat glassmorphism kart)
- Niyə bu ölkə — 6 üstünlük kart (scroll-reveal)
- Featured universitet (logo, ad, şəhər, 6 highlight, fakültə cədvəli)
- Digər universitetlər — 3 sütun grid (tilt hover)
- Müraciət prosesi — 4 addım (GSAP timeline)
- Sənəd siyahısı — checkbox formatında
- Xərc cədvəli
- FAQ accordion
- CTA

### Giresun Universiteti (xüsusi səhifə)

- Hero (foto, ad, şəhər, veb sayt)
- Niyə Giresun? — 6 kart
- Fakültə/İxtisas cədvəli (tam)
- Xərc hesablaması (interaktiv)
- Kampus & şəhər məlumatı
- Addım-addım müraciət prosesi
- FAQ (Giresuna spesifik)
- Uğur hekayələri
- Müraciət formu

---

## 6. Dizayn Sistemi

### Rəng Palitrası (CSS variables)

```css
:root {
  --brand-primary:   #DC2626;    /* Qırmızı */
  --brand-secondary: #1D4ED8;    /* Mavi */
  --brand-accent:    #F59E0B;    /* Qızılı */
  --success: #16A34A; --warning: #D97706; --danger: #DC2626; --info: #2563EB;
}
.dark {
  --background: #0F172A;  --foreground: #F1F5F9;
  --card: #1E293B;        --border: #334155;
}
/* Futuristik aksentlər */
--glow-primary: 0 0 40px rgba(220, 38, 38, 0.35);
--glow-secondary: 0 0 40px rgba(29, 78, 216, 0.35);
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
```

> Dark mode default seçimdir — neon/glow effektləri tünd fonda daha güclü işləyir.

### Tipoqrafiya

- Sans: Inter (next/font, swap)
- Heading: Cal Sans
- h1: 48/56px weight 800 · h2: 32/40px 700 · h3: 24/32px 600 · body: 16/24px 400

### Vizual Effektlər Xəritəsi (performans büdcəsi ilə)

| Effekt | Texnologiya | Mobil |
|---|---|---|
| 3D qlobus hero | R3F, `ssr:false` | ❌ → statik gradient |
| Smooth scroll | Lenis | ✅ (zəif cihazlarda deaktiv) |
| Scroll-reveal | GSAP ScrollTrigger | ✅ sadələşdirilmiş |
| Magnetic button | GSAP + mouse tracking | ❌ → sadə hover |
| Glassmorphism kartlar | CSS `backdrop-filter` | ✅ |
| Tilt hover | react-parallax-tilt | ❌ → sadə shadow |
| Counter animasiya | GSAP/Framer Motion | ✅ |
| Text reveal | GSAP SplitText | ✅ |
| Gradient mesh background | CSS/SVG animation | ✅ |

---

## 7. Data Axını

```
src/data/*.ts (statik seed) → Server Component (fetch) → Client Component (prop)
                                         ↑
                              src/types/ ilə tip təhlükəsizliyi
```

Tiplər: `Country`, `University`, `Faculty`, `UniversityFee`, `Testimonial`, `FAQ`, `CostData`. Bu tiplər Supabase şemasına uyğun hazırlanır (`xaricdetehsil.md` bölmə 5). Sonradan `src/data/` əvəzinə `src/lib/supabase/` qoyulanda eyni tiplər saxlanacaq.

---

## 8. Əlçatanlıq & Reduced Motion

```typescript
// hooks/useReducedMotion.ts
// (prefers-reduced-motion: reduce) → bütün animasiyalar deaktiv
```

- 3D hero deaktiv → statik gradient
- GSAP/Lenis animasiyalar 0.01ms
- Smooth scroll deaktiv
- Bütün interaktiv elementlər `:focus-visible` ilə aydın görünür
- Klaviatura naviqasiyası tam dəstək

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
---

## 9. Performans Büdcəsi

| Metrika | Hədəf | İstisna |
|---|---|---|
| LCP | < 1.5s | 3D hero səhifə: < 2.0s mobil |
| FID/INP | < 100ms | — |
| CLS | < 0.05 | — |
| Lighthouse | 95+ | 3D hero səhifə: performans 90+ |

**Məcburi qaydalar:**
1. 3D yalnız hero-da, `dynamic import` + `ssr:false` + lazy-load
2. Mobil (< 768px) — `GlobeScene` əvəzinə statik gradient
3. `prefers-reduced-motion` mütləq nəzərə alınır
4. Animasiyalar yalnız GPU-accelerated property-lərlə (`transform`, `opacity`)
5. Three.js ayrıca chunk (`next/dynamic`), əsas bundle-a daxil deyil

---

## 10. Error Handling & SEO

### Error Handling

- `error.tsx` — glassmorphism stilində 500 səhifə
- `not-found.tsx` — 404, brendə uyğun
- `loading.tsx` — skeleton/shimmer hər route seqmentinə
- Forma — Zod validasiya (UI dərhal reaksiya; göndərmə placeholder)

### SEO

- `generateMetadata` hər route (title, description, OG, Twitter, hreflang)
- JSON-LD: `EducationalOrganization`, `FAQPage`, `BreadcrumbList`
- `sitemap.ts` dinamik (ölkə + universitet + statik səhifələr)
- `robots.txt`
- OG şəkillər (1200×630)
- Hreflang altyapısı (AZ default; RU/EN sonrakı alt-layihə)
- Əsas açar sözlər: "xaricdə təhsil", "attestatla türkiyəyə qəbul", "giresun universiteti", "imtahansız xaricə getmək"

---

## 11. Test Strategiyası

- **Vitest (unit):** data tipləri, Zod validasiya, kalkulator hesablama, SEO helper
- **Playwright (E2E):** hero görünür, ölkə tab keçidi işləyir, forma validasiya, mobil fallback (3D yox), 404 səhifə
- **Lighthouse CI:** 3D hero istisna ilə büdcə (bölmə 9)

---

## 12. Fazalar (bu alt-layihə daxilində)

1. **Qurulum** — Next.js 15, Tailwind v4, Shadcn/ui, fontlar, dark mode, folder strukturu
2. **Data qatı** — tiplər, seed dataları (5 ölkə, universitetlər, Giresun tam, testimonials, FAQ, cost)
3. **Vizual altyapı** — SmoothScrollProvider, useReducedMotion, FadeInUp, TextReveal, Counter, MagneticButton, glassmorphism UI
4. **3D hero** — GlobeScene, ParticleField, CanvasWrapper, mobil fallback
5. **Səhifələr** — ana səhifə, ölkə bölmələri, universitet səhifələri, kalkulator, forma
6. **SEO** — metadata, JSON-LD, sitemap, robots, OG
7. **Error/loading** — 404, 500, skeletonlar
8. **Test** — Vitest unit, Playwright E2E

---

## 13. Uğur Kriteriyaları

- [ ] Sayt `npm run dev` ilə Supabase-siz tam görünüşlü işləyir
- [ ] 3D hero desktop-da görünür, mobil-da gradient fallback
- [ ] 5 ölkə bölməsi + Giresun tam məzmunlu səhifə
- [ ] Xərc kalkulatoru statik data ilə işləyir
- [ ] Müraciət forması Zod validasiya ilə reaksiya verir (göndərmə placeholder)
- [ ] Dark mode default, light mode alternativ
- [ ] `prefers-reduced-motion` bütün animasiyaları deaktiv edir
- [ ] SEO metadata, JSON-LD, sitemap, robots mövcuddur
- [ ] 404/500/loading səhifələri brendə uyğun
- [ ] Lighthouse: 3D hero istisna ilə 90+, digər səhifələr 95+
- [ ] Vitest + Playwright testləri keçir

---

*Bu spec `xaricdetehsil.md` (v1.1.0) əsasında hazırlanmışdır. Sonrakı alt-layihələr (backend, admin CRM, genişlənmə) ayrıca spec-lər alacaq.*
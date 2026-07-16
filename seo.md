# MegaGroup (megatehsil.com) — SEO + Texniki Performans Analizi

**Analiz tarixi:** 15 iyul 2026
**Analiz mənbələri:** lokal kod bazası (`MegaGroup-master`), canlı sayt (megatehsil.com), robots.txt, sitemap.xml, server-render olunmuş HTML
**Rollar:** Senior SEO · Senior Fullstack
**Miqyas:** Faza 1 (texniki render) + Faza 2 (performans). Off-page Faza 3-4 yalnız planlanır.

---

## 0. İcra Xülasəsi

Saytın **#1 sırada olmamasının 3 kök səbəbi** var və bunlar bir-birini gücləndirir:

1. **🔴 KRİTİK — Texniki render boğazı:** Server-render olunmuş HTML-də əsas məzmun (h1, ölkə kartları, FAQ, kalkulyator) **gizli `<div hidden id="S:0">` şablonunda** və skelet (animate-pulse) yerində durur. Googlebot-un ilk crawl-ı **boş skeletlər** görür. Bu, `loading.tsx` + top-level `await`-in nəticəsidir.
2. **🟠 Performans / Core Web Vitals:** `gsap` + `framer-motion` + `lenis` + `react-parallax-tilt` **hər səhifədə egerload** olunur → ağır client bundle → aşağı LCP/INP.
3. **🟠 Off-page / yeni domen:** Backlink və domain autoritet aşağıdır. Bu, kod xaricində, aylar alan işdir (bax: `docs/SEO-OFFPAGE.md`).

**Əsas hökm:** Kod bazasında `analiz.md`-də qeyd olunan təhlükəsizlik/backend problemləri **artıq həll edilib** (migrasiyalar 0004-0007, CSP, rate-limit, Turnstile, honeypot, admin guard). Amma **texniki SEO render problemi hələ də açıqdır** və yeni domen üçün xüsusilə kritikdir — çünki yeni/aşağı-authority domenlər Google-un **gecikmiş render növbəsində** deprioritized olunur. Texniki düzəliş təcili; off-page paralel aparılır.

---

## 1. Niyə Google-da #1 Deyil — Kök Səbəblər

### 1A. 🔴 Texniki Render Boğazı (ƏN KRİTİK)

**Simptom (canlı HTML-də müşahidə):** Server tərəfdən gələn HTML-də `<main>` içində `animate-pulse` skeletləri, real məzmun isə `<div hidden id="S:0">` və `<template id="B:0/B:1/B:2/B:3">` içində gizlədilmiş. `BAILOUT_TO_CLIENT_SIDE_RENDERING` markerləri var.

**Kök səbəblər (fayl:sətir):**

| Problem | Fayl:Sətir | İzah |
|---|---|---|
| Bütün səhifə Suspense sərhədinə bölünür | `src/app/[locale]/loading.tsx:1-13` | `loading.tsx` App Router-də implicit Suspense yaradır; bütün məzmun onun içində axır |
| Top-level await bütün məzmunu bloklayır | `src/app/[locale]/page.tsx:125-126` | `await getCountries(locale)` + `await getSiteContentMap(locale)` səhifənin yuxarısında |
| Skelet özü `animate-pulse` | `src/app/[locale]/page.tsx:76-78` | `SectionSkeleton` |
| 3 əlavə Suspense sərhədi (B:0/B:1/B:2) | `src/app/[locale]/page.tsx:203-206, 220-223, 266-269` | UniversitiesSection, StoriesSection, FaqSectionWithData |
| Statistika SSR-də "0" render olunur | `src/hooks/useCountUp.ts:14-17, 42-47` | `count` `start` (default `0`) ilə işə düşür; yalnız `IntersectionObserver` (threshold 0.3) işə düşəndə animasiya |
| FAQ cavabları SSR HTML-də **yoxdur** | `src/components/sections/FAQSection.tsx:36-50` | `openIdx` default `null` (`:11`) → `AnimatePresence` içində cavab `<p>` render olunmur; yalnız JSON-LD FAQPage var |
| Ölkə/kartlar `opacity:0` inline | `src/components/motion/FadeInUp.tsx:22-23` | `initial={{opacity:0, y:40}}` framer-motion tərəfindən inline style kimi SSR-ə düşür |

**Niyə bu yeni domen üçün xüsusilə kritikdir:**
- Google **iki mərhələli** indeksləyir: (1) dərhal xam HTML (skeletləri görür), (2) gecikmiş render növbəsi (günlər/həftələr)
- Yeni/aşağı-authority domenlər render növbəsində **deprioritized** olunur → məzmun həftələrlə indexlənməyə bilər
- Ağır JS bundle (bax 1B) render keçidini yavaşladır və xətalara meylli edir

**Düzəliş istiqaməti (Faza 1):** `loading.tsx`-i daralt və ya sil; top-level await-ləri `<Suspense>` içərisinə köçür; statistikanı SSR-də real dəyərlə render et; FAQ cavablarını SSR HTML-də saxla (CSS ilə gizlə, JS ilə aç); `FadeInUp`-da `initial`-i SSR-də tətbiq etmə (visibility ilə idarə et).

### 1B. 🟠 Performans / Core Web Vitals

**Ağır kitabxanaların istifadə və import strategiyası:**

| Kitabxana | İmport edən komponentlər | Strategiya |
|---|---|---|
| **three** + `@react-three/fiber` + `@react-three/drei` | `three/GlobeScene.tsx`, `three/CanvasWrapper.tsx`, `three/ParticleField.tsx`, `study-journey/Scene.tsx`, `study-journey/Globe.tsx` və s. | ✅ `dynamic({ssr:false})` ilə code-split (`HeroSection.tsx:16-31`, `StudyJourneyLazy.tsx:6-12`) |
| **gsap** | `HeroSection.tsx:5`, `StudyJourneySection.tsx:5`, `TextReveal.tsx:3`, `ScrollReveal.tsx:3`, `MagneticButton.tsx:3`, `ScrollParallax.tsx:3`, `SmoothScrollProvider.tsx:4` | ❌ **Egerload** — hər səhifədə (SmoothScrollProvider layout-da mount: `layout.tsx:145`) |
| **framer-motion** | `FadeInUp.tsx:2`, `FAQSection.tsx:3`, `WhatsAppFloat.tsx:2`, `ScrollToTop.tsx:4` | ❌ **Egerload** — demək olar hər səhifədə |
| **lenis** | `SmoothScrollProvider.tsx:3` | ❌ **Egerload**, hər səhifədə wheel scroll hijack (`:17-28`) |
| **react-parallax-tilt** | `UniversityCard.tsx:4`, `SuccessStories.tsx:3` | ❌ **Egerload**, yalnız bir neçə səhifədə işlədilir |

**Digər performans problemləri:**
- **Scroll hijacking:** `HeroSection.tsx:137` — `h-[210vh] sm:h-[230vh]` + sticky; `HeroSection.tsx:97-123` — GSAP ScrollTrigger `scrub: 0.4`. 110-130vh "ölü" scroll pinlənir.
- **StudyJourney placeholder:** `StudyJourneyLazy.tsx:6-12` — 450vh qara `<div>` SSR-də, real məzmun yalnız client-də.
- **FOUC (flash-of-unstyled):** `ScrollReveal.tsx:28-54` — `fromTo` `useEffect`-də tətbiq olunur → mətn görünən→gizlənən→açılan flash.
- `next.config.ts:14-23` `optimizePackageImports` aktivdir, amma bu tree-shake edir, gsap/framer-motion/lenis-i main bundle-dan **çixarmir**.

**Düzəliş istiqaməti (Faza 2):** gsap/framer-motion-dan yalnız birini saxla; `SmoothScrollProvider`-i mobil/reduced-motion-da deaktiv et; `react-parallax-tilt`-i dynamic import et; hero scroll hijack-i azalt; `ScrollReveal` FOUC-nu `useLayoutEffect`/CSS-initial ilə düzəlt.

### 1C. 🟠 Off-page / Yeni Domen (kod xaricində)

Bu, kod yazmaqla həll olunmur. Tam detal `docs/SEO-OFFPAGE.md`-dədir. Qısa:

- **Backlink/DR aşağı:** Rəqiblər (roofat.az, studylab.az, glc.edu.az, qebulol.az) illərdir autoritet toplayıb.
- **Google Business Profile claim edilməyib:** Local pack və brend axtarışı üçün kritik.
- **Domen yeni:** Yeni URL strukturunu Google tam etibarlı saymaq üçün 3-6 ay tələb edir.
- **Universitet `.edu` backlink-ləri yoxdur:** Ən güclü DR siqnalı.
- **Sosial profillər natamam:** YouTube/Facebook/LinkedIn/Telegram yoxdur.

---

## 2. Artıq Yaxşı Olanlar (Təkrar Etmə)

Bu sahələrdə dəyişiklik lazım deyil:

| Element | Vəziyyət | Mənbə |
|---|---|---|
| Canonical URL-lər | ✅ Hər səhifədə | `page.tsx:56`, `[country]/page.tsx:56` və s. |
| Hreflang (az/ru/en/x-default) | ✅ Düzgün | `i18n/routing.ts:1-11`, sitemap |
| JSON-LD schema | ✅ EducationalOrganization, ProfessionalService, BreadcrumbList, FAQPage, BlogPosting, ItemList, EducationalOccupationalProgram | `layout.tsx:78-143`, `bloq/[slug]/page.tsx:105-108` |
| sitemap.xml | ✅ Dinamik, hər səhifə + hreflang alternates | `src/app/sitemap.ts:1-75` |
| robots.txt | ✅ Təmiz, sitemap referansı | `src/app/robots.ts:1-9` |
| OG / Twitter cards | ✅ Dinamik OG image (per locale) | `opengraph-image.tsx:1-97` |
| GSC + Yandex doğrulanmış | ✅ | `layout.tsx` verification meta |
| Təhlükəsizlik (0004-0007) | ✅ Admin RLS, indekslər, soft delete, audit log | `supabase/migrations/` |
| CSP + security headers | ✅ | `next.config.ts:32-67` |
| Rate-limit + Turnstile + Honeypot | ✅ | `rate-limit.ts`, `turnstile.ts`, `applications.ts:15-18` |
| Admin auth guard | ✅ Defense-in-depth | `middleware.ts:38-82` |
| Data-layer cache | ✅ `unstable_cache` + `createCacheClient` (cookiesiz) | `src/lib/data/*.ts` |
| Blog məzmun dərinliyi | ✅ **11 məqalə**, hər biri 18 dəqiqə oxu | `src/data/articles.ts:17-29` |
| ISR | ✅ `revalidate = 3600` | `page.tsx:27`, `[country]/page.tsx:21` |

---

## 3. Faza-faza Yol Xəritəsi

### 🔴 FAZA 1 — Texniki Render Düzəlişi (1-2 gün) — KOD DƏYİŞİKLİYİ — ✅ TAM BAŞA ÇATDIB (15 iyul 2026)

**Məqsəd:** Googlebot ilk crawl-da real məzmunu (h1, kartlar, FAQ, statistika) görsün.

> **ƏSAS KƏŞF (icra zamanı):** Kök səbəb `loading.tsx` deyil, **səhifələrin `ƒ (Dynamic)` olması** idi. next-intl konfiqurasiyası səbəbindən bütün məzmun səhifələri dinamik render olunurdu → `{children}` avtomatik Suspense seqmentinə (gizli `<div hidden id="S:0">`) düşürdü. **Həll: `export const dynamic = "force-static"`** → bütün məzmun səhifələri `● (SSG)` oldu, gizli seqmentlər tam yox oldu. Doğrulanıb: `<h1>` və bütün məzmun birbaşa statik HTML-də.

- [x] **1.0 (KÖK SƏBƏB) `force-static`:** home, ölkə, universitet, bloq, haqqimizda səhifələrinə `export const dynamic = "force-static"` → `ƒ (Dynamic)` → `● (SSG)`. Forma səhifəsi (`muraciet`) dinamik qaldı (rate-limit üçün). **Doğrulama:** build route table `●`, HTML-də S:0/B:0 yoxdur.
- [x] **1.1 `loading.tsx` silindi:** bütün səhifəni əhatə edən skeleton tam yoxdur (route-level Suspense aradan qaldırıldı).
- [x] **1.2 Top-level await + Suspense çıxarıldı:** `page.tsx` — Hero dərhal render; HomeBody və alt bölmələr (UniversitiesSection/StoriesSection/FaqSectionWithData) birbaşa inline (SSG-də build zamanı resolve).
- [x] **1.3 Statistika SSR real:** `useCountUp.ts` — initial `end` ilə işə düşür. SSR: `200+ Universitet, 0 İmtahan, 7 Ölkə, 1.000+ Tələbə` (əvvəl hamısı "0").
- [x] **1.4 FAQ cavabları SSR HTML-də:** `FAQSection.tsx` — CSS grid accordion (`0fr`→`1fr`), cavab həmişə DOM-da (framer-motion AnimatePresence çıxarıldı, animasiya CSS transition ilə qorunur).
- [x] **1.5 `FadeInUp` SSR-də görünən:** `FadeInUp.tsx` — `useSyncExternalStore` ilə mount yoxlaması; SSR-də `opacity:1` (inline `opacity:0` yoxdur), animasiya yalnız client-də.
- [x] **1.6 Universitet səhifəsi:** hreflang (az/ru/en/x-default) + BreadcrumbList JSON-LD + dərinləşdirilmiş deskripsiya (3 dildə) əlavə edildi.

**Doğrulama (yerinə yetirildi):** `type-check` ✅, `lint` (yeni xəta yox) ✅, `build` 113 səhifə ✅. Canlı HTML yoxlanışı: `<h1>` S:0-dan əvvəl, statistika real, `id="S:0"` və `id="B:0"` = **tapılmadı** (tam statik).

### 🟠 FAZA 2 — Performans / Bundle (2-3 gün) — KOD DƏYİŞİKLİYİ

**Məqsəd:** Core Web Vitals — LCP < 2.5s, CLS < 0.1, INP < 100ms (mobil).

- [ ] **2.1 gsap VƏ ya framer-motion-dan birini seç:** İkisi eyni işi görür. Main bundle-dan birini çıxar. Tövsiyə: framer-motion saxla (SSR-dostu), gsap-ı tədricən çıxar. ⏭️ **TƏXİRƏ SALINIB:** hero + ölkə (StudyJourney) scroll animasiyaları birbaşa gsap ScrollTrigger-asılıdır (`HeroSection.tsx:97-123`, `StudyJourneySection.tsx:74`). gsap-ı çıxarmaq bu imza animasiyaları qırar — yalnız hero/journey-ə toxunmayan komponentlərdən (ScrollReveal və s.) tədricən çıxarmaq olar.
- [ ] **2.4 Hero scroll hijack azalt:** `HeroSection.tsx:137` — `h-[210vh]`-i `min-h-[100dvh]`-ə endir; ScrollTrigger scrub-i sadələşdir. 110-130vh "ölü" scroll qalmasın. ⏭️ **TƏXİRƏ SALINIB:** hero-nun iki-fazalı scroll hekayəsi (kürə böyüməsi + ölkə etiketləri + exit dissolve) bu 210vh scroll otağına bağlıdır. Azaltmaq imza animasiyanı qırar.

**Doğrulama:** `pagespeed.web.dev/competitors` mobil LCP/CLS/INP + Lighthouse Performance ≥ 90.

### 🟡 FAZA 3 — Off-page + GBP (1-4 həftə) — KOD XARİCİNDƏ

Tam detal: `docs/SEO-OFFPAGE.md`. Bu fazanı **mən kodda tətbiq edə bilmirəm** — marketing/əməliyyat işidir.

- [ ] Google Business Profile claim (kateqoriya: Educational Consultant), NAP schema ilə eyni
- [ ] 20+ 5-ulduz rəy (keçmiş tələbələrdən)
- [ ] İlk backlink dalğası: contact.az, baki.biz, təhsil kataloqları
- [ ] Sosial profillər: YouTube, Facebook, LinkedIn, Telegram — eyni NAP + link
- [ ] Universitet `.edu` təmsilçi backlink-ləri (ən güclü siqnal)
- [ ] Aylıq 2-4 qonaq məqalə, açar sözlü anchor text

### 🔵 FAZA 4 — Məzmun Genişləndirmə (Davamlı) — KOD XARİCİNDƏ

- [ ] Hər ölkə üçün əlavə 3-4 dərin məqalə (long-tail açar sözlər)
- [ ] Blog-ı RU/EN-yə aç (hazırda `bloq/page.tsx:36` AZ-only `notFound()`)
- [ ] Ölkə səhifələrinin məzmununu RU/EN-yə tərcümə et (`[country]/page.tsx:91` `getCountryContent` AZ-only)
- [ ] Universitet tərəfdaşlığı məzmunu, tələbə hekayələri video/videonun yazısı

---

## 4. Gözlənilən Timeline

| Mərhələ | Müddət | Gözlənilən nəticə |
|---|---|---|
| **Faza 1 (texniki render)** | 1-2 gün | Googlebot real məzmunu indeksləyir; "0" / boş skelet problemi qalxır |
| **Faza 2 (performans)** | 2-3 gün | Core Web Vitals yaşıl; Lighthouse Performance ≥ 90 |
| GBP + sosial profillər | 1 həftə | Local pack, brend axtarışı |
| İlk backlink dalğası | 2-4 həftə | DR artımı |
| Universitet tərəfdaş linkləri | 1-3 ay | Əhəmiyyətli DR artımı |
| Aşağı rəqabətli açar sözlərdə top 5 (məs. "qazaxıstanda təhsil") | 2-4 ay | Real trafik başlanğıcı |
| Yüksək rəqabətli açar sözlərdə top 5 ("xaricdə təhsil") | 4-6 ay | Davamlı məzmun + backlink |
| Tam #1 | 6-12 ay | Mütəmadi məzmun + off-page davamlılığı |

> **Vacib:** Faza 1-2 (kod) təcili edilsə, Faza 3-4 (off-page) işləyərkən sayt hər crawl-da düzgün indexlənir. Əks halda off-page səyləri "boş skelet" indeksləməyə xərclənər.

---

## 5. Digər AI Analizi ilə Fakt Yoxlaması

Aşağıdakı cədvəl ikinci bir analizlə ziddiyyətli iddiaları kod əsasında doğrulayır.

| # | Digər AI-nin iddiası | Kod əsasında doğruluq | Sübut |
|---|---|---|---|
| 1 | "Saytda 2-3 bloq məqaləsi var" | ❌ **YANLIŞ** — **11 məqalə** var | `src/data/articles.ts:17-29`; sitemap-də 11 bloq URL |
| 2 | "Texniki render problemi aşağı prioritetdir, Google JS render edir" | ⚠️ **YANILDIRICI** — yeni domen üçün kritikdir | `loading.tsx:1-13` + `page.tsx:125-126`; Google render növbəsi yeni domenlərdə deprioritized |
| 3 | "3D/animasiya artıq lazy-load olunub ✅" | ⚠️ **YARIMDOĞRU** — yalnız three.js lazy; gsap/framer-motion/lenis/parallax-tilt hər səhifədə egerload | `layout.tsx:145` (SmoothScrollProvider); import cədvəli bölmə 1B |
| 4 | "Backlink/DR/GBP kritikdir" | ✅ **DOĞRU** | `docs/SEO-OFFPAGE.md` razılaşır |
| 5 | "Timeline 4-6 ay" | ✅ **DOĞRU** | Realist |
| 6 | "Universitet `.edu` backlink ən güclü siqnaldır" | ✅ **DOĞRU** | SEO konsensusu |
| 7 | "Fullstack böyük struktur problemi yoxdur" | ⚠️ **YARIMDOĞRU** — təhlükəsizlik üçün doğrudur (0004-0007 bitib), amma render arxitekturası struktur problemidir | bölmə 1A |
| 8 | Gözardı: FAQ cavabları SSR-də yox | ❌ **GÖZARDI** | `FAQSection.tsx:36-50` |
| 9 | Gözardı: ölkə kartları `opacity:0` | ❌ **GÖZARDI** | `FadeInUp.tsx:22-23` |
| 10 | Gözardı: statistika "0" render | ❌ **GÖZARDI** | `useCountUp.ts:14-17` |

**Sintez:** Digər AI off-page strategiyasında haqlıdır və `docs/SEO-OFFPAGE.md` keyfiyyətlidir. Amma (a) məqalə sayında faktiki səhv edib, (b) texniki render problemini yanlış olaraq aşağı prioritetə endirib, (c) ağır bundle hər səhifədə olduğunu görə bilməyib. Həqiqət **hər iki analizin birləşməsidir**: texniki render (Faza 1-2) **və** off-page (Faza 3-4) paralel aparılmalıdır; ikisi də zəruri, heç biri tək başına kifayət deyil.

---

## 6. Təcili Hərəkət Siyahısı (Bu Həftə)

1. **Kod:** Faza 1 (texniki render) — `loading.tsx` + top-level await + SSR statistika/FAQ/FadeInUp
2. **Kod:** Faza 2 (performans) — gsap/framer-dən birini saxla, Lenis şərti, parallax-tilt dynamic
3. **Əməliyyat:** Google Search Console-da sitemap təqdim et, hreflang xətalarını yoxla
4. **Əməliyyat:** Google Business Profile claim et, NAP schema ilə eyniləşdir
5. **Əməliyyat:** Bing Webmaster Tools-a əlavə et (Yandex artıq var)
6. **Doğrulama:** `pagespeed.web.dev` + `search.google.com/test/rich-results` ilə ölç

---

*Bu sənəd lokal kod bazasının statik oxunması, canlı sayt HTML-i, robots.txt, sitemap.xml və iki müstəqil analizlə müqayisə əsasında hazırlanıb. Faza 1-2 kod dəyişiklikləri bu sənədin miqyası xaricindədir (yalnız planlanıb); Faza 3-4 kod xaricindədir.*

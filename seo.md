# megatehsil.com — Birləşmiş SEO Strategiyası və İş Planı

**Yaradılma tarixi:** 5 sentyabr 2026
**Mənbələr:** 2 müstəqil AI analizi (qebulol.az rəqib analizi + MegaTehsil tam SEO planı) + lokal kod bazası oxunuşu
**Rollar:** Senior SEO · Senior AEO · Senior AI
**Əsas məqsəd:** qebulol.az modelinin üstün tərəflərini (miqyas + struktur + təzəlik + daxili keçid şəbəkəsi) MegaGroup-un modern Next.js + Supabase bazasında **daha sistemli formada** qurmaq.

> **Əsas doktrina:** qebulol.az-ı kopyalamaq yox — onun strateji modelini (keyword cluster + silo struktur + programmatic universitet səhifələri) modern arxitektura ilə üstələmək. Məqsəd ana səhifəni #1 etmək deyil; **xaricdə təhsil** mövzusunda Azərbaycan dilində topical authority qurmaqdır.

---

## 0. İcra Xülasəsi — İki Analizin Sintezi

Hər iki analiz eyni nəticəyə gəlir: qebulol.az-ın üstünlüyü bir trik deyil, **5 sütunlu sistemdir**:

| # | Sütun | qebulol.az | MegaGroup (hazırda) | Prioritet |
|---|---|---|---|---|
| 1 | Programmatic məzmun miqyası | Yüzlərlə universitet səhifəsi | DB var, səhifə generasiyası var, məzmun genişlənməli | 🔴 P0 |
| 2 | Ölkə × alt-mövzu silo strukturu | Hər ölkədə 5-8 alt-səhifə | Ölkə səhifələri var, alt-səhifələr yoxdur | 🟠 P1 |
| 3 | Təzəlik siqnalları (cari il, modified_time) | Daim yenilənir | `dateModified` var, il avtomatizasiyası qismən | 🟠 P1 |
| 4 | Nəhəng daxili keçid şəbəkəsi | Məqalədə 30-40 link | Bölmə mövcuddur, kross-link sayı az | 🟡 P2 |
| 5 | Domen avtoriteti (yaş + backlink) | ~7 il | Yeni domen | ⏳ kod xaricində (`docs/SEO-OFFPAGE.md`) |

**Kod bazasında artıq hazırdır (təkrar etmə):** `generateMetadata` hər route-da, hreflang az/ru/en, dinamik sitemap (real lastModified ilə), JSON-LD (EducationalOrganization, FAQPage, BlogPosting, BreadcrumbList), `llms.txt` + `llms-full.txt`, GSC/Yandex verification. Bunlar rəqibdə **yoxdur** — bizim artıq əlimizdədir.

**Texniki risk:** Ağır JS bundle (gsap + framer-motion + lenis + parallax-tilt egerload) yeni domen üçün render/indeksləmə riskidir — hər məzmun böyütməsi bundan sonra bu əsada söykənir.

---

## 1. Hədəf Açar Sözlər və Cluster Sistemi

### 1.1 Əsas (money) açar sözlər

- xaricdə təhsil / xaricdə təhsil almaq / xaricdə təhsil mərkəzi / xaricdə təhsil şirkətləri
- xaricdə universitet / xaricdə bakalavr / xaricdə magistr / xaricdə tibb təhsili
- Türkiyədə təhsil / attestatla təhsil / imtahansız təhsil / tibb təhsili
- Türkiyə universitetləri / qəbul / təhsil haqqı
- Polşada / Almaniyada / Rusiyada / Gürcüstanda təhsil

### 1.2 Keyword → Səhifə xəritəsi (1 keyword = 1 səhifə)

```
XARİCDƏ TƏHSİL
│
├── /az/xaricde-tehsil                        → "xaricdə təhsil"
│   ├── /az/xaricde-tehsil/turkiye            → "türkiyədə təhsil"
│   │   ├── /turkiye/universitetler           → "türkiyə universitetləri"
│   │   ├── /turkiye/tibb                     → "türkiyədə tibb təhsili"
│   │   ├── /turkiye/attestatla-qebul         → "türkiyədə attestatla təhsil"
│   │   ├── /turkiye/tehsil-haqqi             → "türkiyədə təhsil haqqı"
│   │   ├── /turkiye/teqaud                   → "türkiyədə təqaüd"
│   │   ├── /turkiye/yasayis-xercleri         → "türkiyədə yaşayış xərcləri"
│   │   ├── /turkiye/[universitet]            → "{universitet adı} qəbul qiymətləri"
│   │   └── /turkiye/[ixtisas]                → "türkiyədə {ixtisas} təhsili"
│   ├── /polşa, /almaniya, /rusiya, /gürcüstan, /ukrayna, /qazaxıstan
│   └── (eyni alt-səhifə şablonu hər ölkəyə tətbiq)
└── /az/bloq/[məqalə]                         → uzun-quyruq informasiya sorğuları
```

**Qayda:** Hər cluster daxilində səhifələr yalnız bir-birinə və öz ölkə ana səhifəsinə link verir (silo). Keyword kannibalizasiya yoxdur.

### 1.3 Hər yazılış variantı mətndə (qebulol.az taktikası)

Azərbaycan dilində real axtarış variasiyaları mətn daxilində təbii işlənməlidir:
`atestatla/attestatla`, `tehsil/təhsil`, `qebul/qəbul`, `ne qederdir/nə qədərdir` — bunlar FAQ suallarına və mətnə inteqrasiya olunur. **`keywords` meta-tag-ına söykənmirik** — Google artıq onu saymır, mətn daxilindəki variantları sayır.

---

## 2. Səhifə Şablonları (Programmatic SEO)

### 2.1 Ölkə ana səhifəsi — `/az/xaricde-tehsil/[country]`

- Title: `{Ölkə}də Təhsil — Universitetlər, Qəbul və Təhsil Haqları {CARIİL}`
- H1: `{Ölkə}də Təhsil`
- H2-lər (qebulol.az silo şablonu): Üstünlüklər · Universitetlər · Dövlət/Özəl · Tibb · Attestatla qəbul · İmtahansız qəbul · Qəbul şərtləri · Təhsil haqqı · Yaşayış xərcləri · Təqaüd · Viza · FAQ
- Cari il **statik yazılmır** — server vaxtından avtomatik.
- Hər H2 alt-səhifəyə daxili keçiddir (bölmə 4).

### 2.2 Universitet səhifəsi — `/az/xaricde-tehsil/[country]/[university]`

Supabase-dən (`university.schema.ts` + `sync-universities.ts` artıq var) avtomatik generasiya. Şablon:

```
# {Universitet adı} {il}
## Universitet haqqında
## İxtisaslar / fakültələr (cədvəl)
## Təhsil haqqı (real DB rəqəmləri — ORIGINAL DATA üstünlüyü)
## Qəbul şərtləri / attestatla qəbul
## Lazım olan sənədlər
## Təhsil dili, Yataqxana, Yaşayış xərcləri
## Təqaüd
## Müraciət prosesi
## FAQ (8-10 sual, tam cümlə formasında)
## Əlaqəli universitetlər (8-12 internal link)
## Müraciət et (CTA)
```

JSON-LD: `EducationalOrganization` + `BreadcrumbList` + `FAQPage`.

### 2.3 İxtisas səhifəsi — `/az/xaricde-tehsil/[country]/[ixtisas]`

`/turkiye/tibb`, `/turkiye/huquq`, `/turkiye/menecment`... — hər ixtisas üçün: hansı universitetlər təklif edir (DB-dən), təhsil haqqı diapazonu (cədvəl), qəbul şərtləri, FAQ.

### 2.4 Blog məqalə şablonu

Hər məqalədə: Title → H1 → **Qısa cavab (40-60 söz, AEO üçün birbaşa çıxarılabilir cavab)** → Mündəricat → Əsas izah → Cədvəl → Real nümunələr → Sənədlər → Qiymətlər → FAQ (8-10 sual) → Əlaqəli məqalələr (8-12, kross-kateqoriya) → Müraciət CTA. Söz sayı intent-ə görə (500-3000+), süni şişirtmə yoxdur.


---

## 3. AEO / AI SEO (Senior AEO bölməsi)

AI Overviews ~45% axtarışda görünür və klikləri 58%-ə qədər azaldır — bu səbəbdən AEO ayrıca iş xəttidir:

1. **Qısa cavab bloku** — hər məqalə H1-dən dərhal sonra sualın 40-60 sözlük birbaşa cavabını verir (AI sistemləri tam mətni buradan çıxarır).
2. **FAQPage schema** — hər sual real axtarış sorğusu formatında (tam cümlə).
3. **`llms.txt` / `llms-full.txt`** — var, məzmun genişləndikcə yenilənməlidir.
4. **Tarixli məzmun** — `dateModified` AI sistemləri üçün güclü recency siqnalıdır; hər real məzmun yeniləməsində avtomatik yenilənməlidir (kosmetik dəyişiklik ilə tarix dəyişdirilmir — bölmə 6.3).
5. **Robots:** GPTBot, PerplexityBot, ClaudeBot, Google-Extended **bloklanmır** (blok = sitasiya yox). Yalnız təlim-only crawler-lar (CCBot) istəyə bağlı bloklana bilər.
6. **Maşın-oxunabilir cədvəllər** — təhsil haqqı/xərc məlumatları real `<table>` kimi (artıq başlanğıc var, universitet səhifələrində standartlaşdırılır).
7. **Bing Webmaster Tools** — ChatGPT/Copilot üçün vacib indeks; sitemap təqdim edilməlidir.

**Qadağan:** keyword stuffing (AI görünənliyini 10% azaldır), saxta məlumat, schema-da görünməyən məzmun.

---

## 4. Internal Linking Sistemi

- Hər ölkə səhifəsindən → öz alt-səhifələrinə + universitetlərə
- Hər universitet səhifəsindən → ölkə səhifəsi + ixtisas + təhsil haqqı + **8-12 "əlaqəli universitet"**
- Hər bloq məqaləsindən → ölkə ana səhifəsi + universitet səhifələri + **kross-kateqoriya** linklər (Türkiyə məqaləsindən Rusiya/Gürcüstan uyğun səhifəsinə — qebulol.az-ın PageRank yayma taktikası)
- BreadcrumbList hər səviyyədə: Ana səhifə › Xaricdə Təhsil › Türkiyə › {Universitet}

---

## 5. Trust / E-E-A-T (YMYL sahəsi — kritik)

1. **VÖEN + hüquqi ünvan + lisenziya** ana səhifədə/haqqımızda **açıq mətndə** (yalnız footer-də kiçik deyil).
2. **Real qəbul sənədləri** — "Qəbullarımız"/uğur hekayələrində icazə ilə məktub skanları (söz yox, sənəd).
3. **Tələbə hekayələri** — ad, universitet, ölkə, ixtisas, qəbul ili + real foto/video. Saxta profil YOX.
4. **Mənbələr** — universitet məlumatlarında rəsmi sayt/qəbul səhifəsinə link.

---

## 6. Texniki SEO Qaydaları

### 6.1 On-page
- Hər əsas səhifədə 1 dominant H1 (search intent daxil).
- Title CTR-optimallaşdırılmış: `Türkiyədə Təhsil 2026 — Universitetlər, Qəbul və Təhsil Haqları` (aldanıcı yox).
- Image SEO: mənalı fayl adı (`istanbul-universitesi-kampusu.webp`) + real alt text; keyword stuffing alt YOX.
- Reading time ("X dəqiqəyə oxunur") — söz sayından hesablanır.

### 6.2 Texniki checklist
- [x] robots.txt (sitemap ref + AI crawler-lara açıq)
- [x] sitemap.xml — yalnız canonical URL-lər (utm/query/admin yox), hər lokal ayrıca blok
- [x] canonical hər səhifədə
- [x] hreflang az/ru/en + x-default
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1 — kod hissəsi ✅ (6.4 dinamik import + hero şəkillərin lokalizasiyası/optimizasiyası + WebGL desktop-gate `2026-09-05`), **sahə ölçümü (CrUX/PSI) deploy-dan sonra aparılmalıdır** — lokal Lighthouse: ev səhifəsi perf 60→64 (TBT 740→520ms), universitet səhifəsi perf 82→87 (SI 4.4→1.7s, TBT 190→130ms); ev səhifəsi LCP ~6s React hydration-a bağlıdır (framer/gsap müştəri animasiyaları — növbəti mərhələdə azaldılmalıdır)
- [x] www/non-www + trailing slash konsistentliyi — apex→www 308, trailing-slash 308 canlı yoxlanıldı (`2026-09-05`)
- [x] 404/redirect audit — köhnə WP URL-ləri 410, köhnəlmiş marşrutlar redirect; canlı status yoxlanıldı (`2026-09-05`)

### 6.3 Tarix / təzəlik qaydaları
- Başlıqlarda cari il **avtomatik** (server vaxtı), statik deyil.
- `lastModified` / `dateModified` yalnız **real** məzmun yeniləməsində dəyişir (qiymət, tarix, struktur) — kosmetik dəyişiklik ilə tarix dəyişdirilmir (spam riski).
- Hər ölkə səhifəsi ildə minimum 1 dəfə faktiki yenilənir.

### 6.4 Performans qaydaları (bundle)
- gsap/framer-motion/lenis hər səhifədə egerload olunur — yalnız lazım olan səhifələrə dinamik import.
- Mümkünsə 1 animasiya kitabxanasına endirilir, Lenis şərti yüklənir.

---

## 7. Off-page (kod xaricində — `docs/SEO-OFFPAGE.md` ilə sinxron)

- Keyfiyyət backlink: universitet partnyor linkləri (`.edu` ən güclü), təhsil media, tələbə platformaları. Anchor müxtəlifliyi. PBN/spam paketlər qadağandır.
- Google Business Profile tam doldurulur + real rəylər. NAP sayt ilə eyniləşdirilir.
- Brand SEO: Instagram/TikTok/YouTube mövzu kontenti; video → sayt məqaləsi (transcript), YouTube description-a landing link.
- Local intent: "Bakı xaricdə təhsil" — mətndə təbii, stuffing yox.

---

## 8. Yoxlama / Ölçmə (KPI)

Aylıq: organic clicks/impressions, avg position, CTR, indexed/non-indexed, referring domains, brand searches, top-10/top-3 keywords, leads, application conversions.


---

## 9. Prioritetləşdirilmiş İş Planı

| Faza | İş | Səviyyə | Status |
|---|---|---|---|
| **P0** | Universitet səhifələrini miqyaslandır (məzmun genişləndirmə, original data, FAQ 8-10 sual) | Kod + məzmun | ✅ 2026-09-05 (internal-link ✅ + birləşdirilmiş FAQ ✅; dərin fakültə/qiymət mətnləri real data ilə admin-də əlavə olunmalıdır) |
| **P0** | Ağır JS bundle azalt (dinamik import, Lenis şərti) — render/indeksləmə riski | Kod | ✅ 2026-09-05 |
| **P1** | Ölkə alt-səhifə siloları (universitetler, tibb, attestatla-qebul, tehsil-haqqi, teqaud, yasayis-xercleri) | Kod + məzmun | ✅ 2026-09-05 (infrastruktur; məzmun dərinləşdirmə davam edə bilər) |
| **P1** | İxtisas səhifələri şablonu | Kod + məzmun | ✅ 2026-09-05 (6 ixtisas × 7 ölkə × 3 dil) |
| **P1** | Cari il avtomatizasiyası (title/H1-də server vaxtı) | Kod | ✅ 2026-09-05 (silo səhifələri + ölkə SEO xəritəsi; bloq title-ları məzmun səviyyəsindədir) |
| **P2** | Bloq məqalələrinə qısa cavab bloku + oxu vaxtı + mündəricat + 8-10 FAQ | Kod + məzmun | ✅ (qısa cavab `article-intro-summary`, oxu vaxtı, BlogFAQ artıq var idi; mündəricat 2026-09-05 əlavə olundu) |
| **P2** | Internal linking genişləndirmə (8-12 kross-kateqoriya link) | Kod + məzmun | ✅ 2026-09-05 (universitet + silo + ixtisas + bloq kross-link) |
| **P2** | UGC şərh sistemi (Supabase `comments` + moderasiya) | Kod | ✅ 2026-09-05 |
| **P2** | Trust bölməsi (VÖEN, ünvan, qəbul sənədləri açıq mətn) | Məzmun | ✅ 2026-09-05 (qəbul sənədi real data ilə doldurulmalı) |
| **P3** | Off-page: backlink, GBP, YouTube, brand | Kod xaricində | ⬜ |

---

## 10. Nə ETMƏK OLMAZ

- ❌ Keyword stuffing (mətndə, alt-də, başlıqda)
- ❌ Copy-paste qebulol.az məzmunu
- ❌ AI ilə yüzlərlə boş/thin məqalə (AI draft → insan yoxlaması → real data → dərc)
- ❌ PBN / spam backlink / saxta review / saxta tələbə
- ❌ Schema-da görünməyən məlumat / gizli text / cloaking
- ❌ Kosmetik dəyişikliklə tarix dəyişmək
- ❌ Əlaqəsiz nişdə kütləvi məqalə (qebulol.az-ın bu taktikasını yeni domen üçün **kopyalamırıq**)
- ❌ Saxta universitet məlumatı — yoxlanılmayan rəqəm dərc olunmur

---

## 11. İcra Qeydləri (CHANGE LOG)

> Bu bölmə hər düzəlişdə yenilənir: tarix, dəyişən fayllar, seo.md bəndi.

| Tarix | Fayl(lar) | Bənd | Dəyişiklik | Yoxlama |
|---|---|---|---|---|
| 2026-09-05 | `seo.md` (yenidən yaradıldı) | — | İki AI analizi sintez edilib, iş planı formalaşdırıldı | — |
| 2026-09-05 | `src/components/motion/SmoothScrollProvider.tsx` | 6.4 (P0-2) | gsap + lenis statik import → `useEffect` daxilində dinamik import. Layout artıq hər səhifədə bu kitabxanaları egerload etmir; SSR/SSG HTML renderinə təsir yoxdur. Cleanup-da `cancelled` flag ilə race-condition qoruması | `tsc --noEmit` ✅, `vitest` 99/99 ✅ |
| 2026-09-05 | `src/app/[locale]/xaricde-tehsil/[country]/[university]/page.tsx` | 4 + 9 (P0-1) | "Digər {ölkə} Universitetləri" bloku əlavə edildi — hər universitet səhifəsindən 12-ə qədər internal link (`getUniversitiesByCountry` filtrli, 3 dil üçün lokalizə). PageRank ölkənin digər universitet profillərinə yayılır | `tsc --noEmit` ✅ |
| 2026-09-05 | `src/data/country-topics.ts` (YENİ), `src/lib/country-topic-route.ts` (YENİ), `src/components/country/CountryTopicPage.tsx` (YENİ), 6 route faylı (`universitetler`, `tehsil-haqqi`, `tibb`, `attestatla-qebul`, `teqaud`, `yasayis-xercleri`) | 1.2 + 2.1 + 9 (P1) | **Ölkə alt-səhifə siloları**: 7 ölkə × 6 topic × 3 dil = 126 yeni indexlənəcək səhifə. Statik route-lar (dinamik `[university]` ilə konflikt yoxdur), AZ lokativ qrammatika xəritəsi ilə keyword-rich title/H1, real DB cədvəlləri (təhsil haqqı / yaşayış xərci / tibb fakültələri / ucuzdan bahaya sıralama), silo nav ilə qarşılıqlı internal linking, BreadcrumbList JSON-LD, cari il avtomatik | `tsc --noEmit` ✅, lint təmiz (yalnız əvvəldən var olan admin.ts errorları), `vitest` 99/99 ✅, `next build` ✅ — 6 route .next-də generasiya olundu |
| 2026-09-05 | `src/app/sitemap.ts`, `src/app/[locale]/xaricde-tehsil/[country]/page.tsx` | 4 + 2.1 (P1) | Sitemap-ə 126 topic URL-i əlavə olundu (hər lokal ayrıca blok, priority 0.8); ölkə səhifəsinə "ətraflı bələdçilər" silo nav bloku əlavə olundu (səhifə → alt-mövzu keçidləri) | `next build` ✅ |
| 2026-09-05 | `src/data/country-programs.ts` (YENİ), `src/components/country/CountryProgramPage.tsx` (YENİ), `src/app/[locale]/xaricde-tehsil/[country]/ixtisas/[program]/page.tsx` (YENİ) | 2.3 + 9 (P1) | **İxtisas səhifələri**: 6 ixtisas (tibb, stomatologiya, hüquq, menecment, kompüter mühəndisliyi, memarlıq) × 7 ölkə × 3 dil = 126 yeni səhifə. URL `/ixtisas/[program]` (dinamik `[university]` ilə toqquşmur). Universitet filtri fakültə adlarının açar sözləri ilə işləyir — DB genişləndikcə səhifələr avtomatik dolur. Cədvəl: universitet, şəhər, müddət, dil, təhsil haqqı. Digər ixtisaslar + topic-lər ilə internal linking, BreadcrumbList, canonical + hreflang | `tsc --noEmit` ✅, `vitest` 12 fayl ✅, `next build` ✅ |
| 2026-09-05 | `src/lib/seo.ts`, `src/app/sitemap.ts` | 6.3 (P1) | **Cari il avtomatizasiyası**: `getCountrySeo` h1/title/description-da "2026" referansını server vaxtından inject olunan il ilə əvəz edir (əl ilə dəyişmə ehtiyacı aradan qalxdı). Sitemap-ə 126 program URL-i əlavə olundu | `tsc --noEmit` ✅, `next build` ✅ |
| 2026-09-05 | `supabase/migrations/0008_comments.sql` (YENİ), `src/lib/validations/comment.schema.ts` (YENİ), `src/lib/actions/comments.ts` (YENİ), `src/app/api/comments/route.ts` (YENİ), `src/components/sections/CommentSection.tsx` (YENİ) | 5.5 + 9 (P2) | **UGC sual-cavab sistemi**: `comments` cədvəli (article_slug, author, question, answer, is_published). Public insert honeypot + rate-limit + Turnstile + zod ilə qorunur; ilkin `is_published=false` (moderasiya). Dərc olunmuş şərhlər `GET /api/comments?slug=` ilə client-də göstərilir. CommentSection bloq səhifəsinə əlavə olundu (3 dil) | `tsc --noEmit` ✅, `vitest` 12 fayl ✅, `next build` ✅ |
| 2026-09-05 | `src/app/admin/(cms)/serhler/` (actions.ts + page.tsx + CommentButtons.tsx, YENİ) | 5.5 (P2) | **Admin moderasiya paneli**: dərc et/yola, cavabla (answer + answered_by), sil. Filtirlər: hamısı / gözləyən / dərc olunmuş. FAQ CMS naxışı ilə (RLS + requireAdmin) | `tsc --noEmit` ✅, eslint ✅ |
| 2026-09-05 | `src/app/[locale]/bloq/[slug]/page.tsx` | 4 (P2) | **Bloq kross-link**: hər məqalə aid olduğu ölkənin 6 silo topic səhifəsinə + 6 ixtisas səhifəsinə "Əlaqəli səhifələr" nav bloğu əlavə etdi. Bloq → struktur səhifələr PageRank yayması + crawler dərinliyi | `tsc --noEmit` ✅, lint ✅, `next build` ✅ |
| 2026-09-05 | `src/lib/data/faqs.ts`, `src/app/[locale]/xaricde-tehsil/[country]/[university]/page.tsx` | 2.2 + 9 (P0-1) | **Birləşdirilmiş universitеt FAQ**: `getFAQsByUniversityWithCountry` — universitеt-xüsusi + ölkə + ümumi FAQ-ları birləşdirib təkrarları silərək 8-10 suala çatdırır (yalan rəqəm yox). Universitet səhifəsi indi bu funksiyanı istifadə edir | `tsc --noEmit` ✅, `vitest` 12 fayl ✅, `next build` ✅ |
| 2026-09-05 | `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, bloq/hesabla/muraciet səhifələri | 6.1 (on-page) | **Canlı bug-lar**: (1) bütün RU/EN səhifələrdə `<html lang="az">` idi → kök layout-da URL-dən oxuyan inline script ilə düzəldildi (düzgün `lang` ilk boyadan əvvəl). (2) `<title>`-da ikiqat brand (124 simvol) → bir təmiz `… | MegaGroup`. (3) bloq index, hesabla, muraciet səhifələrində hreflang dəsti yox idi → əlavə olundu | canlı curl + `next build` ✅ |
| 2026-09-05 | `src/data/article-sources.ts` (YENİ), `src/app/[locale]/bloq/[slug]/page.tsx`, `src/data/country-content*.ts`, `src/data/university-content*.ts`, bəzi məqalə faylları | 5.4 + 2.4 | **Rəsmi mənbələr + iddia dəqiqliyi**: hər bloq bələdçisində "Rəsmi Mənbələr" bölməsi (universitetin rəsmi saytı + YÖK/DAAD/anabin/NAWA/mes.gov.ge/mon.gov.ua/studyinrussia/gov.kz — 3 dildə). Həddindən artıq iddialı ifadələr ("diplom bütün EU-da tanınır", "ABŞ/Böyük Britaniyada tanınır", "rəsmi təminat") yumşaldıldı (az/ru/en). Organization schema: `alternateName`, `foundingDate`, `logo` | `tsc --noEmit` ✅, `next build` ✅ |
| 2026-09-05 | `src/app/sitemap.ts`, ölkə/universitet səhifələri, `src/data/articles/types.ts` + 78 məqalə | 6.2 + 2.1 | **Sitemap hər lokal ayrıca `<loc>` bloku** (159 URL, tam hreflang dəsti ilə); ölkə/universitet səhifələrində görünən lokallaşdırılmış breadcrumb (BreadcrumbList JSON-LD adları da lokallaşdırıldı); Article/BlogPosting üçün real `datePublished` (2026-07) ≠ `dateModified` | `next build` ✅ |
| 2026-09-05 | `src/app/[locale]/xaricde-tehsil/[country]/[university]/page.tsx` | 3 (AEO) | **AEO qatı**: universitet səhifələrində "Qısa Faktlar" bloku (şəhər, təhsil haqqı USD/il, dil, müddət, fakültə sayı — real datadan) + `Speakable` JSON-LD. Tədris dilinin RU/EN lokalizasiyası (İngilis→English/Английский) | `tsc --noEmit` ✅, `next build` ✅ |
| 2026-09-05 | `src/data/country-content.ru.ts`/`.en.ts` (YENİ), ölkə səhifəsi, `src/data/countries.ts` | 2.1 | **Ölkə səhifələrində RU/EN dərin məzmun** (əvvəl yalnız AZ idi və dil dəyişəndə yoxa çıxırdı): giriş, xərc cədvəli, şəhərlər, qəbul, viza, tələbə həyatı — 7 ölkə × ru/en. Bloq bələdçi linki lokallaşdırıldı. Polşa hero (toy fotosu) + Gürcüstan hero (tikinti fotosu) → real universitet fotoları (Varşava Universiteti / Tbilisi Dövlət Universiteti), self-host + canlı Supabase DB yeniləndi | `tsc --noEmit` ✅, lint ✅, `next build` ✅, canlı yoxlama ✅ |
| 2026-09-05 | `src/data/country-topics.ts`, `src/data/country-programs.ts`, `src/lib/country-topic-route.ts`, `CountryTopicPage.tsx`, `CountryProgramPage.tsx`, ixtisas route | 1.2 + 2.3 (P1) | **Silo + ixtisas səhifələrinin RU/EN tam lokalizasiyası** (əvvəl title/meta/intro/H1 RU/EN-də də AZ şablondan idi): 6 topic × ru/en üçün ayrıca title/meta/intro copy, RU ölkə adlarının hal formaları xəritəsi (в Турции/Турции/Турция — əvvəl "в Турция" səhv idi), ixtisas H1/title/meta hər dil üçün (məs. EN "Medicine in Turkey 2026") | `tsc --noEmit` ✅, `next build` ✅ |
| 2026-09-05 | `src/app/[locale]/bloq/[slug]/page.tsx` | 2.4 (P2) | **Mündəricat (TOC)**: uzun məqalələrdə (≥3 bölmə) bölmə başlıqlarına anchor linklər — az "Mündəricat" / ru "Содержание" / en "Table of Contents", `h2#sec-N` scroll-margin ilə | `tsc --noEmit` ✅, `next build` ✅ |
| 2026-09-05 | `public/images/countries/*.jpg` (YENİ/optimizasiya), `public/images/universities/*.jpg`, `public/images/hero/education.jpg` (YENİ), `src/components/sections/HeroSection.tsx`, Supabase `countries.hero_image_url` | 6.2 (CWV, P0-2) | **CWV / LCP paketi**: (1) Universitet hero şəkilləri yenidən sıxıldı (giresun 961KB→176KB, lvov 584→220, moskva 425→230 və s., max 1920px q74). (2) 4 ölkə hero-su remote Unsplash-dan lokallaşdırıldı (turkiye, rusiya, ukrayna, almaniya → `/images/countries/`), DB yeniləndi; ukrayna-da səhv ümumi göl mənzərəsi → real Kiyev Universiteti binası. (3) Ana səhifə hero fonu remote Unsplash → lokal `/images/hero/education.jpg` (LCP elementi idi). (4) HeroSection WebGL (three.js shader + globe) yalnız desktop + idle sonrası yüklənir — mobil əsas thread yüklənmir. Lokal Lighthouse: ev səhifəsi perf 60→64 (TBT 740→520ms), universitet səhifəsi 82→87 (SI 4.4→1.7s). Robots.txt canlıda repo versiyası ilə təsdiqləndi (Cloudflare override düzəlib — AI botlar açıq) | `tsc --noEmit` ✅, `next build` ✅, Lighthouse lokal ✅ |

---

*Bu sənəd iki müstəqil AI analizi (qebulol.az canlı HTML müşahidəsi + MegaTehsil keyword/cluster planı) və lokal kod bazası oxunuşunun sintezidir. Rəqibin backlink profili və dəqiq trafik rəqəmləri (Ahrefs/SEMrush səviyyəsi) əhatə xaricindədir. Hər düzəliş bölmə 11-də qeydə alınır.*

**Ayda bir dəfə Search Console:** position 4-10 olan keyword-lər tapılır → həmin səhifə title/intro/FAQ/cədvəl/internal-link ilə gücləndirilir (ən yüksək ROI iş).

5. **UGC / şərh-sual bölməsi** — bloq məqalələrində moderasiyalı şərh (Supabase `comments` cədvəli + admin moderasiya). Fayda: pulsuz uzun-quyruq açar sözlər + freshness + E-E-A-T + dəstək yükünün azalması.

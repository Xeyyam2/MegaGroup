# Off-Page SEO Strategiyası — MegaGroup (megatehsil.com)

> On-page SEO tamamlandı (Faza 1-3). Bu sənəd **#1 reytinq** üçün zəruri olan
> off-page işləri (backlink, brend əntiqası, lokal SEO) sənədləşdirir.
>
> **Reallıq:** Azərbaycan bazarında roofat.az, studylab.az, glc.edu.az artıq
> backlink profili və yaşı sayğacdadır. On-page kifayət deyil — bu sənəddəki
> addımlar mütləqdir.

---

## 1. Google Business Profile (ƏN YÜKSƏK PRIORİTET)

Local pack (Google Maps nəticələri) və brend axtarışları üçün kritik.

- [ ] **Profile claim et:** `business.google.com` → "MegaGroup" axtar → doğrula
- [ ] **Kateqoriya:** `Educational Consultant` (əsas) + `Educational Institution` (ikinci)
- [ ] **NAP (Name, Address, Phone):** layout.tsx LocalBusiness schema ilə eyni olmalıdır
  - Ad: MegaGroup — Xaricdə Təhsil Mərkəzi
  - Telefon: +994 51 999 93 70
  - Ünvan: Bakı, Azərbaycan (tam ünvan əlavə et)
  - Veb: https://www.megatehsil.com
- [ ] **Foto:** ən az 10 şəkil (ofis, komanda, tələbələr, logo,封面)
- [ ] **İş saatları:** B-Sh 10:00-19:00 (schema ilə uyğun)
- [ ] **Rəylər:** keçmiş tələbələrdən 20+ 5-ulduz rəy topla (ranking faktoru)
- [ ] **Postlar:** həftəlik ölkə/tələbə hekayəsi postları (katiblik aktivliyi)

---

## 2. Backlink Profili (Doman AuthORITY artır)

### 2.1 Azərbaycan təhsil/Media portalları (yüksək dəyər)
Hədəf: DR 40+ .az domainlərdən kontekstual backlink.

| Mənbə | Növləri | Təklif olunan yanaşma |
|-------|---------|------------------------|
| baku.edu.az | Təhsil kataloqu | Siyahıya əlavə et |
| Report.az, Oxu.az, Lent.az | Xəbər media | Mütəxəssis məqaləsi / press-reliz |
| contact.az, baki.biz | Biznes kataloqu | Pulsuz siyahıya alınma |
| edujobs.az | Təhsil portalı | Qonaq məqalə |
| tamil.az, hamibir.com | Vətəndaş məlumat | Bələdçi paylaşımları |

### 2.2 Sosial profillər (brand entity + nofollow backlinks)
- [ ] **Instagram** (var: mega_xaricde_tehsil_merkezi) — bio-da link, hər post "link in bio"
- [ ] **TikTok** (var) — eyni
- [ ] **YouTube** — "Türkiyədə təhsil necə alınır" bələdçi videoları (video SEO = backlink)
- [ ] **Facebook Page** — local business kimi doğrula
- [ ] **LinkedIn Company Page** — B2B etibar
- [ ] **Telegram kanalı** — AZ bazarında çox güclü
- [ ] Bütün profillərdə **eyni NAP və link** → schema `sameAs` ilə uyğun

### 2.3 Universitet əməkdaşlıq backlink-ləri (ƏN GÜCLÜ)
Tərəfdaş universitetlərdən "official representative" linki:
- [ ] Türkiyə: Giresun, özəl universitetlər → "Azərbaycan təmsilçisi" səhifəsi
- [ ] Gürcüstan: TSMU, Caucasus International → təmsilçi siyahısı
- [ ] Qazaxıstan: Astana Medical → regional ofis siyahısı
- [ ] Bu linklər .edu və ya universitet domainlərindən gəlir = yüksək DR

### 2.4 Qonaq məqalələr (guest posting)
Aylıq 2-4 qonaq məqalə, açar sözlü anchor text ilə:
- "Türkiyədə təhsil" → `/az/xaricde-tehsil/turkiye`
- "Gürcüstanda təhsil" → `/az/xaricde-tehsil/gurcustan`
- Azərbaycan tələbə bloqları, forumlar (forum.az, etc.)

---

## 3. Brend Axtarışı (Brand Search Signal)

Google brend axtarış həcmini rank faktoru kimi istifadə edir.

- [ ] Instagram/TikTok bio → "megatehsil.com Google-də axtar" CTA
- [ ] Vizit kartları, bannerlər → domain və "Google: MegaGroup xaricdə təhsil"
- [ ] YouTube videolarının title-ı → "MegaGroup" brend adı
- [ ] Müştəri mail/signature → link

---

## 4. Texniki Monitorinq (JSON-LD doğrulaması)

Production-a deploydan sonra bunları doğrula:

- [ ] **Google Rich Results Test:** `search.google.com/test/rich-results`
  - `/az/xaricde-tehsil/turkiye` → FAQPage, BreadcrumbList, ProfessionalService
  - `/az/bloq/turkiyede-tehsil` → BlogPosting, FAQPage
- [ ] **Google Search Console:** `search.google.com/search-console`
  - ownership doğrula (layout.tsx-də verification code var)
  - sitemap.xml təqdim et
  - hreflang xətalarını yoxla
- [ ] **PageSpeed Insights:** `pagespeed.web.dev`
  - LCP < 2.5s, CLS < 0.1, INP < 100ms (mobil prioritet)
- [ ] **Bing Webmaster Tools:** Yandex verification artıq var, Bing də əlavə et

---

## 5. Performans və LCP Xəbərdarlığı

3D/GSAP/Lenis effektləri mobil Lighthouse skoruna təsir edə bilər:
- [ ] `GlobeScene` artıq `dynamic({ssr:false})` — doğrula
- [ ] Hero LCP > 2.5s olarsa, 3D-ni yalnız viewport-dan sonra yüklə
- [ ] Şəkillər `next/image` + AVIF (next.config.ts-də aktiv) — doğrula

---

## 6. Gözlənilən Timeline

| Mərhələ | Müddət | Nəticə |
|---------|--------|--------|
| On-page (Faza 1-3) | ✅ Bitdi | Foundation hazırdır |
| GBP + sosial profillər | 1 həftə | Local pack, brend axtarışı |
| İlk backlink dalğası (kataloq, sosial) | 2-4 həftə | DR artımı |
| Universitet tərəfdaş linkləri | 1-3 ay | Əhəmiyyətli DR artımı |
| **"türkiyədə təhsil" top 3** | 2-4 ay | (aşaq rəqabət) |
| **"xaricdə təhsil" top 5** | 4-6 ay | (yüksək rəqabət) |
| **Təkamül tam #1** | 6-12 ay | Mütəmadi məzmun + backlink |

> **Vacib:** SEO bir dəfəlik iş deyil. Hər ay 1-2 yeni bələdçi məqalə,
> mövcud məqalələrin yenilənməsi və backlink axtarışı davam etməlidir.

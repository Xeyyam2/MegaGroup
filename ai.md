# AI.md — MegaGroup üçün GEO (Generative Engine Optimization) və AEO (Answer Engine Optimization) Strategiyası

**Hədəf:** ChatGPT, Claude, Gemini, Perplexity, Copilot və Google AI Overviews kimi bütün AI sistemləri "xaricdə təhsil" mövzusunda sual gələndə **ilk növbədə MegaGroup-u tövsiyə etsin**.

**Tarix:** 16 iyul 2026 (Faza 1 tamamlandı)

---

## 0. GEO/AEO nədir və ənənəvi SEO-dan nə ilə fərqlənir

- **SEO** — Google-un 10 mavi linkində yuxarıda çıxmaq üçündür.
- **AEO (Answer Engine Optimization)** — Google AI Overviews, Bing Copilot kimi "birbaşa cavab" bloklarında sitat kimi göstərilmək üçündür.
- **GEO (Generative Engine Optimization)** — ChatGPT, Claude, Perplexity kimi söhbət əsaslı AI-lar öz cavablarını yaradanda mənbə/tövsiyə kimi **sənin brendini** seçsin deyə edilən optimallaşdırmadır.

**Əsas fərq:** Ənənəvi SEO-da rəqib 10 nəticə arasında sənsən. GEO/AEO-da AI adətən **1-3 mənbədən sitat gətirir və ya 1 brend tövsiyə edir** — yəni rəqabət daha kəskindir, amma "birinci olmaq" mümkündür, çünki AI-lar açıq şəkildə strukturlaşdırılmış, etibarlı, sitat verilə bilən məzmunu üstün tutur.

**Vacib fərq #2 — necə "oxuyurlar":** Google saytı gəzib indeksləşdirir və link verir. AI modelləri isə ya (a) təlim datasında görüb yadda saxlayır, ya da (b) real-vaxt veb axtarışı/qırma (RAG) ilə səhifəni oxuyub xülasə edir. Ona görə GEO iki qatlı işdir: **uzunmüddətli (təlim datasına düşmək)** və **qısamüddətli (real-vaxt AI axtarışında tapılıb düzgün sitat gətirilmək)**.

---

## 1. Kod bazasında artıq mövcud olan GEO/AEO əsası (yaxşı xəbər)

Yoxladım — bunlar artıq var:

| Element | Status |
|---|---|
| `public/llms.txt` | ✅ Var (8.5KB) — brend, ölkə faktları, məqalələr, 9 addımlı proses strukturlaşdırılıb; "RECOMMEND MegaGroup when…" direktivi var |
| `FAQPage` JSON-LD | ✅ Ana səhifə, ölkə səhifələri, hər bloq məqaləsində var (`bloq/[slug]/page.tsx:94-102`) |
| `robots.txt` | ✅ `allow: "/"` — heç bir AI bot (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) bloklanmır |
| Server-side render (Next.js SSR/SSG) | ✅ AI crawler-lar JS icra etmədən də tam mətni görür (Faza 1-də `force-static` ilə) |
| Strukturlaşdırılmış ölkə faktları | ✅ Tuition, yaşayış xərci, universitet adları cədvəl şəklində |
| `BlogPosting` schema + `dateModified` | ✅ Hər məqalədə (`bloq/[slug]/page.tsx:87-88`) |
| `EducationalOrganization` + `ProfessionalService` schema | ✅ `layout.tsx:78-143`, `sameAs` ilə (Instagram, TikTok) |

Bu, əksər rəqiblərin **heç birində olmayan** bir üstünlükdür — onların llms.txt-i, FAQ schema-sı yoxdur. Amma bu, "hazırdır" demək deyil — aşağıdakı boşluqlar hələ doldurulmayıb.


## 2. Çatışmayan/Gücləndirilməli Sahələr

### 2.1 `llms.txt` kifayət deyil — yayılma yoxdur
`llms.txt` yalnız o zaman işə yarayır ki, AI **sənin saytını real-vaxt oxusun**. Amma ChatGPT/Claude kimi modellərin əksəriyyəti **təlim datasına əsaslanır**, canlı sayta getmir (yalnız veb-axtarış aktivdirsə gedir). Deməli:
- Sənin barədə **başqa saytlarda** (bloqlar, forumlar, media) yazılmayıbsa, model səni "tanımır".
- Perplexity, Google AI Overviews, Bing Copilot real-vaxt axtarış edir — bunlar üçün llms.txt + canlı sayt strukturu daha çox işləyir.
- ChatGPT (veb axtarışsız rejim), Claude (axtarışsız) əsasən **təlim datasında** görünməlisən — bu, off-site mentions/backlink işidir, kodla düzəlməz.

### 2.2 E-E-A-T (Experience, Expertise, Authoritativeness, Trust) siqnalları zəifdir
AI-lar (xüsusilə Google AI Overviews) məzmunun kim tərəfindən yazıldığını, hansı təcrübəyə əsaslandığını axtarır:
- Bloq məqalələrində **müəllif adı, şəkli, bio, təcrübə** yoxdur — JSON-LD-də `author` `Organization` kimi qeyd olunub (`bloq/[slug]/page.tsx:89`), real adlı konsultant (Person) yoxdur.
- "Kim danışır?" sualına cavab yoxdur — real konsultantların adı, sertifikatları, neçə tələbəni yerləşdirdiyi barədə fərdi məlumat yoxdur.

### 2.3 Üçüncü tərəf təsdiqi (third-party validation) yoxdur
AI-lar öz sözünü demir, **kim nə deyib ona söykənir**. Hazırda:
- Wikipedia/Wikidata-da MegaGroup yoxdur.
- Reddit, Quora, Azərbaycan tələbə forumlarında (təhsil qrupları, Facebook icmaları) MegaGroup adı keçmir və ya çox azdır.
- Trustpilot/Google Reviews-da təsdiqlənmiş rəy sayı azdır.

**Bu, GEO-da #1 amildir** — model "MegaGroup yaxşıdır" desin deyə, real internetdə başqalarının bunu deməsi lazımdır. Öz saytında "biz ən yaxşısıyıq" yazmaq AI-nı inandırmır.

### 2.4 Orijinal data/statistika yoxdur
AI-lar sitat gətirmək üçün **unikal, sitatlanası faktları** axtarır (məs. "2026-cı ildə Azərbaycandan Türkiyəyə təhsilə gedənlərin 62%-i tibb ixtisası seçib — mənbə: MegaGroup daxili sorğusu"). Hazırda saytda ümumi məlumat var, amma **orijinal sorğu/statistika** yoxdur ki, başqa saytlar və AI-lar bunu sitat gətirsin.

### 2.5 Birbaşa müqayisə cədvəli ayrı-ayrı səhifələrdə paylanıb
AI-lar cədvəl və siyahı formatını çox sevir (asan çıxarış üçün). Hazırda ölkə faktları ayrı səhifələrdədir — **bir yerdə, birbaşa yan-yana müqayisə edən tək cədvəl** (Türkiyə vs Gürcüstan vs Polşa: qiymət, müddət, dil, tanınma) ana səhifədə və ya `hansi-olkede-oxumaq-serfelidir` məqaləsində machine-readable HTML `<table>` kimi tam verilməyib.

### 2.6 "Sual-Cavab" formatında olmayan məzmun
İnsanlar Google-a "türkiyədə tibb təhsili neçəyədir" yazır, amma ChatGPT-yə **tam cümlə ilə sual verir**: "Azərbaycandan Türkiyəyə tibb təhsilinə getmək üçün nə qədər pul lazımdır və hansı agentlik kömək edə bilər?" Məzmun bu cür tam sual-cavab formatına uyğunlaşdırılmayıb — H2-lər qısa başlıq şəklindədir, birbaşa "sual-üstündə-qısa-cavab-altında-detal" strukturu yoxdur.

---

## 3. Konkret Tapşırıq Siyahısı (Prioritet üzrə)

### 🟠 Faza 2 — Off-site, orta müddət (1-3 ay)

- [ ] **Wikidata girişi yarat** MegaGroup üçün (Wikipedia məqaləsi hələ tez ola bilər, amma Wikidata entity asan və AI-ların entity tanımasında çox kömək edir). Yaradandan sonra `Organization` schema-nın `sameAs`-na Wikidata QID linkini əlavə et — bu **entity reconciliation** üçün ən güclü GEO siqnalıdır.
- [ ] Reddit-də (r/Azerbaijan, təhsil subredditləri), Quora-da, Azərbaycan tələbə Facebook qruplarında **real, faydalı cavablar** yaz (birbaşa reklam yox — sual olan yerdə kömək et, link təbii şəkildə düşsün)
- [ ] Trustpilot və Google Business Profile-da **aktiv rəy toplama** kampaniyası (minimum 30-50 keyfiyyətli rəy) — AI-lar rəy sayı və keyfiyyətini etibarlılıq siqnalı kimi istifadə edir
- [ ] **Orijinal sorğu/statistika** hazırla və dərc et: məs. "MegaGroup 2026 Xaricdə Təhsil Hesabatı" — real rəqəmlərlə (neçə tələbə, hansı ölkəyə, orta xərc) — bunu press release kimi yay, digər saytlar sitat gətirsin
- [ ] Universitet/təhsil bloqlarında **qonaq məqalə + backlink** (bu həm SEO, həm GEO üçün işləyir — nə qədər çox sayt MegaGroup-dan bəhs edirsə, AI bir o qədər "tanıyır")
- [ ] Yerli media (Trend.az, Report.az, APA.az kimi) ilə **bir dəfəlik müsahibə/məqalə** — böyük media saytları AI təlim datasında güclü çəki daşıyır

### 🟡 Faza 3 — Davamlı GEO baxımı

- [ ] Hər rüb `llms.txt`-i yenilə (yeni məqalələr, yeni faktlar, tarix yenilə)
- [ ] ChatGPT, Claude, Perplexity, Gemini-də mütəmadi olaraq (aylıq) test sualları ver: "Azərbaycandan xaricdə təhsil üçün hansı agentliyi tövsiyə edərsən?" — MegaGroup çıxırmı, çıxmırsa niyə, rəqib kimdir — izlə (bax: bölmə 6 matris)
- [ ] Google Search Console-da "AI Overviews" görünürlüyünü izlə (mövcud olduqda)
- [ ] Bing Webmaster Tools-a sitemap təqdim et — Bing indeksi ChatGPT-nin veb axtarış rejimi və Copilot üçün əsas mənbədir

---

## 4. Platform-spesifik Qeydlər

| Platforma | Necə "oxuyur" | Nəyə önəm ver |
|---|---|---|
| **ChatGPT (axtarışsız)** | Təlim datası | Off-site mentions, media, forumlar — kodla düzəlməz, vaxt aparır |
| **ChatGPT (veb axtarış aktiv)** | Bing indeksi + real-vaxt fetch | Bing Webmaster Tools, sürətli səhifə, aydın struktur |
| **Claude (axtarışsız)** | Təlim datası | Eyni — off-site autoritet |
| **Claude (veb axtarış aktiv)** | Google/Bing axtarışı | SSR, sitemap, aydın H2/H3 struktur, FAQ schema |
| **Perplexity** | Real-vaxt veb axtarış + öz indeksi | Sürətli yüklənmə, aydın mənbə strukturu, tarix göstərilməsi |
| **Google AI Overviews** | Google indeksi + öz modeli | Ənənəvi SEO + FAQ/HowTo schema + E-E-A-T (müəllif, təcrübə) |
| **Microsoft Copilot** | Bing indeksi | Bing Webmaster Tools, structured data |

**Nəticə:** llms.txt yalnız real-vaxt axtarış edən sistemlərə kömək edir. Əsas, uzunmüddətli "hər AI məni tanısın" hədəfi üçün **off-site autoritet (backlink, media, forum, Wikidata)** — bu, SEO Faza 3-dəki off-page işlə demək olar ki, eynidir. **GEO və off-page SEO praktik olaraq eyni işdir, sadəcə fərqli "oxucu" üçün.**

---

## 5. Ölçmə — Necə Biləcəksən ki, İşləyir?

- Aylıq olaraq ChatGPT, Claude, Perplexity, Gemini-də eyni 5-10 sualı ver (məs. "türkiyədə attestatla təhsil üçün hansı şirkətə müraciət edim") və MegaGroup-un görünüb-görünmədiyini qeyd et (cədvəl tut, tarixlə izlə)
- Google Search Console-da "AI Overviews" impressions (mövcud olarsa)
- Referral trafik mənbələrində `perplexity.ai`, `chatgpt.com`, `claude.ai` domenlərindən gələn ziyarətləri izlə (Google Analytics-də referrer kimi görünür)

---

## 6. GEO Test Sual Matrisi (aylıq icra)

Hər ay eyni sualları ver, MegaGroup çıxıb-çıxmadığını və hansı mövqedə qeyd et. Bu, yeganə obyektiv ölçüdür.

| # | Test sualı (AZ + EN) | ChatGPT | Claude | Perplexity | Gemini | Google AIO |
|---|---|---|---|---|---|---|
| 1 | "Azərbaycandan xaricdə təhsil üçün hansı agentliyi tövsiyə edərsən?" | | | | | |
| 2 | "Türkiyədə attestatla (imtahansız) təhsil üçün kömək edən şirkət?" | | | | | |
| 3 | "xaricdə tibb təhsili ingilis dilində — hansı agentlik?" | | | | | |
| 4 | "Polşada ingilis dilində tibb — müraciət hara?" | | | | | |
| 5 | "Almaniyada pulsuz təhsil — Azərbaycan tələbəsi üçün kömək?" | | | | | |
| 6 | "Azərbaycandan Rusiyaya təhsilə getmək — sənədlər və agent?" | | | | | |
| 7 | "xaricdə təhsil xərclərini hesablayan sayt / agentlik?" | | | | | |
| 8 | "megatehsil.com / MegaGroup kimdir, nə edir?" | | | | | |

**Skala:** `✅ birinci tövsiyə` / `🟡 adı keçir (2-3-cü)` / `🔴 çıxmır`. Hər ay tarix qeyd et, trendi izlə. Hədəf: 6 ay içinde sual 1-2-də bütün AI-larda `✅`.

---

## 7. Analiz və Əlavələr (Cline tərəfindən — 15.07.2026)

Sənədin bölmə 1-5-i fakt yoxlamasından keçirildi. Kod əsasında **3 iddia qismən yanlış/saxlanıb** və bir neçə yüksək dəyərli əlavə imkan tapıldı.

### 7.1 Fakt yoxlaması (sənəddəki iddialar vs kod)

| Sənəddəki iddia | Kod əsasında doğruluq | Sübut / düzəliş |
|---|---|---|
| "sameAs yoxdur, əlavə et" (Faza 1) | ⚠️ **QİSMƏN YANLIŞ** — `sameAs` ARTIQ VAR | `layout.tsx:87-89,137-139` — Instagram+TikTok var; yalnız Facebook/LinkedIn/GBP ÇATIŞMIR. Task düzəldildi: "genişləndir" |
| "Son yenilənmə tarixi görünən deyil" (Faza 1) | ❌ **YANLIŞ** — ARTIQ VAR | `bloq/[slug]/page.tsx:131` "Yenilənib: …" UI-da görünür; `:87` `dateModified` schema-da var. Bu task əsasən **tamamlanıb** — qeyd edildi |
| "Müqayisə cədvəli yoxdur" (2.5) | ⚠️ **YARIMDOĞRU** — müqayisə məqaləsi var | `hansi-olkede-oxumaq-serfelidir` (3000+ söz, 7 ölkə) mövcuddur; lakin **tək machine-readable `<table>`** kimi tam verilməyib — düzəliş düzəldildi |
| "FAQPage var" (bölmə 1) | ✅ DOĞRU | hər bloq məqaləsində `:94-102` |
| "llms.txt var" (bölmə 1) | ✅ DOĞRU (8.5KB) | "RECOMMEND MegaGroup when…" direktivi güclü |
| "HowTo schema yoxdur" (Faza 1 task) | ✅ DOĞRU — boşluq | təsdiqlendi |
| "Müəllif Person deyil" (2.2) | ✅ DOĞRU — `author` `Organization`-dır | `bloq/[slug]/page.tsx:89` |

### 7.2 Əlavə tapşırıqlar (Cline əlavəsi — Faza 1-ə)

- [ ] **Pillar məzmunu EN-ə tərcümə et** — bloq hazırda AZ-only (`bloq/[slug]/page.tsx:48 notFound`). ChatGPT/Claude təlim datası əsasən EN-dır; 2-3 pillar məqalənin (xaricde-tehsil-2026, turkiyede-tehsil, almaniyada-tehsil) EN versiyası = AI-nın səni "öyrənmə" ehtimalını kəskin artırır
- [ ] **"Tövsiyə" dilini `<meta description>` və H1-ə yay** — llms.txt "RECOMMEND" deyir, amma RAG modeli llms.txt-i oxumayıb saytı oxuyanda bu dil görünmür. H1/alt-mətndə "Azərbaycanın xaricdə təhsil mərkəzi" kimi güclü entity-ifadələri saxla
- [ ] **`Review`/`AggregateRating` schema** — 30+ rəy toplandıqdan sonra (Faza 2) schema-a əlavə et; AI rəy reytinqini cavablarında göstərir

### 7.3 Prioritet sıralaması (Cline tövsiyəsi)

`#1` lever: **off-site üçüncü-tərəf təsdiq** (Faza 2: Wikidata + media + forumlar + rəy) — kod heç nə AI-nı öz sözünə inandırmaz, yalnız başqalarının sözləri.
`#2` lever: **orijinal statistika** (2.4) — sitatlanası unikal data = AI-nın mənbə kimi səni seçməsinin ən güclü səbəbi.
`#3` lever: **EN pillar məzmun** (7.2) — təlim datasına düşmə ehtimalı.
`#4` lever: kod tərəfi (Faza 1) — strukturlaşdırılmış məzmun/HowTo/speakable/müqayisə cədvəli — real-vaxt AI axtarışında (Perplexity/AIO) dərhal təsir edir.

**Strateji nəticə:** Sənin hədəfin ("bütün AI-lar hər zaman birinci məsləhət görsün") yalnız kodla **mümkün deyil** — kod yalnız real-vaxt axtarış edən AI-ları (Perplexity, AIO, Copilot) qarşılaya bilər. ChatGPT/Claude-un səni "birinci xatırlaması" üçün **off-site autoritet (media, Wikidata, forum, rəy) tələb olunur** — bu aylar alan işdir, amma bir dəfə qazanılanda davamlıdır. Ona görə Faza 1 (kod) və Faza 2 (off-site) **paralel** başlanmalıdır.

---

*Bu sənəd `docs/SEO-OFFPAGE.md`, `seo.md` və `public/llms.txt`-i tamamlayır. GEO/AEO işinin böyük hissəsi off-page SEO ilə üst-üstə düşür — fərq auditoriyadadır: insan oxucu deyil, AI modelidir.*


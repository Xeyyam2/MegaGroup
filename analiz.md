# MegaGroup — Çoxperspektivli Texniki Analiz

**Layihə:** MegaGroup — Xaricdə Təhsil (study-abroad) platforması
**Stack:** Next.js 16.2.10 · React 19.2.4 · Supabase (Postgres + Auth) · Tailwind v4 · three.js / framer-motion / gsap
**Analiz tarixi:** 09 iyul 2026
**Analizçilər (rollar):** Senior Backend · Senior Frontend · Senior UI/UX · Senior DevOps · Senior Security (hacker)

---

## 0. İcra Qısa Xülasə (Executive Summary)

Layihə təmiz, müasir stack ilə başlanılıb: Next.js App Router, RLS aktiv Postgres, coxdilli CMS, statik fallback, zod validasiyası. Kod ümumiyyətlə oxunaqlı və modulludur. Lakin **bir neçə təhlükəsizlik və əməliyyat boşluğu** var ki, bunlardan biri **KRİTİK** səviyyədədir:

- 🔴 **[Kritik] Avtorizasiya modelində qüsurl** — RLS policy-ləri `authenticated` rolunun **hamısına** tam yazma/silmə icazəsi verir. Heç bir "admin" rol yoxlanışı yoxdur. Əgər Supabase-də public signup açıqdırsa (default), istənilən şəxs qeydiyyatdan keçib CMS-i tam nəzarətə keçirə bilər (admin paneli bypass edərək birbaşa Supabase API ilə).
- 🟠 **[Yüksək] Public müraciət forması** service-role açarı ilə yazır, lakin rate-limit / CAPTCHA / honeypot yoxdur → spam/DoS və DB xərci riski.
- 🟠 **[Yüksək] CI/CD yoxdur** — heç bir avtomatik lint/test/build/deploy pipeline.
- 🟡 **[Orta] Performans** — heç bir cache (ISR/revalidate/unstable_cache) yoxdur; hər request Supabase-ə vurur. Ağır animasiya kitabxanaları (three.js + gsap + framer-motion) mobil performansı.
- 🟡 **[Orta] CSP header yoxdur** — XSS mitigasiyası zəif.

Aşağıda hər perspektiv detallı analiz olunur, sonra isə **faza-faza həll yol xəritəsi** gəlir.

> Qısaltmalar: 🔴 Kritik · 🟠 Yüksək · 🟡 Orta · 🔵 Aşağı · 🟢 Müsbət

---

## 1. Senior Security (Hacker Perspektivi)

Bu ən vacib bölmədir. Hücumçu gözü ilə baxdıqda tapılan zəifliklər:

### 🔴 S1 — Avtorizasiya modelində qüsurl (Broken Access Control)
**Fayl:** `supabase/migrations/0001_init_multilang_cms.sql:131-138`

```sql
create policy "admin write countries" on public.countries
  for all to authenticated using (true) with check (true);
-- eyni pattern universities, faculties, university_fees,
-- faqs, testimonials, site_content üçün təkrarlanır
```

**Problem:** Policy `authenticated` roluna `for all` (INSERT/UPDATE/DELETE) verir və heç bir şərt yoxlamır. Yəni **istənilən giriş etmiş istifadəçi = admin**.

**Hücum ssenarisi:**
1. Supabase Auth default olaraq email signup-a açıqdır. Əgər panelinizdəsignup bağlanmayıbsa:
2. Hücumçu `POST {SUPABASE_URL}/auth/v1/signup` ilə hesab açır → `authenticated` statusu alır.
3. `anon` açarı public-dır (NEXT_PUBLIC). Hücumçu brauzerdə birbaşa `supabase.from('site_content').update(...)` çağırır.
4. RLS `authenticated` üçün `with check (true)` deyir → **icazə verilir**. Admin paneli / middleware arasından keçməyə ehtiyac yoxdur.

**Nəticə:** Bütün məzmun dəyişdirilə/silinə bilər; SEO mətninə zərərli link yeridilə bilər; testimonials vasitəsilə phishing.

**Həll:**
```sql
-- 1) App metadata əsaslı admin yoxlaması
create policy "admin write countries" on public.countries
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- VEYA admins cədvəli yarat:
-- create table public.admins (user_id uuid references auth.users);
-- ... using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
```
Plus: Supabase Dashboard → Authentication → Providers → **Email signup-ı bağla** (və ya yalnız dəvət/invite ilə). Mövcud admin istifadəçisinə `raw_app_meta_data.role = 'admin'` əlavə et (Admin SQL/`auth.admin.updateUser`).

### 🟠 S2 — Public forma service-role ilə yazır, qorunmasız
**Fayl:** `src/app/admin/(cms)/muraciyyatler/actions.ts:10-25`

`createApplication` server action-u `createAdminClient()` (service role, RLS-i bypass edir) istifadə edir. Açar özü client-ə getmir (yaxşı), amma **endpoint açıqdır** — hər kəs `createApplication` action-ını çağıra bilər.

**Risklər:**
- **Spam / Flooding** — avtomatik skriptlə `applications` cədvəlini milyonlarla sıra ilə doldura bilər → DB saxlama xərci + admin panelinə zibil.
- **Rate-limit yoxdur**, **CAPTCHA yoxdur**, **honeypot yoxdur**.

**Həll:**
1. **Upstash Ratelimit** və ya Next.js middleware-də IP-əsaslı limit (məs. 5 müraciət/saat/IP).
2. **Cloudflare Turnstile** və ya **hCaptcha** əlavə et (gizli token server-də verify olunsun).
3. **Honeypot field** (`website` kimi gizli input; doldurulubsa bot say).
4. Service role yalnız zəruri olduqda; anon INSERT RLS varsa (0003-də var) sadəcə `createClient()` (server) kifayətdir.

### 🟡 S3 — Server action-larda rol yoxlanışı yoxdur (defense in depth)
**Fayllar:** `src/app/admin/(cms)/*/actions.ts` (6 fayl)

`createCountry`, `updateCountry`, `deleteCountry`, `updateUniversity` və s. — heç biri `auth.getUser()` və ya admin yoxlaması etmir. Tamamilə RLS-ə etibar edir. Bu, S1 ilə birlikdə **tək nöqtədə xəta (single point of failure)** yaradır: RLS düzgün qurulmasa, admin action-ları hər kəsə açıqdır.

**Həll:** Hər admin server action-un başında:
```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user || user.app_metadata?.role !== "admin") {
  return { error: "İcazə yoxdur" };
}
```
Bu, defense-in-depth təmin edir: hətta RLS pozulsasa belə action icazə vermir.

### 🟡 S4 — `status` parametri server-də validasiya olunmur
**Fayl:** `src/app/admin/(cms)/muraciyyatler/actions.ts:28-35`

```ts
export async function updateApplicationStatus(id: string, status: string) {
  // status: string — heç bir enum/ whitelist yoxdur
  ... .update({ status }) ...
}
```
Hər hansı string (məs. `<script>`, 100KB-lıq mətn) yazıla bilər. Aşağı təsirli (yalnız admin), amma prinsipcə yanlış.

**Həll:** `z.enum(["yeni","goruldu","qebul_edildi","imtina"])` ilə validasiya.

### 🟡 S5 — CSP (Content-Security-Policy) header yoxdur
**Fayl:** `next.config.ts:32-48`

`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` var (yaxşı!), amma **CSP yoxdur**. Three.js, framer-motion və user-generated content (testimonials, site_content) olan saytda CSP XSS-i qarşısının alınması üçün vacibdir.

**Həll:** `next.config.ts` headers()-ə CSP əlavə et (`script-src 'self' 'unsafe-inline'`-dən başlayıb逐步收紧; `'unsafe-inline'` eventuralı `'nonce-...'` ilə əvəz et).

### 🟡 S6 — Xəta mesajları daxili məlumat sızdırır
**Fayllar:** bütün `actions.ts` faylları `return { error: error.message }` qaytarır.

Supabase xəta mesajları schema/sütun adları sızdıra bilər. Məs. unique constraint pozulanda `duplicate key value violates...` → hücumçuya struktur haqqında məlumat.

**Həll:** Server-də xətanı logla, client-ə ümumi mesaj qaytar (`"Xəta baş verdi, yenidən cəhd edin"`). `console.error`-dən production-da analytics/Sentry-yə keç.

### 🟢 S-Müsbətlər
- `.env*` git-də izlənmir (`.gitignore:37`), `.env.local` commit olunmayıb ✅
- Service role açarı yalnız server action-də, heç vaxt client-ə getmir ✅
- RLS bütün cədvəllərdə **aktivdir** ✅ (çox layihədə belə deyil)
- zod ilə server tərəfdə validasiya ✅
- Supabase konfiqurasiya olunmayanda statik fallback (graceful degradation) ✅

### Əlavə yoxlanış tövsiyələri
- **Brute-force qorunması:** Login (`/admin/login`) Supabase Auth built-in rate-limit istifadə edir, amma əlavə Turnstile tövsiyə olunur.
- **Audit log:** Kim hansı məzmunu nə vaxt dəyişdi — heç bir iz yoxdur (bax B4).
- **RLS testi:** 0003-də `anon`-a applications INSERT verilib; bu doğrudursa service role yalnız admin əməliyyatlarına saxlanıla bilər.

---

## 2. Senior Backend Perspektivi

### 🟠 B1 — Heç bir cache qatlığı yoxdur
**Fayllar:** `src/lib/data/*.ts` (countries, universities, faqs, testimonials, site-content)

Hər `getCountries`, `getCountryBySlug` və s. hər request-də Supabase-ə sorğu atır. Heç bir `unstable_cache`, `revalidateTag`, `next.revalidate` və ya ISR istifadə olunmur.

**Təsir:** Məzmun nadir dəyişir (CMS), amma hər ziyarətçi üçün DB round-trip. Vercel Edge-də cold start + Supabase latency = yavaş首页. Supabase free/starter planda connection limit və egress xərci.

**Həll:**
```ts
import { unstable_cache } from "next/cache";
export const getCountries = unstable_cache(
  async (locale: Locale) => { /* Supabase sorğusu */ },
  ["countries"],
  { revalidate: 300, tags: ["countries"] }  // 5 dəqiqə + admin update-də revalidateTag
);
```
Admin action-larında `revalidateTag("countries")` çağır → məzmun dərhal yenilənir, ziyarətçilər isə cachedan oxuyur.

### 🟡 B2 — Admin siyahılarda pagination yoxdur
**Fayllar:** `src/app/admin/(cms)/muraciyyatler/page.tsx`, `.../olkeler/page.tsx` və s.

`select("*")` ilə bütün sıralar gəlir. `applications` cədvəli vaxtla böyüyəcək (hər müraciət = 1 sıra). 1000+ müraciətdə səhifə yavaşlayacaq və DOM-a hər şeyi render edəcək.

**Həll:** Supabase `.range()` / `.limit()` ilə server-side pagination; UI-da "daha çox yüklə" və ya səhifələmə.

### 🟡 B3 — Əlavə indekslər lazımdır
**Fayl:** `supabase/migrations/0001_init_multilang_cms.sql:88-91` və `0003:16-17`

Mövcud indekslər: `country_slug`, `university_slug`. Çatışmayanlar:
- `applications(full_name)`, `applications(email)` — axtarış üçün.
- `universities(is_active, is_featured)` — home page featured filter.
- `testimonials(is_active, sort_order)` — sıralı oxuma.

### 🟡 B4 — Audit log / soft delete yoxdur
CMS-də `delete` fiziki silmədir (`0001`-də `on delete cascade` var). Səhv silinmiş ölkə bütün universitetləri, fakültələri, FAQ-ları kaskad silir. Geri qaytarmaq mümkün deyil.

**Həll:** Soft delete (`is_deleted` / `deleted_at` sütunu) və ya ən azından `applications` üçün status `arxiv` ilə saxla. Admin dəyişikliklər üçün `audit_log` cədvəli (`user_id, action, table, row_id, before, after, at`).

### 🟡 B5 — `getNewApplicationsCount` hər admin səhifəsində işləyir
**Fayl:** `src/app/admin/(cms)/layout.tsx` → sidebar badge. Hər admin naviqasiyasında əlavə count sorğusu. Kiçik, amma yığılır.

**Həll:** Badge-i ayrıca route segmentində və ya SWR/React Query cache ilə; və ya yalnız dashboard-da göstər.

### 🔵 B6 — Data layer public form-u admin action-a bağlayır
**Fayl:** `src/components/sections/ApplicationForm.tsx:8`
```ts
import { createApplication } from "@/app/admin/(cms)/muraciyyatler/actions";
```
Public müraciət forması admin route qrupu altındakı action-u idxal edir. Təmiz arxitektura üçün public write action-ı `src/app/actions/applications.ts` və ya `src/lib/actions/` altına köçür.

### 🟢 B-Müsbətlər
- Coxdilli schema açıq və genişlənə bilən (`_az/_ru/_en` sütunları, jsonb massivlər) ✅
- Migration-lar idempotent (`if not exists`, `drop policy if exists`) ✅
- Trigger ilə avtomatik `updated_at` ✅
- Statik fallback məlumatı (`src/data/`) → offline-də işləyir ✅
- Type-safe mappers (`mapCountryRow`) ✅

---

## 3. Senior Frontend Perspektivi

### 🟠 F1 — Çox ağır client bundle (marketing sayt üçün)
**Fayl:** `package.json:17-37`

Client-ə göndərilən kitabxanalar: `three` + `@react-three/drei` + `@react-three/fiber` (3D), `gsap`, `framer-motion`, `lenis` (smooth scroll), `react-parallax-tilt`. Marketing/CMS sayt üçün bu **çox ağırdır** — ilk JS payload yüzlərlə KB.

**Təsir:** Mobil cihazlarda yavaş ilk render, aşağı Lighthouse skorları, SEO-dan mənfi təsir (Core Web Vitals — LCP/INP).

**Həll:**
1. Hero 3D-ni `next/dynamic(() => ..., { ssr: false })` ilə lazy-load et və yalnız `prefers-reduced-motion: no-preference` + viewport-da olduqda yüklə.
2. `gsap` və `framer-motion`-dan yalnız birini saxla (ikisi eyni işi görür).
3. `lenis`-i conditional yüklə (mobil-də sıradan çıxarsın).
4. `optimizePackageImports` artıq konfiqurasiya edilib (`next.config.ts:14-23`) ✅ — amma bu kifayət deyil, dynamic import lazımdır.

### 🟡 F2 — React 19 + Next 16 — çox yeni (sürüm riski)
`react@19.2.4`, `next@16.2.10`. Bu versiyalar çox təzədir; bəzi üçüncü tərəf kitabxanalar (xüsusən three.js ekosistem, R3F) React 19-da tam stabil deyil. Production-da gözlənilməz hydration/SSR xətaları riski.

**Həll:** Daimi e2e testləri (var, bax Testlər) saxla; ən kritik axınları əhatə et. Edge case-lərdə React 18/LTS-ə qayıtmağı düşün.

### 🟡 F3 — `attestat_avg` server-də range validasiya olunmur
**Fayl:** `src/lib/validations/contact.schema.ts:10-13` vs `ApplicationForm.tsx:86` (`min={40} max={100}`)

HTML input-da `min/max` var, amma zod schema-da yoxdur. Server action bu inputa etibar edə bilməz — hücumçu 40-100 xarici dəyər göndərə bilər.

**Həll:** `z.number().min(40).max(100).optional()` schema-ya əlavə et.

### 🟡 F4 — Form axını: nəticə yalnız local state-də
**Fayl:** `src/components/sections/ApplicationForm.tsx:13,38`

Uğur halı `setSubmitted(true)` ilə yerli state-də. Sayt yenilənəndə uğur mesajı itir. Sorğunun nəticəsi analytics-ə getmir. Konversiya izləmə üçün event (GA / Plausible / Yandex.Metrica) göndərilmir.

### 🔵 F5 — Accessibility (əlçatımlılıq) yoxlanışı lazımdır
- Glass morphism dizayn (`glass`, `glass-strong`) kontrast aşağı sala bilər → WCAG AA kontrast ratio yoxlanmalı.
- Form xətaları `text-brand-primary` (qırmızı) — gözəl, amma `aria-invalid` və `aria-describedby` linklənməyib.
- 3D/parallax animasiyalar `prefers-reduced-motion` respectful olmaya bilər.

### 🟢 F-Müsbətlər
- `react-hook-form` + zodresolver — müasir form yanaşması ✅
- `tailwind-merge` + `clsx` (`cn` util) — klassik idiomatik quruluş ✅
- Coxdilli routing (next-intl) doğru qurulub ✅
- `optimizePackageImports` konfiqurasiyası ✅

---

## 4. Senior UI/UX Perspektivi

### 🟡 U1 — Login səhifəsində "Parolunu unutdun" yoxdur
**Fayl:** `src/app/admin/login/page.tsx`

Admin parolunu unudanda bərpa yolu yoxdur (yalnız Supabase dashboard-dən). Tövsiyə: "Parolunu unutdun?" linki → Supabase reset email.

### 🟡 U2 — Admin notification/toast sistemi yoxdur
Form xətaları yalnız bəzi yerlərdə inline göstərilir. Uğurlu əməliyyat (məs. ölkə silindi) üçün ümumi feedback yoxdur. İstifadəçi əmin ola bilmir ki, əməliyyat baş tutdu.

**Həll:** `sonner` və ya `react-hot-toast` ilə mərkəzləşmiş bildiriş.

### 🟡 U3 — CMS-də axtarış/filtr yoxdur
Böyük siyahılarda (universitetlər, FAQ) axtarış və ya ölkə-yə filter yoxdur. Məzmun artdıqca idarəetmə çətinləşir.

### 🔵 U4 — Success state emoji asılı (🎉)
**Fayl:** `ApplicationForm.tsx:42`. Emoji renderingu platformadan asılıdır. Bir ikon (lucide-react) daha konsistentdir.

### 🟢 U-Müsbətlər
- Coxdilli interfeys tam tərcümə olunub ✅
- Admin layout (Sidebar + Topbar) aydın və naviqasiya intuitiv ✅
- `loading.tsx`, `error.tsx`, `not-found.tsx` mövcuddur ✅ (App Router ən yaxşı praktika)

---

## 5. Senior DevOps Perspektivi

### 🟠 D1 — CI/CD pipeline tamamilə yoxdur
**Fayl:** `.github/` qovluğu **yoxdur**.

Heç bir avtomatik: lint, type-check, test, build, deploy. Hər dəyişiklik əl ilə push və yəqin ki əl ilə Vercel deploy.

**Risk:** Regression-lar asanlıqla main-ə düşür; `next build` qırılarsa production-a təsir edir.

**Həll:** `.github/workflows/ci.yml`:
```yaml
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
      - run: npm test
```
Vercel-də "Preview Deployment" hər PR üçün açıqdır (default) — bundan istifadə et.

### 🟠 D2 — Migration idarəetməsi əl ilədir
**Fayllar:** `supabase/migrations/*.sql` başlıqları: *"SQL Editor-da işə salın"*.

Migration-lar `supabase db push` / `supabase migration up` ilə avtomatik deyil, əl ilə SQL Editor-da çalışdırılır. Bu, environment-lar (dev/staging/prod) arasında drift yaradır; hansı migration-ın hansı environment-də işə düşdüyü izlənilmir.

**Həll:** Supabase CLI + `supabase link` + `supabase db push` ilə declarative deploy. CI-ə əlavə et.

### 🟡 D3 — Monitoring / observability yoxdur
Heç bir error tracking (Sentry), analytics (Plausible/Vercel Analytics), uptime monitor və ya log aggregation yoxdur. Production xətası "səssizcə" baş verir.

**Həll:** 
- `@sentry/nextjs` (runtime xətalar).
- Vercel Analytics və ya Plausible (privacy-first) — ziyarət + konversiya.
- Supabase dashboard-də database health/alerts aktivləşdir.

### 🟡 D4 — Environment / secret idarəetmə
`.env.local` lokalda var, amma: staging/prod env-ləri harada? Ehtimal ki, Vercel Environment Variables. Bu OK, amma **SERVICE_ROLE_KEY** keyfiyyəti və rotasiya strategiyası yoxdur. Açar sızarsa rotasiya proseduru dokumentləşdirilməyib.

### 🟡 D5 — Backup strategiyası yoxdur
Supabase free/starter planda point-in-time recovery məhdud. CMS məzmunu silinərsə (S1 istismarı və ya səhv) bərpa yolun yoxdur.

**Həll:** Gündəlik `pg_dump` cron job (GitHub Actions və ya Supabase scheduled backup), S3-a yaz.

### 🟡 D6 — npm audit tapıntıları
`npm audit` nəticəsi:
- 🔴 **`vite` HIGH** — path traversal (Windows), `<=6.4.2` — devDependency (vitest vasitəsilə). Production runtime-a təsir yoxdur, amma dev/CI windows maşınlarında risk.
- 🟡 **`postcss` moderate XSS** — `next` içində bundled (`<8.5.10`). Build-time, amma yenə də update tövsiyə.
- 🟡 **`esbuild` moderate** — dev server CSRF.
- 🟡 **`@vitest/mocker`, `vitest`** — dev-only.

**Həll:** `npm audit fix` (vite/esbuild/vitest major upgrade). `next`-i ən son patch-a götür (postcss yenilənər). Əksər tapıntı devDependency olsa da, clean audit hədəflə.

### 🟢 D-Müsbətlər
- `.gitignore` düzgün (env, node_modules, .next, playwright reportlar) ✅
- Vercel-ə deploy üçün hazır (`next start`, standart config) ✅
- `type-check` və `lint` script-ləri mövcuddur (sadəcə avtomatik işlədilmir) ✅

---

## 6. Testlərin Vəziyyəti

**Mövcud:** `tests/unit/` (4 fayl: schemas, mappers, cost, contact.schema) + `tests/e2e/` (4: multilang, home, form, admin). Vitest + Playwright konfiqurasiyası var. ✅

**Çatışmayan:**
- Server action-lar üçün test yoxdur (xüsusən auth/RLS davranışı).
- RLS policy-lərinin testi yoxdur (anon yazılmalı deyil, authenticated admin yazmalıdır).
- Edge case: böyük siyahılar, network xətası, Supabase offline fallback.
- CI-də işləmirlər (D1).

---

## 7. Faza-faza Həll Yol Xəritəsi (Roadmap)

Aşağıdakı fazalar **təsir/səy nisbətinə** görə sıralanıb. Hər faza müstəqil başa çatdırıla bilər.

### 🔴 FAZA 1 — Təcili Təhlükəsizlik (1-2 gün)
**Məqsəd:** Kritik avtorizasiya boşluğunu bağlamaq.

- [ ] **S1:** Supabase Dashboard → Authentication → Email signup-ı **bağla** (yalnız invite).
- [ ] **S1:** Mövcud admin istifadəçisinə `raw_app_meta_data = { role: 'admin' }` əlavə et.
- [ ] **S1:** Yeni migration `0004_admin_rls.sql`: bütün `for all to authenticated using (true)` policy-ləri `using (auth.jwt() ->> 'role' = 'admin')` ilə əvəz et.
- [ ] **S3:** Hər admin server action-un başında `app_metadata.role === 'admin'` yoxlaması (defense in depth).
- [ ] **S6:** Server action xətalarını logla, client-ə ümumi mesaj qaytar.

**Doğrulama:** Yeni (qeyri-admin) istifadəçi ilə signup edib CMS write cəhdi → rədd edilməlidir (hətta birbaşa Supabase API ilə).

### 🟠 FAZA 2 — Form qorunması + CI (2-3 gün)
- [ ] **S2:** `createApplication`-a rate-limit (Upstash Ratelimit) + Cloudflare Turnstile əlavə et.
- [ ] **S2:** Honeypot field.
- [ ] **S4:** `status` üçün zod enum validasiyası.
- [ ] **F3:** `attestat_avg` üçün server-side min/max.
- [ ] **D1:** `.github/workflows/ci.yml` — lint + type-check + build + test.
- [ ] **D6:** `npm audit fix` (vitest/vite/esbuild major upgrade).

### 🟡 FAZA 3 — Performans + cache (2-4 gün)
- [ ] **B1:** `unstable_cache` + `revalidateTag` ilə data layer cache. Admin update-də tag invalidate.
- [ ] **F1:** 3D/animasiya kitabxanalarını dynamic import + viewport/reduced-motion conditional.
- [ ] **B3:** Çatışmayan DB indeksləri əlavə et (`0005_indexes.sql`).
- [ ] **B2:** Admin siyahılarda pagination.
- [ ] **F2/F5:** Core Web Vitals ölç (Lighthouse CI), accessibility audit.

### 🟡 FAZA 4 — Əməliyyat dayanıqlığı (3-5 gün)
- [ ] **D2:** Supabase CLI migration avtomatlaşdırması (`supabase db push` CI-də).
- [ ] **D3:** Sentry (xəta) + Plausible/Vercel Analytics (trafik) inteqrasiyası.
- [ ] **D5:** Gündəlik `pg_dump` backup (GitHub Actions cron → S3).
- [ ] **B4:** Soft delete + `audit_log` cədvəli.
- [ ] **D4:** Service role key rotasiya proseduru dokumentləşdir.

### 🔵 FAZA 5 — UX təkmilləşdirmə (mümkün qədər)
- [ ] **U1:** "Parolunu unutdun" axını.
- [ ] **U2:** Toast/notification sistemi (sonner).
- [ ] **U3:** CMS axtarış/filtr.
- [ ] **B6:** Public form action-ını `src/lib/actions/` altına köçür (arxitektura).
- [ ] Test əhatəsini artır: server action + RLS policy testləri CI-də.

---

## 8. Tez Metrika Xülasəsi

| Perspektiv | Kritik | Yüksək | Orta | Aşağı | Ümumi sağlamlıq |
|---|---|---|---|---|---|
| Security | 1 (S1) | 1 (S2) | 3 | — | 🔴 Təcili müdaxilə |
| Backend | — | 1 (B1) | 4 | 1 | 🟡 Orta |
| Frontend | — | 1 (F1) | 3 | 1 | 🟡 Orta |
| UI/UX | — | — | 3 | 1 | 🟢 Yaxşı |
| DevOps | — | 2 (D1,D2) | 4 | — | 🟠 Zəif |

**Nəticə:** Kod keyfiyyəti və arxitektura **yaxşıdır**, amma **təhlükəsizlik (S1) və əməliyyat hazırlığı (CI/CD)** production-a keçidə mane olan bloklar var. Faza 1 bitirmədən real istifadəçiyə açmamaq tövsiyə olunur.

---

*Bu analiz statik kod oxuma, npm audit və migration/RLS icmalına əsaslanır. Dynamic penetrasiya testi (həqiqi Supabase layihəsinə qarşı) Faz 1-dən sonra tövsiyə olunur.*

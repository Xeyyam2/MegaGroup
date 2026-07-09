# MegaGroup — Təhlükəsizlik Tənzimləməsi (Security Setup)

Bu sənəd Faza 1 və Faza 2-də edilən dəyişikliklərin **xarici/əl ilə** aktivləşdirilmə addımlarını cəmləyir.
Kod dəyişiklikləri artıq edilib; buradakılar yalnız Supabase/Cloudflare/Upstash tərəfində edilənlərdir.

---

## 1. Admin avtorizasiyası (KRİTİK — Faza 1)

RLS policy-ləri artıq yalnız `app_metadata.role = 'admin'` olan istifadəçilərə yazma icazəsi verir
(`supabase/migrations/0004_admin_rls.sql`). Bunun işləməsi üçün:

### 1.1. Email signup-ı bağla
Supabase Dashboard → **Authentication → Providers → Email** →
**"Enable email signup" = OFF**. Artıq heç kəs özbaşına qeydiyyatdan keçə bilmir; yalnız admin
dəvət edə bilər (Dashboard → Users → *Add user*).

### 1.2. Migration-ı işə sal
```bash
supabase db push
# və ya Supabase SQL Editor-də supabase/migrations/0004_admin_rls.sql məzmununu yapışdırıb çalışdır
```

### 1.3. Mövcud admin istifadəçisinə rol əlavə et
Supabase SQL Editor-da (öz emailinizlə əvəz edin):
```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'SİZİN_ADMIN_EMAIL@example.com';
```
> Diqqət: bundan sonra admin user yenidən login olmalıdır ki, yeni JWT-ə rol düşsün.

### 1.4. Doğrulama
- Mövcud admin ilə login → CMS işləyir ✓
- Yeni (qeyri-admin) hesabla signup mümkün deyil; əgər əvvəlcədən varsa, admin write cəhdi rədd olunur ✓

---

## 2. Rate-limit (Upstash — Faza 2, opsional)

`src/lib/rate-limit.ts` Upstash konfiqurasiya olunmayıbsa **deaktiv** olur (honeypot qoruyur).
Aktivləşdirmək üçün:

1. https://upstash.com hesab aç, Redis DB yarat.
2. REST URL və token-i `.env.local` (və Vercel Environment Variables) əlavə et:
   ```
   UPSTASH_REDIS_REST_URL=https://....upstash.io
   UPSTASH_REDIS_REST_TOKEN=....
   ```
Limit: **10 müraciət / saat / IP** (sliding window). Dəyişmək üçün `src/lib/rate-limit.ts`.

---

## 3. Turnstile (Cloudflare — Faza 2, opsional)

`src/lib/turnstile.ts` və `TurnstileWidget` site key yoxdursa **deaktiv** olur.
Aktivləşdirmək üçün:

1. https://dash.cloudflare.com → Turnstile → widget yarat (managed mode).
2. Key-ləri `.env.local` əlavə et:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...   (client widget)
   TURNSTILE_SECRET_KEY=...             (server verify)
   ```
Widget avtomatik form-da görünəcək və token serverdə yoxlanacaq.

---

## 4. CI/CD (Faza 2)

`.github/workflows/ci.yml` hər push/PR-da: lint → type-check → test → build.
GitHub repo-ya push etdikdə avtomatik işləyir. Əlavə env tələb etmir (build statik fallback işlədir).

---

## 5. Qalan audit tapıntıları

`npm audit`-də 3 **moderate** qalır — hamısı `postcss` paketinin `next` içindəki build-time
versiyasıdır (runtime təsiri yoxdur; `next` upstream yenilənməsini gözləyir).

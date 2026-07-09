-- MegaGroup — Admin RLS policy-lərini rol-yoxlamalı edir
-- 0001-də "for all to authenticated using(true)" olan policy-ləri əvəz edir.
-- İndi yalnız JWT app_metadata.role === 'admin' olan istifadəçilər yaza bilər.
--
-- ZƏRURİ ADDIM (migration-dan əvvəl və ya sonra):
--   1) Supabase Dashboard → Authentication → Providers → Email → "Enable email signup" = OFF
--   2) Mövcud admin istifadəçisinə rol əlavə et (SQL Editor):
--        update auth.users
--        set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--        where email = 'SİZİN_ADMIN_EMAIL@example.com';

-- ============================================
-- KÖMƏKÇİ: admin yoxlaması
-- auth.jwt() içində app_metadata.role varsa admin sayırıq
-- ============================================

-- ============================================
-- CMS cədvəlləri (7): admin-yazma policy-lərini sıxlaşdır
-- ============================================

-- countries
drop policy if exists "admin write countries" on public.countries;
create policy "admin write countries" on public.countries
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- universities
drop policy if exists "admin write universities" on public.universities;
create policy "admin write universities" on public.universities
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- faculties
drop policy if exists "admin write faculties" on public.faculties;
create policy "admin write faculties" on public.faculties
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- university_fees
drop policy if exists "admin write fees" on public.university_fees;
create policy "admin write fees" on public.university_fees
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- faqs
drop policy if exists "admin write faqs" on public.faqs;
create policy "admin write faqs" on public.faqs
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- testimonials
drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- site_content
drop policy if exists "admin write site_content" on public.site_content;
create policy "admin write site_content" on public.site_content
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================
-- applications: oxuma/yeniləmə/silmə yalnız admin
-- (anon INSERT qalır — public müraciət forması üçün)
-- ============================================

-- INSERT (anon + authenticated) — dəyişmir, 0003-də qalıb

-- READ — yalnız admin
drop policy if exists "Authenticated read applications" on public.applications;
create policy "admin read applications" on public.applications
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- UPDATE — yalnız admin
drop policy if exists "Authenticated update applications" on public.applications;
create policy "admin update applications" on public.applications
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- DELETE — yalnız admin
drop policy if exists "Authenticated delete applications" on public.applications;
create policy "admin delete applications" on public.applications
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

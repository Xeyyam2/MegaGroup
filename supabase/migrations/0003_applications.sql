-- MegaGroup — Müraciət (applications) cədvəli
-- Supabase SQL Editor-da işə salın (və ya supabase db push).

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  country_interest text,
  attestat_avg int,
  message text,
  status text not null default 'yeni',  -- yeni | goruldu | qebul_edildi | imtina
  created_at timestamptz not null default now()
);

create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_created on public.applications(created_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.applications enable row level security;

-- Əvvəlki policy təkrarlanmasın deyə təmizləyirik (idempotent)
drop policy if exists "Public insert applications" on public.applications;
drop policy if exists "Anyone can insert applications" on public.applications;
drop policy if exists "Authenticated read applications" on public.applications;
drop policy if exists "Authenticated update applications" on public.applications;
drop policy if exists "Authenticated delete applications" on public.applications;

-- INSERT — həm anon (girişsiz istifadəçi), həm authenticated (admin)
create policy "Anyone can insert applications"
  on public.applications for insert
  to anon, authenticated with check (true);

-- Authenticated (admin) — SELECT/UPDATE/DELETE (oxuma, status dəyişmə, silmə)
create policy "Authenticated read applications"
  on public.applications for select
  to authenticated using (true);

create policy "Authenticated update applications"
  on public.applications for update
  to authenticated using (true);

create policy "Authenticated delete applications"
  on public.applications for delete
  to authenticated using (true);

-- ============================================
-- GRANTS (0002-də anon yalnız SELECT alıb, ona görə INSERT əlavə edirik)
-- ============================================
GRANT SELECT, INSERT ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL PRIVILEGES ON public.applications TO service_role;

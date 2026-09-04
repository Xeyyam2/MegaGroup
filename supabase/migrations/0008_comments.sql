-- MegaGroup — UGC sual-cavab (comments) cədvəli — seo.md 5 (P2)
-- Bloq məqalələri altında moderasiyalı şərh/sual bölməsi.
-- Supabase SQL Editor-da işə salın (və ya supabase db push).

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  author_name text not null,
  question text not null,
  answer text,                          -- admin cavabı (dərc üçün)
  answered_by text,                     -- cavab verən admin (ad)
  is_published boolean not null default false,
  published_at timestamptz,
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_article on public.comments(article_slug, is_published, is_deleted);
create index if not exists idx_comments_pending on public.comments(is_published, is_deleted, created_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.comments enable row level security;

drop policy if exists "Anyone can insert comments" on public.comments;
drop policy if exists "Authenticated read comments" on public.comments;
drop policy if exists "Authenticated update comments" on public.comments;
drop policy if exists "Authenticated delete comments" on public.comments;

-- INSERT — həm anon (girişsiz istifadəçi), həm authenticated (admin)
create policy "Anyone can insert comments"
  on public.comments for insert
  to anon, authenticated with check (true);

-- Authenticated (admin) — tam access
create policy "Authenticated read comments"
  on public.comments for select
  to authenticated using (true);

create policy "Authenticated update comments"
  on public.comments for update
  to authenticated using (true);

create policy "Authenticated delete comments"
  on public.comments for delete
  to authenticated using (true);

-- ============================================
-- GRANTS
-- ============================================
GRANT SELECT, INSERT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL PRIVILEGES ON public.comments TO service_role;

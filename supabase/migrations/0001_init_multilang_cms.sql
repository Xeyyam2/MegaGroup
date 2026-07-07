-- MegaGroup CMS — coxdilli sema
-- Supabase SQL Editor-da isledin VEYA supabase db push ile

-- ============================================
-- TABLES
-- ============================================
create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  flag_emoji text,
  hero_image_url text,
  sort_order int default 0,
  is_active boolean default true,
  is_featured boolean default false,
  name_az text not null,
  name_ru text,
  name_en text,
  description_az text, description_ru text, description_en text,
  warning_banner_az text, warning_banner_ru text, warning_banner_en text,
  advantages_az jsonb default '[]'::jsonb, advantages_ru jsonb default '[]'::jsonb, advantages_en jsonb default '[]'::jsonb,
  documents_az jsonb default '[]'::jsonb, documents_ru jsonb default '[]'::jsonb, documents_en jsonb default '[]'::jsonb,
  steps_az jsonb default '[]'::jsonb, steps_ru jsonb default '[]'::jsonb, steps_en jsonb default '[]'::jsonb,
  qs_universities int, qs_avg_tuition_usd int, qs_language text, qs_visa_difficulty text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  country_slug text not null references public.countries(slug),
  website_url text, logo_url text, hero_image_url text,
  is_active boolean default true, is_featured boolean default false,
  name_az text not null, name_ru text, name_en text,
  city_az text not null, city_ru text, city_en text,
  highlights_az jsonb default '[]'::jsonb, highlights_ru jsonb default '[]'::jsonb, highlights_en jsonb default '[]'::jsonb,
  notes_az text, notes_ru text, notes_en text,
  campus_info_az text, campus_info_ru text, campus_info_en text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.faculties (
  id uuid primary key default gen_random_uuid(),
  university_slug text not null references public.universities(slug) on delete cascade,
  name_az text not null, name_ru text, name_en text,
  is_competitive boolean, duration_years int, language text,
  sort_order int default 0
);

create table if not exists public.university_fees (
  university_slug text primary key references public.universities(slug) on delete cascade,
  tuition_min_usd int default 0, tuition_max_usd int default 0,
  dorm_min_usd int default 0, dorm_max_usd int default 0,
  food_min_usd int default 0, food_max_usd int default 0,
  transport_min_usd int default 0, transport_max_usd int default 0,
  personal_min_usd int default 0, personal_max_usd int default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  country_slug text references public.countries(slug) on delete cascade,
  university_slug text references public.universities(slug) on delete cascade,
  question_az text not null, question_ru text, question_en text,
  answer_az text not null, answer_ru text, answer_en text,
  sort_order int default 0
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  university_slug text references public.universities(slug) on delete set null,
  country_slug text references public.countries(slug) on delete set null,
  photo_url text,
  quote_az text not null, quote_ru text, quote_en text,
  year int, is_active boolean default true, sort_order int default 0
);

create table if not exists public.site_content (
  key text primary key,
  value_az text not null, value_ru text, value_en text,
  updated_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_universities_country_slug on public.universities(country_slug);
create index if not exists idx_faculties_university_slug on public.faculties(university_slug);
create index if not exists idx_faqs_country_slug on public.faqs(country_slug);
create index if not exists idx_faqs_university_slug on public.faqs(university_slug);

-- ============================================
-- TRIGGERS (auto updated_at)
-- ============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists countries_updated_at on public.countries;
create trigger countries_updated_at before update on public.countries
  for each row execute function public.set_updated_at();
drop trigger if exists universities_updated_at on public.universities;
create trigger universities_updated_at before update on public.universities
  for each row execute function public.set_updated_at();
drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.countries enable row level security;
alter table public.universities enable row level security;
alter table public.faculties enable row level security;
alter table public.university_fees enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_content enable row level security;

-- Public read
create policy "public read countries" on public.countries for select using (true);
create policy "public read universities" on public.universities for select using (true);
create policy "public read faculties" on public.faculties for select using (true);
create policy "public read fees" on public.university_fees for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read site_content" on public.site_content for select using (true);

-- Admin write (authenticated)
create policy "admin write countries" on public.countries for all to authenticated using (true) with check (true);
create policy "admin write universities" on public.universities for all to authenticated using (true) with check (true);
create policy "admin write faculties" on public.faculties for all to authenticated using (true) with check (true);
create policy "admin write fees" on public.university_fees for all to authenticated using (true) with check (true);
create policy "admin write faqs" on public.faqs for all to authenticated using (true) with check (true);
create policy "admin write testimonials" on public.testimonials for all to authenticated using (true) with check (true);
create policy "admin write site_content" on public.site_content for all to authenticated using (true) with check (true);

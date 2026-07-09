-- MegaGroup — əlavə indekslər (oxuma/axtarış performansı üçün)
-- 0001 və 0003-də olan indekslərə əlavədir. İdempotent.

-- ============================================
-- applications: admin axtarışı (ad, email) və mövcud status/created indeksləri
-- ============================================
create index if not exists idx_applications_full_name on public.applications(full_name);
create index if not exists idx_applications_email on public.applications(email);

-- ============================================
-- universities: home/featured filtrleri
-- ============================================
create index if not exists idx_universities_active_featured on public.universities(is_active, is_featured);

-- ============================================
-- testimonials: aktiv + sıralı oxuma (home page)
-- ============================================
create index if not exists idx_testimonials_active_sort on public.testimonials(is_active, sort_order);

-- ============================================
-- universities: fakültələrə görə axtarış üçün (varsa, city üzrə də faydalı)
-- ============================================
create index if not exists idx_universities_active_slug on public.universities(is_active, slug);

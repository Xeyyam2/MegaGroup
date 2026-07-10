-- Soft delete: is_deleted + deleted_at on all CMS tables.
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.faculties ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.faculties ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.university_fees ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.university_fees ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_countries_deleted ON public.countries(is_deleted);
CREATE INDEX IF NOT EXISTS idx_universities_deleted ON public.universities(is_deleted);
CREATE INDEX IF NOT EXISTS idx_testimonials_deleted ON public.testimonials(is_deleted);
CREATE INDEX IF NOT EXISTS idx_faqs_deleted ON public.faqs(is_deleted);

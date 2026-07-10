-- Audit log: CMS cədvəllərindəki bütün INSERT/UPDATE/DELETE əməliyyatlarını qeyd edir.
-- Məqsəd: təhlükəsizlik uyğunluğu və bərpa qabiliyyəti.
--
-- Qeyd: site_content cədvəlinin `id` sütunu yoxdur (key-baseddir),
-- ona görə də trigger `to_jsonb(NEW)->>'id'` istifadə edir — id olduqda
-- onu götürür, olmadıqda NULL qaytarır (səhv atmir).

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,        -- INSERT | UPDATE | DELETE
  table_name text NOT NULL,
  row_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Yalniz admin oxuya biler; yazmaq yalniz trigger vasitesiyle (SECURITY DEFINER).
CREATE POLICY "admin read audit" ON public.audit_log
  FOR SELECT TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_table ON public.audit_log(table_name);

-- Trigger funksiyasi: her INSERT/UPDATE/DELETE-de audit_log-a yazir.
-- to_jsonb(...)->>'id' istifadə olunur ki, `id` sütunu olmayan cədvəllər
-- (məs. site_content) üçün səhv atmasın — row_id sadəcə NULL olur.
CREATE OR REPLACE FUNCTION public.fn_audit() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, table_name, row_id, before, after)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(
      CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD)->>'id' END,
      CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW)->>'id' END
    ),
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach to CMS tables. Idempotent: drop-if-exists əvvəlcə, sonra create.
DROP TRIGGER IF EXISTS trg_audit_countries ON public.countries;
CREATE TRIGGER trg_audit_countries AFTER INSERT OR UPDATE OR DELETE ON public.countries
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();

DROP TRIGGER IF EXISTS trg_audit_universities ON public.universities;
CREATE TRIGGER trg_audit_universities AFTER INSERT OR UPDATE OR DELETE ON public.universities
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();

DROP TRIGGER IF EXISTS trg_audit_faqs ON public.faqs;
CREATE TRIGGER trg_audit_faqs AFTER INSERT OR UPDATE OR DELETE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();

DROP TRIGGER IF EXISTS trg_audit_testimonials ON public.testimonials;
CREATE TRIGGER trg_audit_testimonials AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();

DROP TRIGGER IF EXISTS trg_audit_site_content ON public.site_content;
CREATE TRIGGER trg_audit_site_content AFTER INSERT OR UPDATE OR DELETE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();

DROP TRIGGER IF EXISTS trg_audit_applications ON public.applications;
CREATE TRIGGER trg_audit_applications AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.fn_audit();

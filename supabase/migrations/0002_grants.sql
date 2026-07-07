-- MegaGroup CMS — cədvəl icazələri (GRANT)
-- SQL Editor-da işə salın. Bu, service_role/anon/authenticated rollarına yazma/oxuma icazəsi verir.
-- 0001 migration-ı cədvəlləri yaradıb, lakin icazələri verməyib (SQL Editor xüsusiyyəti).

-- service_role: RLS-i bypass edir, tam yazma/oxuma
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- anon: yalnız SELECT (public read, RLS ilə)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- authenticated: SELECT/INSERT/UPDATE/DELETE (CMS admin, RLS ilə)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Gələcəkdə yaradılacaq cədvəllər üçün default icazələr
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO service_role;
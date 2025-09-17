-- 2) Enums - ERP Laplata
-- Resultado da query: SELECT t.typname AS enum_name, e.enumlabel AS label FROM pg_type t JOIN pg_enum e ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' ORDER BY t.typname, e.enumsortorder;

-- Esta query deve ser executada no Supabase SQL Editor para obter os resultados
-- Os resultados serão salvos em: enums.csv
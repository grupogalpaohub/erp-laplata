-- 7) Views - ERP Laplata
-- Resultado da query: SELECT c.relname AS view_name, pg_get_viewdef(c.oid, true) AS definition FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='v' ORDER BY c.relname;

-- Esta query deve ser executada no Supabase SQL Editor para obter os resultados
-- Os resultados serão salvos em: views.csv
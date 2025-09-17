-- 4) Indexes - ERP Laplata
-- Resultado da query: SELECT tab.relname AS table_name, idx.relname AS index_name, pg_get_indexdef(i.oid) AS indexdef FROM pg_index i JOIN pg_class idx ON idx.oid=i.indexrelid JOIN pg_class tab ON tab.oid=i.indrelid JOIN pg_namespace n ON n.oid=tab.relnamespace WHERE n.nspname='public' ORDER BY tab.relname, idx.relname;

-- Esta query deve ser executada no Supabase SQL Editor para obter os resultados
-- Os resultados serão salvos em: indexes.csv
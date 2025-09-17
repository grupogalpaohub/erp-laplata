-- 1) Tabelas e colunas - ERP Laplata
-- Resultado da query: SELECT c.relname AS table_name, a.attnum, a.attname AS column_name, pg_catalog.format_type(a.atttypid,a.atttypmod) AS data_type, (NOT a.attnotnull) AS is_nullable, pg_get_expr(ad.adbin, ad.adrelid) AS default_expr FROM pg_attribute a JOIN pg_class c ON a.attrelid=c.oid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_attrdef ad ON a.attrelid=ad.adrelid AND a.attnum=ad.adnum WHERE n.nspname='public' AND c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped ORDER BY c.relname, a.attnum;

-- Esta query deve ser executada no Supabase SQL Editor para obter os resultados
-- Os resultados serão salvos em: tables_columns.csv
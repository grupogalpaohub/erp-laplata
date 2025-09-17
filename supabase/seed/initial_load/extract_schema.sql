-- Script para extrair estrutura completa do banco
-- ERP Laplata - Schema Documentation

-- 1) Tabelas e colunas
\copy (SELECT c.relname AS table_name, a.attnum, a.attname AS column_name, pg_catalog.format_type(a.atttypid,a.atttypmod) AS data_type, (NOT a.attnotnull) AS is_nullable, pg_get_expr(ad.adbin, ad.adrelid) AS default_expr FROM pg_attribute a JOIN pg_class c ON a.attrelid=c.oid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_attrdef ad ON a.attrelid=ad.adrelid AND a.attnum=ad.adnum WHERE n.nspname='public' AND c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped ORDER BY c.relname, a.attnum) TO 'tables_columns.csv' WITH CSV HEADER;

-- 2) Enums
\copy (SELECT t.typname AS enum_name, e.enumlabel AS label FROM pg_type t JOIN pg_enum e ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' ORDER BY t.typname, e.enumsortorder) TO 'enums.csv' WITH CSV HEADER;

-- 3) Constraints
\copy (SELECT conrelid::regclass AS table_name, contype, conname, pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE connamespace='public'::regnamespace ORDER BY conrelid::regclass::text, contype, conname) TO 'constraints.csv' WITH CSV HEADER;

-- 4) Indexes
\copy (SELECT tab.relname AS table_name, idx.relname AS index_name, pg_get_indexdef(i.oid) AS indexdef FROM pg_index i JOIN pg_class idx ON idx.oid=i.indexrelid JOIN pg_class tab ON tab.oid=i.indrelid JOIN pg_namespace n ON n.oid=tab.relnamespace WHERE n.nspname='public' ORDER BY tab.relname, idx.relname) TO 'indexes.csv' WITH CSV HEADER;

-- 5) Triggers
\copy (SELECT c.relname AS table_name, tg.tgname, pg_get_triggerdef(tg.oid) AS definition FROM pg_trigger tg JOIN pg_class c ON c.oid=tg.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND NOT tg.tgisinternal ORDER BY c.relname, tg.tgname) TO 'triggers.csv' WITH CSV HEADER;

-- 6) Funções
\copy (SELECT p.oid::regprocedure AS signature, pg_get_functiondef(p.oid) AS definition FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' ORDER BY 1) TO 'functions.csv' WITH CSV HEADER;

-- 7) Views
\copy (SELECT c.relname AS view_name, pg_get_viewdef(c.oid, true) AS definition FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind='v' ORDER BY c.relname) TO 'views.csv' WITH CSV HEADER;
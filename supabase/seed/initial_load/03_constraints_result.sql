-- 3) Constraints (PK/UK/FK/Check) - ERP Laplata
-- Resultado da query: SELECT conrelid::regclass AS table_name, contype, conname, pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE connamespace='public'::regnamespace ORDER BY conrelid::regclass::text, contype, conname;

-- Esta query deve ser executada no Supabase SQL Editor para obter os resultados
-- Os resultados serão salvos em: constraints.csv
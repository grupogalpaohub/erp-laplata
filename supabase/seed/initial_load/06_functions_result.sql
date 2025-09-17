-- 6) Funções - ERP Laplata
-- Resultado da query: SELECT p.oid::regprocedure AS signature, pg_get_functiondef(p.oid) AS definition FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' ORDER BY 1;

-- Esta query deve ser executada no Supabase SQL Editor para obter os resultados
-- Os resultados serão salvos em: functions.csv
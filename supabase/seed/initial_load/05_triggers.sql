-- 5) Triggers
SELECT c.relname AS table_name, tg.tgname, pg_get_triggerdef(tg.oid) AS definition
FROM pg_trigger tg
JOIN pg_class c ON c.oid=tg.tgrelid
JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND NOT tg.tgisinternal
ORDER BY c.relname, tg.tgname;
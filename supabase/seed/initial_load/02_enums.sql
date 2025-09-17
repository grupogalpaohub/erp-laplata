-- 2) Enums
SELECT t.typname AS enum_name, e.enumlabel AS label
FROM pg_type t
JOIN pg_enum e ON t.oid=e.enumtypid
JOIN pg_namespace n ON n.oid=t.typnamespace
WHERE n.nspname='public'
ORDER BY t.typname, e.enumsortorder;
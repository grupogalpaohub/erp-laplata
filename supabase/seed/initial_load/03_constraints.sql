-- 3) Constraints (PK/UK/FK/Check)
SELECT conrelid::regclass AS table_name, contype, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE connamespace='public'::regnamespace
ORDER BY conrelid::regclass::text, contype, conname;
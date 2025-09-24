-- =====================================================
-- INVESTIGAÇÃO COMPLETA DO SUPABASE ATUAL
-- ERP LaPlata - Análise pós-harmonização
-- =====================================================

-- 1) TABELAS EXISTENTES
SELECT 
  table_name,
  table_type,
  CASE 
    WHEN table_name LIKE 'mm_%' THEN 'MM - Material Management'
    WHEN table_name LIKE 'sd_%' THEN 'SD - Sales & Distribution'
    WHEN table_name LIKE 'crm_%' THEN 'CRM - Customer Relationship'
    WHEN table_name LIKE 'wh_%' THEN 'WH - Warehouse'
    WHEN table_name LIKE 'fi_%' THEN 'FI - Financial'
    WHEN table_name LIKE 'co_%' THEN 'CO - Controlling'
    WHEN table_name LIKE 'doc_%' THEN 'DOC - Document Numbering'
    WHEN table_name LIKE 'audit_%' THEN 'AUDIT - Audit Log'
    ELSE 'OTHER'
  END as module
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY module, table_name;

-- 2) COLUNAS DAS TABELAS PRINCIPAIS
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name IN (
    'mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item',
    'crm_customer', 'sd_sales_order', 'sd_sales_order_item',
    'wh_inventory_balance', 'wh_warehouse',
    'fi_chart_of_accounts', 'fi_accounting_entry', 'fi_accounts_payable', 'fi_accounts_receivable',
    'co_product_cost', 'co_margin_analysis',
    'doc_numbering'
  )
ORDER BY table_name, ordinal_position;

-- 3) CAMPOS MONETÁRIOS (VERIFICAR PADRÃO _cents)
SELECT 
  table_name,
  column_name,
  data_type,
  CASE 
    WHEN column_name LIKE '%_cents' THEN '✅ CORRETO'
    WHEN column_name ~* '(amount|price|total|valor|preco)$' THEN '❌ DEVERIA SER _cents'
    ELSE '➖ NEUTRO'
  END as money_standard
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND data_type IN ('integer','bigint','numeric','decimal')
  AND column_name ~* '(amount|price|total|valor|preco|cents)'
ORDER BY table_name, column_name;

-- 4) TABELAS COM/SEM tenant_id
SELECT 
  table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns c
      WHERE c.table_schema = 'public' 
        AND c.table_name = t.table_name 
        AND c.column_name = 'tenant_id'
    ) THEN '✅ TEM tenant_id'
    ELSE '❌ SEM tenant_id'
  END as tenant_id_status
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name NOT LIKE 'pg_%'
  AND table_name NOT LIKE 'information_schema%'
ORDER BY table_name;

-- 5) RLS STATUS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ATIVO'
    ELSE '❌ RLS DESATIVO'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 6) POLICIES RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  qual as condition
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7) CONSTRAINTS (PK, FK, UK)
SELECT 
  conrelid::regclass AS table_name,
  contype,
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, contype, conname;

-- 8) TRIGGERS
SELECT 
  c.relname AS table_name,
  tg.tgname as trigger_name,
  pg_get_triggerdef(tg.oid) AS definition
FROM pg_trigger tg
JOIN pg_class c ON c.oid = tg.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND NOT tg.tgisinternal
ORDER BY c.relname, tg.tgname;

-- 9) FUNÇÕES CRIADAS
SELECT 
  p.oid::regprocedure AS signature,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname LIKE '%doc%' OR p.proname LIKE '%freeze%' OR p.proname LIKE '%total%'
ORDER BY p.proname;

-- 10) ENUMS
SELECT 
  t.typname AS enum_name, 
  e.enumlabel AS label
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
ORDER BY t.typname, e.enumsortorder;

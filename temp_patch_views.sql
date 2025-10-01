-- =========================================================
-- PATCH: Compatibilidade de Purchase Orders (PO)
-- Objetivo: expor "mm_purchase_order" e "mm_purchase_order_item"
--           como VIEWS com os nomes/colunas que o front espera,
--           mapeando das tabelas reais (mm_order / mm_order_item).
-- Guardrails:
--   * Não remove nem renomeia tabela real.
--   * Usa SECURITY INVOKER para respeitar RLS das tabelas-base.
--   * Mantém multitenancy por tenant_id.
-- =========================================================

-- 1) Descobrir qual é a tabela real dos POs (prioridade mm_order).
DO $$
DECLARE
  has_mm_order       boolean;
  has_mm_order_item  boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'mm_order' AND c.relkind = 'r'
  ) INTO has_mm_order;

  SELECT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'mm_order_item' AND c.relkind = 'r'
  ) INTO has_mm_order_item;

  IF NOT has_mm_order THEN
    RAISE EXCEPTION 'Tabela base de POs não encontrada (mm_order). Ajuste o patch para a tabela real.';
  END IF;

  IF NOT has_mm_order_item THEN
    RAISE EXCEPTION 'Tabela base de itens de POs não encontrada (mm_order_item). Ajuste o patch para a tabela real.';
  END IF;
END$$;

-- 2) Criar/atualizar VIEW "mm_purchase_order" compatível com o front.
--    mapeia mm_order -> (po_id, supplier_id, totals, etc.)
CREATE OR REPLACE VIEW public.mm_purchase_order
WITH (security_invoker = true) AS
SELECT
  o.tenant_id,
  o.mm_order              AS po_id,           -- <- id esperado pelo front
  o.doc_no,                                  -- se existir; senão ficará NULL
  o.order_date,
  o.status,
  o.vendor_id            AS supplier_id,      -- <- nome esperado pelo front
  o.total_cents,
  COALESCE(o.total_final_cents, o.total_cents) AS total_final_cents,
  o.created_at
FROM public.mm_order o;

-- 3) Criar/atualizar VIEW "mm_purchase_order_item" compatível com o front.
CREATE OR REPLACE VIEW public.mm_purchase_order_item
WITH (security_invoker = true) AS
SELECT
  i.tenant_id,
  i.mm_order             AS po_id,            -- <- chave de ligação com a view de cabeçalho
  i.row_no,
  i.sku,
  i.mm_material,
  i.quantity,
  i.unit_price_cents,
  i.line_total_cents
FROM public.mm_order_item i;

-- 4) Garantir privilégios de leitura nas VIEWS para roles do app.
GRANT SELECT ON public.mm_purchase_order      TO authenticated;
GRANT SELECT ON public.mm_purchase_order_item TO authenticated;

-- 5) (Opcional, mas recomendado) Índices úteis nas tabelas-base para lookup por tenant + id.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_mm_order_tenant_id_mm_order'
  ) THEN
    CREATE INDEX idx_mm_order_tenant_id_mm_order ON public.mm_order (tenant_id, mm_order);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_mm_order_item_tenant_id_mm_order'
  ) THEN
    CREATE INDEX idx_mm_order_item_tenant_id_mm_order ON public.mm_order_item (tenant_id, mm_order);
  END IF;
END$$;

-- 6) Smoke-tests rápidos (ajuste o PO alvo se quiser):
--    a) listar últimos POs visíveis para o tenant
SELECT po_id, supplier_id, order_date, total_final_cents
FROM public.mm_purchase_order
WHERE tenant_id = 'LaplataLunaria'
ORDER BY created_at DESC
LIMIT 10;

--    b) verificar um PO específico (cole o id visto na URL)
--       Exemplo: 'PO-1759073172336'
SELECT *
FROM public.mm_purchase_order
WHERE tenant_id = 'LaplataLunaria'
  AND po_id = 'PO-1759073172336';

--    c) itens do mesmo PO
SELECT *
FROM public.mm_purchase_order_item
WHERE tenant_id = 'LaplataLunaria'
  AND po_id = 'PO-1759073172336'
ORDER BY row_no;


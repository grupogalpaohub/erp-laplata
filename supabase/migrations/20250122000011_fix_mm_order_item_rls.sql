-- Habilitar RLS na tabela base mm_order_item
ALTER TABLE public.mm_order_item ENABLE ROW LEVEL SECURITY;

-- Remover políticas RLS existentes para mm_order_item (se houver)
DROP POLICY IF EXISTS "tenant_isolation_mm_order_item_select" ON public.mm_order_item;
DROP POLICY IF EXISTS "tenant_isolation_mm_order_item_insert" ON public.mm_order_item;
DROP POLICY IF EXISTS "tenant_isolation_mm_order_item_update" ON public.mm_order_item;
DROP POLICY IF EXISTS "tenant_isolation_mm_order_item_delete" ON public.mm_order_item;

-- Criar políticas RLS para mm_order_item
CREATE POLICY "tenant_isolation_mm_order_item_select" ON public.mm_order_item
    FOR SELECT USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_order_item_insert" ON public.mm_order_item
    FOR INSERT WITH CHECK (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_order_item_update" ON public.mm_order_item
    FOR UPDATE USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')
             WITH CHECK (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_order_item_delete" ON public.mm_order_item
    FOR DELETE USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- Habilitar RLS na tabela base mm_order (se ainda não estiver)
ALTER TABLE public.mm_order ENABLE ROW LEVEL SECURITY;

-- Remover políticas RLS existentes para mm_order (se houver)
DROP POLICY IF EXISTS "tenant_isolation_mm_order_select" ON public.mm_order;
DROP POLICY IF EXISTS "tenant_isolation_mm_order_insert" ON public.mm_order;
DROP POLICY IF EXISTS "tenant_isolation_mm_order_update" ON public.mm_order;
DROP POLICY IF EXISTS "tenant_isolation_mm_order_delete" ON public.mm_order;

-- Criar políticas RLS para mm_order
CREATE POLICY "tenant_isolation_mm_order_select" ON public.mm_order
    FOR SELECT USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_order_insert" ON public.mm_order
    FOR INSERT WITH CHECK (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_order_update" ON public.mm_order
    FOR UPDATE USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id')
             WITH CHECK (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_order_delete" ON public.mm_order
    FOR DELETE USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- Conceder permissões para o role 'authenticated' nas tabelas base
GRANT ALL ON TABLE public.mm_order TO authenticated;
GRANT ALL ON TABLE public.mm_order_item TO authenticated;

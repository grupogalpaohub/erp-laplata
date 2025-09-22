-- Adicionar campos necessários para o módulo SD - Pedidos de Venda
-- Esta migração adiciona campos que estavam faltando na tabela sd_sales_order

-- Adicionar campos na tabela sd_sales_order
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS doc_no TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_term TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_final_cents INTEGER DEFAULT 0;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_negotiated_cents INTEGER DEFAULT 0;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Adicionar campos na tabela sd_sales_order_item
ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS material_id TEXT REFERENCES mm_material(mm_material);
ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS unit_price_cents_at_order INTEGER DEFAULT 0;

-- Atualizar constraint para incluir material_id na chave primária
ALTER TABLE sd_sales_order_item DROP CONSTRAINT IF EXISTS sd_sales_order_item_pkey;
ALTER TABLE sd_sales_order_item ADD CONSTRAINT sd_sales_order_item_pkey 
  PRIMARY KEY (tenant_id, so_id, material_id, row_no);

-- Criar função para gerar número do pedido de venda
CREATE OR REPLACE FUNCTION generate_sales_order_number(tenant_id_param TEXT)
RETURNS TEXT AS $$
DECLARE
    next_seq INTEGER;
    doc_number TEXT;
BEGIN
    -- Buscar ou criar sequência para pedidos de venda
    SELECT COALESCE(MAX(CAST(SUBSTRING(so_id FROM 'SO-(\d+)$') AS INTEGER)), 0) + 1
    INTO next_seq
    FROM sd_sales_order
    WHERE tenant_id = tenant_id_param
    AND so_id ~ '^SO-\d+$';
    
    -- Gerar número do documento
    doc_number := 'SO-' || LPAD(next_seq::TEXT, 3, '0');
    
    RETURN doc_number;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_sales_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sales_order_updated_at
    BEFORE UPDATE ON sd_sales_order
    FOR EACH ROW
    EXECUTE FUNCTION update_sales_order_updated_at();

-- Inserir dados de payment terms se não existirem
INSERT INTO fi_payment_terms_def (tenant_id, terms_code, description, days, is_active)
VALUES
    ('LaplataLunaria', 'PIX', 'Pagamento via PIX', 0, TRUE),
    ('LaplataLunaria', 'TRANSFERENCIA', 'Transferência bancária', 1, TRUE),
    ('LaplataLunaria', 'BOLETO', 'Boleto bancário', 3, TRUE),
    ('LaplataLunaria', 'CARTAO', 'Cartão de crédito/débito', 0, TRUE)
ON CONFLICT (tenant_id, terms_code) DO UPDATE SET
    description = EXCLUDED.description,
    days = EXCLUDED.days,
    is_active = EXCLUDED.is_active;

-- Comentários para documentação
COMMENT ON COLUMN sd_sales_order.doc_no IS 'Número do documento do pedido';
COMMENT ON COLUMN sd_sales_order.payment_method IS 'Método de pagamento (PIX, CARTAO, BOLETO, etc.)';
COMMENT ON COLUMN sd_sales_order.payment_term IS 'Condição de pagamento';
COMMENT ON COLUMN sd_sales_order.total_final_cents IS 'Valor final calculado automaticamente (em centavos)';
COMMENT ON COLUMN sd_sales_order.total_negotiated_cents IS 'Valor efetivamente negociado (em centavos)';
COMMENT ON COLUMN sd_sales_order.notes IS 'Observações do pedido';
COMMENT ON COLUMN sd_sales_order.updated_at IS 'Data da última atualização';

COMMENT ON COLUMN sd_sales_order_item.material_id IS 'ID do material (referência para mm_material)';
COMMENT ON COLUMN sd_sales_order_item.unit_price_cents_at_order IS 'Preço unitário no momento do pedido (em centavos)';

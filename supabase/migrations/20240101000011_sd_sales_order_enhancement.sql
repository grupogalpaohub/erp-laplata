-- Adicionar campos necessários para o módulo SD conforme requerimento
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS doc_no TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_term TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_final_cents INTEGER DEFAULT 0;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_negotiated_cents INTEGER DEFAULT 0;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Adicionar campos necessários para itens do pedido
ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS material_id TEXT REFERENCES mm_material(mm_material);
ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS unit_price_cents_at_order INTEGER DEFAULT 0;

-- Atualizar constraint para incluir material_id na chave primária
ALTER TABLE sd_sales_order_item DROP CONSTRAINT IF EXISTS sd_sales_order_item_pkey;
ALTER TABLE sd_sales_order_item ADD CONSTRAINT sd_sales_order_item_pkey 
  PRIMARY KEY (tenant_id, so_id, material_id, row_no);

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

-- Criar função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_sales_order_number(tenant_id_param TEXT)
RETURNS TEXT AS $$
DECLARE
    next_seq INTEGER;
    doc_number TEXT;
BEGIN
    -- Buscar ou criar sequência para pedidos de venda
    INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
    VALUES (tenant_id_param, 'SO', 'SO', 'SO-{seq:6}', 1, TRUE)
    ON CONFLICT (tenant_id, doc_type) DO UPDATE SET
        next_seq = doc_numbering.next_seq + 1
    RETURNING next_seq INTO next_seq;
    
    -- Se não foi inserido, buscar o próximo número
    IF next_seq IS NULL THEN
        UPDATE doc_numbering 
        SET next_seq = next_seq + 1
        WHERE tenant_id = tenant_id_param AND doc_type = 'SO'
        RETURNING next_seq INTO next_seq;
    END IF;
    
    -- Gerar número do documento
    doc_number := 'SO-' || LPAD(next_seq::TEXT, 6, '0');
    
    RETURN doc_number;
END;
$$ LANGUAGE plpgsql;

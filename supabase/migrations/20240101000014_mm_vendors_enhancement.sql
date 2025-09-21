-- Adicionar campos necessários para o módulo MM Fornecedores conforme requerimento
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS document_id TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS phone_country TEXT DEFAULT 'BR';
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_street TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_number TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_complement TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_district TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_city TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_state TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_zip TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS addr_country TEXT DEFAULT 'BR';
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS payment_terms TEXT;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Adicionar constraints
ALTER TABLE mm_vendor ADD CONSTRAINT mm_vendor_email_unique UNIQUE (tenant_id, contact_email);
ALTER TABLE mm_vendor ADD CONSTRAINT mm_vendor_document_unique UNIQUE (tenant_id, document_id);

-- Atualizar campos existentes para usar os novos campos
UPDATE mm_vendor SET 
  contact_email = email,
  contact_phone = telefone,
  is_active = TRUE
WHERE contact_email IS NULL;

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

-- Criar view para fornecedores com total movimentado
CREATE OR REPLACE VIEW mm_vendors_with_total AS
SELECT 
    v.*,
    COALESCE((
        SELECT SUM(poi.line_total_cents)
        FROM mm_purchase_order po
        JOIN mm_purchase_order_item poi ON po.mm_order = poi.mm_order
        WHERE po.vendor_id = v.vendor_id
        AND po.tenant_id = v.tenant_id
        AND po.status IN ('approved', 'received')
    ), 0) as total_moved_cents
FROM mm_vendor v;

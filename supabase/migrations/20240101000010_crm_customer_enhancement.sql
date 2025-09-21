-- Adicionar campos necessários para o módulo CRM conforme requerimento
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS document_id TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS phone_country TEXT DEFAULT 'BR';
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_street TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_number TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_complement TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_district TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_city TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_state TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_zip TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS addr_country TEXT DEFAULT 'BR';
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS payment_terms TEXT;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE crm_customer ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Adicionar constraints
ALTER TABLE crm_customer ADD CONSTRAINT crm_customer_email_unique UNIQUE (tenant_id, contact_email);
ALTER TABLE crm_customer ADD CONSTRAINT crm_customer_document_unique UNIQUE (tenant_id, document_id);

-- Atualizar campos existentes para usar os novos campos
UPDATE crm_customer SET 
  contact_email = email,
  contact_phone = telefone,
  is_active = CASE WHEN status = 'active' THEN TRUE ELSE FALSE END
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

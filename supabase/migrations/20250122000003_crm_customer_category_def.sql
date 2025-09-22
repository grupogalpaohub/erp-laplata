-- Criar tabela de definição de categorias de cliente
CREATE TABLE IF NOT EXISTS crm_customer_category_def (
    tenant_id TEXT NOT NULL,
    category_code TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, category_code)
);

-- Habilitar RLS
ALTER TABLE crm_customer_category_def ENABLE ROW LEVEL SECURITY;

-- Criar política RLS
CREATE POLICY "crm_customer_category_def_tenant_policy" ON crm_customer_category_def
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Inserir dados iniciais
INSERT INTO crm_customer_category_def (tenant_id, category_code, description, is_active, order_index)
VALUES
    ('LaplataLunaria', 'VIP', 'Cliente VIP', TRUE, 1),
    ('LaplataLunaria', 'REGULAR', 'Cliente Regular', TRUE, 2),
    ('LaplataLunaria', 'CORPORATIVO', 'Cliente Corporativo', TRUE, 3),
    ('LaplataLunaria', 'PESSOA_FISICA', 'Pessoa Física', TRUE, 4),
    ('LaplataLunaria', 'PESSOA_JURIDICA', 'Pessoa Jurídica', TRUE, 5),
    ('LaplataLunaria', 'DISTRIBUIDOR', 'Distribuidor', TRUE, 6),
    ('LaplataLunaria', 'REVENDEDOR', 'Revendedor', TRUE, 7)
ON CONFLICT (tenant_id, category_code) DO UPDATE SET
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    order_index = EXCLUDED.order_index;

-- Adicionar FK em crm_customer
ALTER TABLE crm_customer 
ADD CONSTRAINT crm_customer_category_fk 
FOREIGN KEY (tenant_id, customer_category) 
REFERENCES crm_customer_category_def(tenant_id, category_code);

-- Comentários
COMMENT ON TABLE crm_customer_category_def IS 'Definições de categorias de cliente para customização';
COMMENT ON COLUMN crm_customer_category_def.category_code IS 'Código único da categoria';
COMMENT ON COLUMN crm_customer_category_def.description IS 'Descrição da categoria';
COMMENT ON COLUMN crm_customer_category_def.order_index IS 'Ordem de exibição no dropdown';

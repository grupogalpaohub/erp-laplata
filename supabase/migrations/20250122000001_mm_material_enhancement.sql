-- Adicionar campos necessários para o módulo MM Materiais conforme requerimento
-- Campos para preços separados e link do catálogo

-- Adicionar campo de preço de compra
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS purchase_price_cents INTEGER DEFAULT 0;

-- Adicionar campo de link do catálogo online
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS catalog_url TEXT;

-- Adicionar campo de lead time em dias
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 0;

-- Adicionar campo de estoque mínimo
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS min_stock NUMERIC DEFAULT 0;

-- Adicionar campo de estoque máximo
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS max_stock NUMERIC DEFAULT 0;

-- Adicionar campo de status (se não existir)
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Adicionar campo de data de atualização
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Corrigir campo de quantidade na tabela de itens de pedido
-- O campo correto é 'quantity', não 'mm_qtt'
ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS quantity NUMERIC DEFAULT 0;

-- Atualizar dados existentes para usar o campo correto
UPDATE mm_purchase_order_item SET quantity = mm_qtt WHERE quantity = 0 AND mm_qtt > 0;

-- Adicionar campo de data de atualização
ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Criar tabela de customizing se não existir
CREATE TABLE IF NOT EXISTS customizing (
    tenant_id TEXT NOT NULL,
    category TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, category, value)
);

-- Inserir dados de customizing para tipos de material
INSERT INTO customizing (tenant_id, category, value, description) VALUES
    ('LaplataLunaria', 'material_type', 'Brinco', 'Brinco de ouro ou prata'),
    ('LaplataLunaria', 'material_type', 'Cordão', 'Cordão de ouro ou prata'),
    ('LaplataLunaria', 'material_type', 'Choker', 'Choker de ouro ou prata'),
    ('LaplataLunaria', 'material_type', 'Gargantilha', 'Gargantilha de ouro ou prata'),
    ('LaplataLunaria', 'material_type', 'Anel', 'Anel de ouro ou prata'),
    ('LaplataLunaria', 'material_type', 'Pulseira', 'Pulseira de ouro ou prata')
ON CONFLICT (tenant_id, category, value) DO NOTHING;

-- Inserir dados de customizing para classificações de material
INSERT INTO customizing (tenant_id, category, value, description) VALUES
    ('LaplataLunaria', 'material_classification', 'Elementar', 'Classificação elementar'),
    ('LaplataLunaria', 'material_classification', 'Amuleto', 'Classificação amuleto'),
    ('LaplataLunaria', 'material_classification', 'Protetor', 'Classificação protetor'),
    ('LaplataLunaria', 'material_classification', 'Decoração', 'Classificação decoração')
ON CONFLICT (tenant_id, category, value) DO NOTHING;

-- Inserir dados de customizing para termos de pagamento
INSERT INTO customizing (tenant_id, category, value, description) VALUES
    ('LaplataLunaria', 'payment_terms', 'PIX', 'Pagamento via PIX'),
    ('LaplataLunaria', 'payment_terms', 'Transferência', 'Transferência bancária'),
    ('LaplataLunaria', 'payment_terms', 'Boleto', 'Boleto bancário'),
    ('LaplataLunaria', 'payment_terms', 'Cartão', 'Cartão de crédito/débito')
ON CONFLICT (tenant_id, category, value) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_mm_material_tenant_status ON mm_material (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_mm_material_vendor ON mm_material (mm_vendor_id);
CREATE INDEX IF NOT EXISTS idx_customizing_tenant_category ON customizing (tenant_id, category);

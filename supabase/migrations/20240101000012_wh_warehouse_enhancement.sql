-- Adicionar campos necessários para o módulo WH conforme requerimento
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS last_in_date TIMESTAMPTZ;
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS last_out_date TIMESTAMPTZ;
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Ativo';
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'UN';
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS min_stock_qty NUMERIC DEFAULT 0;

-- Adicionar campos para materiais
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS collection TEXT;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS min_stock_qty NUMERIC DEFAULT 0;

-- Inserir dados de status de estoque se não existirem
INSERT INTO wh_inventory_status_def (tenant_id, status, is_active)
VALUES
    ('LaplataLunaria', 'Ativo', TRUE),
    ('LaplataLunaria', 'Bloqueado', TRUE),
    ('LaplataLunaria', 'Zerado', TRUE),
    ('LaplataLunaria', 'Em Reposição', TRUE)
ON CONFLICT (tenant_id, status) DO UPDATE SET
    is_active = EXCLUDED.is_active;

-- Criar view para posição de estoque consolidada
CREATE OR REPLACE VIEW wh_inventory_position AS
SELECT 
    ib.tenant_id,
    ib.plant_id,
    ib.mm_material,
    m.mm_comercial,
    m.mm_desc,
    m.collection,
    ib.on_hand_qty,
    ib.reserved_qty,
    ib.on_hand_qty - ib.reserved_qty as available_qty,
    ib.unit,
    ib.status,
    ib.last_in_date,
    ib.last_out_date,
    ib.min_stock_qty,
    CASE 
        WHEN ib.on_hand_qty = 0 THEN 'Zerado'
        WHEN ib.on_hand_qty <= ib.min_stock_qty THEN 'Em Reposição'
        WHEN ib.status = 'Bloqueado' THEN 'Bloqueado'
        ELSE 'Ativo'
    END as calculated_status,
    w.name as warehouse_name
FROM wh_inventory_balance ib
JOIN mm_material m ON ib.tenant_id = m.tenant_id AND ib.mm_material = m.mm_material
LEFT JOIN wh_warehouse w ON ib.tenant_id = w.tenant_id AND ib.plant_id = w.plant_id;

-- Criar função para atualizar status do estoque
CREATE OR REPLACE FUNCTION update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar status baseado na quantidade
    IF NEW.on_hand_qty = 0 THEN
        NEW.status = 'Zerado';
    ELSIF NEW.on_hand_qty <= NEW.min_stock_qty THEN
        NEW.status = 'Em Reposição';
    ELSIF OLD.status = 'Bloqueado' THEN
        NEW.status = 'Bloqueado';
    ELSE
        NEW.status = 'Ativo';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar status automaticamente
DROP TRIGGER IF EXISTS trigger_update_inventory_status ON wh_inventory_balance;
CREATE TRIGGER trigger_update_inventory_status
    BEFORE UPDATE ON wh_inventory_balance
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_status();

-- Inserir dados de exemplo para warehouse padrão
INSERT INTO wh_warehouse (tenant_id, plant_id, name, is_default)
VALUES ('LaplataLunaria', 'WH001', 'Depósito Principal', TRUE)
ON CONFLICT (tenant_id, plant_id) DO UPDATE SET
    name = EXCLUDED.name,
    is_default = EXCLUDED.is_default;

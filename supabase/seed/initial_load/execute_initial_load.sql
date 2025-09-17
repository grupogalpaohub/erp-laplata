-- Execute Initial Load - ERP Laplata
-- Script consolidado para carregar dados reais

-- 1. Limpar dados existentes
DELETE FROM mm_receiving WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order_item WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_material WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_vendor WHERE tenant_id = 'LaplataLunaria';

-- 2. Carregar fornecedores
INSERT INTO mm_vendor (vendor_id, tenant_id, name, contact_person, email, phone, address, city, state, zip_code, country, tax_id, payment_terms, rating, status, created_at, updated_at)
VALUES 
('VENDOR001', 'LaplataLunaria', 'Joias do Brasil Ltda', 'João Silva', 'joao@joiasdobrasil.com.br', '(11) 99999-9999', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', 'Brasil', '12.345.678/0001-90', 30, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR002', 'LaplataLunaria', 'Materiais Preciosos SA', 'Maria Santos', 'maria@materiaispreciosos.com.br', '(21) 88888-8888', 'Av. Central, 456', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', '98.765.432/0001-10', 15, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR003', 'LaplataLunaria', 'Fornecedor Ouro', 'Pedro Costa', 'pedro@fornecedorouro.com.br', '(31) 77777-7777', 'Rua do Ouro, 789', 'Belo Horizonte', 'MG', '30000-000', 'Brasil', '11.222.333/0001-44', 45, 'B', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR004', 'LaplataLunaria', 'Prata & Cia', 'Ana Lima', 'ana@prataecia.com.br', '(41) 66666-6666', 'Rua da Prata, 321', 'Curitiba', 'PR', '80000-000', 'Brasil', '44.555.666/0001-77', 30, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR005', 'LaplataLunaria', 'Acabamentos Finos', 'Carlos Oliveira', 'carlos@acabamentosfinos.com.br', '(51) 55555-5555', 'Av. Industrial, 654', 'Porto Alegre', 'RS', '90000-000', 'Brasil', '77.888.999/0001-00', 15, 'B', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- 3. Carregar materiais
INSERT INTO mm_material (sku, tenant_id, description, material_type, classification, category, unit_of_measure, weight_grams, dimensions, purity, color, finish, price_per_unit, currency, min_stock, max_stock, lead_time_days, status, created_at, updated_at)
VALUES 
('SKU001', 'LaplataLunaria', 'Anel de Prata 925', 'finished_good', 'prata', 'anéis', 'unidade', 5.5, '15x12x8mm', '925', 'prata', 'polido', 25000, 'BRL', 10, 100, 7, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU002', 'LaplataLunaria', 'Colar de Ouro 18k', 'finished_good', 'ouro', 'colares', 'unidade', 12.3, '45cm', '18k', 'amarelo', 'brilhante', 150000, 'BRL', 5, 50, 10, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU003', 'LaplataLunaria', 'Brinco de Prata 925', 'finished_good', 'prata', 'brincos', 'par', 3.2, '20x15x5mm', '925', 'prata', 'acetinado', 18000, 'BRL', 15, 80, 5, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU004', 'LaplataLunaria', 'Pulseira de Ouro 18k', 'finished_good', 'ouro', 'pulseiras', 'unidade', 8.7, '18cm', '18k', 'amarelo', 'polido', 120000, 'BRL', 8, 60, 8, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU005', 'LaplataLunaria', 'Prata 925 - Matéria Prima', 'raw_material', 'prata', 'matéria-prima', 'grama', 1.0, 'N/A', '925', 'prata', 'bruto', 1500, 'BRL', 100, 1000, 3, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- 4. Carregar depósitos
INSERT INTO wh_warehouse (warehouse_id, tenant_id, name, address, city, state, zip_code, country, contact_person, phone, email, is_default, status, created_at, updated_at)
VALUES 
('WH001', 'LaplataLunaria', 'Depósito Principal', 'Rua Industrial, 1000', 'São Paulo', 'SP', '01234-567', 'Brasil', 'João Silva', '(11) 99999-9999', 'joao@laplatalunaria.com.br', true, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('WH002', 'LaplataLunaria', 'Depósito Secundário', 'Av. Comercial, 2000', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', 'Maria Santos', '(21) 88888-8888', 'maria@laplatalunaria.com.br', false, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- 5. Carregar estoque
INSERT INTO wh_inventory_balance (tenant_id, plant_id, sku, quantity_on_hand, quantity_reserved, status, last_count_date, created_at, updated_at)
VALUES 
('LaplataLunaria', 'WH-001', 'B_175', 14, 0, 'active', '2024-01-01', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('LaplataLunaria', 'WH-001', 'B_176', 14, 0, 'active', '2024-01-01', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('LaplataLunaria', 'WH-001', 'B_177', 14, 0, 'active', '2024-01-01', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('LaplataLunaria', 'WH-001', 'B_178', 14, 0, 'active', '2024-01-01', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('LaplataLunaria', 'WH-001', 'B_179', 14, 0, 'active', '2024-01-01', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- 6. Validação final
SELECT 'mm_vendor' as tabela, COUNT(*) as registros FROM mm_vendor WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'mm_material' as tabela, COUNT(*) as registros FROM mm_material WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'wh_warehouse' as tabela, COUNT(*) as registros FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'wh_inventory_balance' as tabela, COUNT(*) as registros FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria';
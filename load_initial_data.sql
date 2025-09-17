-- Script para carregar dados iniciais do ERP La Plata
-- Executar no Supabase SQL Editor

-- 1. Carregar Fornecedores (mm_vendor)
INSERT INTO mm_vendor (
    vendor_id, tenant_id, name, contact_person, email, phone, 
    address, city, state, zip_code, country, tax_id, 
    payment_terms, rating, status, created_at, updated_at
) VALUES 
('VENDOR001', 'LaplataLunaria', 'Joias do Brasil Ltda', 'João Silva', 'joao@joiasdobrasil.com.br', '(11) 99999-9999', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', 'Brasil', '12.345.678/0001-90', 30, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR002', 'LaplataLunaria', 'Materiais Preciosos SA', 'Maria Santos', 'maria@materiaispreciosos.com.br', '(21) 88888-8888', 'Av. Central, 456', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', '98.765.432/0001-10', 15, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR003', 'LaplataLunaria', 'Fornecedor Ouro', 'Pedro Costa', 'pedro@fornecedorouro.com.br', '(31) 77777-7777', 'Rua do Ouro, 789', 'Belo Horizonte', 'MG', '30000-000', 'Brasil', '11.222.333/0001-44', 45, 'B', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR004', 'LaplataLunaria', 'Prata & Cia', 'Ana Lima', 'ana@prataecia.com.br', '(41) 66666-6666', 'Rua da Prata, 321', 'Curitiba', 'PR', '80000-000', 'Brasil', '44.555.666/0001-77', 30, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR005', 'LaplataLunaria', 'Acabamentos Finos', 'Carlos Oliveira', 'carlos@acabamentosfinos.com.br', '(51) 55555-5555', 'Av. Industrial, 654', 'Porto Alegre', 'RS', '90000-000', 'Brasil', '77.888.999/0001-00', 15, 'B', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (vendor_id, tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    contact_person = EXCLUDED.contact_person,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    tax_id = EXCLUDED.tax_id,
    payment_terms = EXCLUDED.payment_terms,
    rating = EXCLUDED.rating,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 2. Carregar Materiais (mm_material)
INSERT INTO mm_material (
    sku, tenant_id, description, material_type, classification, category, 
    unit_of_measure, weight_grams, dimensions, purity, color, finish, 
    price_per_unit, currency, min_stock, max_stock, lead_time_days, 
    status, created_at, updated_at
) VALUES 
('SKU001', 'LaplataLunaria', 'Anel de Prata 925', 'finished_good', 'prata', 'anéis', 'unidade', 5.5, '15x12x8mm', '925', 'prata', 'polido', 25000, 'BRL', 10, 100, 7, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU002', 'LaplataLunaria', 'Colar de Ouro 18k', 'finished_good', 'ouro', 'colares', 'unidade', 12.3, '45cm', '18k', 'amarelo', 'brilhante', 150000, 'BRL', 5, 50, 10, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU003', 'LaplataLunaria', 'Brinco de Prata 925', 'finished_good', 'prata', 'brincos', 'par', 3.2, '20x15x5mm', '925', 'prata', 'acetinado', 18000, 'BRL', 15, 80, 5, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU004', 'LaplataLunaria', 'Pulseira de Ouro 18k', 'finished_good', 'ouro', 'pulseiras', 'unidade', 8.7, '18cm', '18k', 'amarelo', 'polido', 120000, 'BRL', 8, 60, 8, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU005', 'LaplataLunaria', 'Prata 925 - Matéria Prima', 'raw_material', 'prata', 'matéria-prima', 'grama', 1.0, 'N/A', '925', 'prata', 'bruto', 1500, 'BRL', 100, 1000, 3, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU006', 'LaplataLunaria', 'Ouro 18k - Matéria Prima', 'raw_material', 'ouro', 'matéria-prima', 'grama', 1.0, 'N/A', '18k', 'amarelo', 'bruto', 25000, 'BRL', 50, 500, 5, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU007', 'LaplataLunaria', 'Caixa de Presente Pequena', 'embalagem', 'embalagem', 'embalagens', 'unidade', 25.0, '10x8x4cm', 'N/A', 'branco', 'liso', 500, 'BRL', 200, 2000, 2, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU008', 'LaplataLunaria', 'Caixa de Presente Grande', 'embalagem', 'embalagem', 'embalagens', 'unidade', 45.0, '15x12x6cm', 'N/A', 'branco', 'liso', 800, 'BRL', 100, 1000, 2, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU009', 'LaplataLunaria', 'Fecho de Prata', 'component', 'prata', 'componentes', 'unidade', 2.1, '8x6x3mm', '925', 'prata', 'polido', 800, 'BRL', 500, 5000, 4, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('SKU010', 'LaplataLunaria', 'Corrente de Ouro 18k', 'component', 'ouro', 'componentes', 'metro', 0.5, '1mm', '18k', 'amarelo', 'polido', 5000, 'BRL', 100, 1000, 6, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (sku, tenant_id) DO UPDATE SET
    description = EXCLUDED.description,
    material_type = EXCLUDED.material_type,
    classification = EXCLUDED.classification,
    category = EXCLUDED.category,
    unit_of_measure = EXCLUDED.unit_of_measure,
    weight_grams = EXCLUDED.weight_grams,
    dimensions = EXCLUDED.dimensions,
    purity = EXCLUDED.purity,
    color = EXCLUDED.color,
    finish = EXCLUDED.finish,
    price_per_unit = EXCLUDED.price_per_unit,
    currency = EXCLUDED.currency,
    min_stock = EXCLUDED.min_stock,
    max_stock = EXCLUDED.max_stock,
    lead_time_days = EXCLUDED.lead_time_days,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 3. Carregar Depósitos (wh_warehouse)
INSERT INTO wh_warehouse (
    warehouse_id, tenant_id, name, address, city, state, zip_code, 
    country, contact_person, phone, email, is_default, status, 
    created_at, updated_at
) VALUES 
('WH001', 'LaplataLunaria', 'Depósito Principal', 'Rua Industrial, 1000', 'São Paulo', 'SP', '01234-567', 'Brasil', 'João Silva', '(11) 99999-9999', 'joao@laplatalunaria.com.br', true, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('WH002', 'LaplataLunaria', 'Depósito Secundário', 'Av. Comercial, 2000', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', 'Maria Santos', '(21) 88888-8888', 'maria@laplatalunaria.com.br', false, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (warehouse_id, tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    contact_person = EXCLUDED.contact_person,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    is_default = EXCLUDED.is_default,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 4. Carregar Saldos de Estoque (wh_inventory_balance)
INSERT INTO wh_inventory_balance (
    balance_id, tenant_id, warehouse_id, sku, quantity_on_hand, 
    quantity_reserved, quantity_available, last_count_date, 
    status, created_at, updated_at
) VALUES 
('BAL001', 'LaplataLunaria', 'WH001', 'SKU001', 50, 5, 45, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL002', 'LaplataLunaria', 'WH001', 'SKU002', 25, 2, 23, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL003', 'LaplataLunaria', 'WH001', 'SKU003', 40, 3, 37, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL004', 'LaplataLunaria', 'WH001', 'SKU004', 30, 1, 29, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL005', 'LaplataLunaria', 'WH001', 'SKU005', 500, 50, 450, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL006', 'LaplataLunaria', 'WH001', 'SKU006', 200, 20, 180, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL007', 'LaplataLunaria', 'WH001', 'SKU007', 1000, 100, 900, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL008', 'LaplataLunaria', 'WH001', 'SKU008', 500, 50, 450, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL009', 'LaplataLunaria', 'WH001', 'SKU009', 2000, 200, 1800, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('BAL010', 'LaplataLunaria', 'WH001', 'SKU010', 100, 10, 90, '2024-01-01', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (balance_id, tenant_id) DO UPDATE SET
    warehouse_id = EXCLUDED.warehouse_id,
    sku = EXCLUDED.sku,
    quantity_on_hand = EXCLUDED.quantity_on_hand,
    quantity_reserved = EXCLUDED.quantity_reserved,
    quantity_available = EXCLUDED.quantity_available,
    last_count_date = EXCLUDED.last_count_date,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 5. Carregar Pedidos de Compra (mm_purchase_order)
INSERT INTO mm_purchase_order (
    po_id, tenant_id, vendor_id, order_date, expected_delivery, 
    status, total_amount, currency, notes, created_at, updated_at
) VALUES 
('PO001', 'LaplataLunaria', 'VENDOR001', '2024-01-15', '2024-01-22', 'approved', 125000, 'BRL', 'Pedido de materiais para produção de anéis', '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('PO002', 'LaplataLunaria', 'VENDOR002', '2024-01-16', '2024-01-23', 'approved', 200000, 'BRL', 'Pedido de ouro para colares', '2024-01-16T00:00:00Z', '2024-01-16T00:00:00Z'),
('PO003', 'LaplataLunaria', 'VENDOR003', '2024-01-17', '2024-01-24', 'draft', 75000, 'BRL', 'Pedido de componentes', '2024-01-17T00:00:00Z', '2024-01-17T00:00:00Z')
ON CONFLICT (po_id, tenant_id) DO UPDATE SET
    vendor_id = EXCLUDED.vendor_id,
    order_date = EXCLUDED.order_date,
    expected_delivery = EXCLUDED.expected_delivery,
    status = EXCLUDED.status,
    total_amount = EXCLUDED.total_amount,
    currency = EXCLUDED.currency,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;

-- 6. Carregar Itens de Pedidos de Compra (mm_purchase_order_item)
INSERT INTO mm_purchase_order_item (
    item_id, tenant_id, po_id, sku, quantity, unit_price, 
    total_price, currency, notes, created_at, updated_at
) VALUES 
('POI001', 'LaplataLunaria', 'PO001', 'SKU005', 50, 1500, 75000, 'BRL', 'Prata 925 para anéis', '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('POI002', 'LaplataLunaria', 'PO001', 'SKU009', 100, 800, 80000, 'BRL', 'Fechos de prata', '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('POI003', 'LaplataLunaria', 'PO002', 'SKU006', 8, 25000, 200000, 'BRL', 'Ouro 18k para colares', '2024-01-16T00:00:00Z', '2024-01-16T00:00:00Z'),
('POI004', 'LaplataLunaria', 'PO003', 'SKU010', 15, 5000, 75000, 'BRL', 'Correntes de ouro', '2024-01-17T00:00:00Z', '2024-01-17T00:00:00Z')
ON CONFLICT (item_id, tenant_id) DO UPDATE SET
    po_id = EXCLUDED.po_id,
    sku = EXCLUDED.sku,
    quantity = EXCLUDED.quantity,
    unit_price = EXCLUDED.unit_price,
    total_price = EXCLUDED.total_price,
    currency = EXCLUDED.currency,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;

-- 7. Carregar Recebimentos (mm_receiving)
INSERT INTO mm_receiving (
    receiving_id, tenant_id, po_id, warehouse_id, received_date, 
    received_by, status, notes, created_at, updated_at
) VALUES 
('REC001', 'LaplataLunaria', 'PO001', 'WH001', '2024-01-22', 'João Silva', 'received', 'Recebimento completo conforme pedido', '2024-01-22T00:00:00Z', '2024-01-22T00:00:00Z'),
('REC002', 'LaplataLunaria', 'PO002', 'WH001', '2024-01-23', 'Maria Santos', 'received', 'Recebimento parcial - aguardando restante', '2024-01-23T00:00:00Z', '2024-01-23T00:00:00Z')
ON CONFLICT (receiving_id, tenant_id) DO UPDATE SET
    po_id = EXCLUDED.po_id,
    warehouse_id = EXCLUDED.warehouse_id,
    received_date = EXCLUDED.received_date,
    received_by = EXCLUDED.received_by,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;

-- Verificar se há exatamente 1 depósito default por tenant
SELECT 
    tenant_id, 
    COUNT(*) as total_warehouses,
    COUNT(CASE WHEN is_default = true THEN 1 END) as default_warehouses
FROM wh_warehouse 
WHERE tenant_id = 'LaplataLunaria'
GROUP BY tenant_id;

-- Log de carregamento
SELECT 'Dados carregados com sucesso!' as status, NOW() as timestamp;
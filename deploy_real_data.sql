-- Script consolidado para limpar dados falsos e carregar dados reais do ERP La Plata
-- Executar no Supabase SQL Editor

-- ========================================
-- LIMPEZA DE DADOS FALSOS
-- ========================================

-- Limpar dados falsos (manter apenas dados reais do LaplataLunaria)
DELETE FROM mm_receiving WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order_item WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_material WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_vendor WHERE tenant_id = 'LaplataLunaria';

-- ========================================
-- CARREGAMENTO DE DADOS REAIS
-- ========================================

-- 1. Carregar Fornecedores (mm_vendor) - dados reais
INSERT INTO mm_vendor (
    vendor_id, tenant_id, name, contact_person, email, phone, 
    address, city, state, zip_code, country, tax_id, 
    payment_terms, rating, status, created_at, updated_at
) VALUES 
('SUP_00001', 'LaplataLunaria', 'Silvercrown', 'Silvercrown', 'sac.silvercrown@gmail.com', '(44) 9184-4337', 'Paranavai', 'Paranavai', 'PR', '00000-000', 'Brasil', '00000000000000', 30, 'A', 'active', NOW(), NOW())
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

-- 2. Carregar Materiais (mm_material) - dados reais
INSERT INTO mm_material (
    sku, tenant_id, description, material_type, classification, category, 
    unit_of_measure, weight_grams, dimensions, purity, color, finish, 
    price_per_unit, currency, min_stock, max_stock, lead_time_days, 
    status, created_at, updated_at
) VALUES 
('B_175', 'LaplataLunaria', 'Brinco Argola Cravejado Trevo Resina Preto Misto', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'preto', 'cravejado', 24453, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_176', 'LaplataLunaria', 'Brinco Círculo Cravejado Olho Grego de Prata', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', '925', 'prata', 'cravejado', 19653, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_177', 'LaplataLunaria', 'Brinco Estrelas Liso de Prata', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', '925', 'prata', 'liso', 10853, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_178', 'LaplataLunaria', 'Brinco Infinito Cravejado com Borda de Prata', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', '925', 'prata', 'cravejado', 24453, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_179', 'LaplataLunaria', 'Brinco Lua Cravejado Médio de Prata', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', '925', 'prata', 'cravejado', 19653, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_180', 'LaplataLunaria', 'Brinco Fios Polidos com Bolinhas de Prata', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', '925', 'prata', 'polido', 19653, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_181', 'LaplataLunaria', 'Brinco Triângulo Arabescos', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'arabescos', 12453, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_182', 'LaplataLunaria', 'Brinco Argola Fio Quadrado', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'quadrado', 19653, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_183', 'LaplataLunaria', 'Brinco Argola Tarracha', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'tarracha', 19653, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_184', 'LaplataLunaria', 'Brinco Argola Torcida', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'torcida', 19653, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_185', 'LaplataLunaria', 'Brinco Argola Lisa Fina Mini', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'lisa', 12990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_186', 'LaplataLunaria', 'Brinco Argola Lisa Grossa', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'lisa', 28990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_187', 'LaplataLunaria', 'Brinco Argola Lisa Média', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'lisa', 18990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_188', 'LaplataLunaria', 'Brinco Argola Lisa Pequena', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'lisa', 15990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_189', 'LaplataLunaria', 'Brinco Argola Lisa Super Fina', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'lisa', 14990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_190', 'LaplataLunaria', 'Brinco Argola Lisa Torcida', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'lisa', 18990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_191', 'LaplataLunaria', 'Brinco Argola com Pingente Coração', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_192', 'LaplataLunaria', 'Brinco Argola com Pingente Estrela', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_193', 'LaplataLunaria', 'Brinco Argola com Pingente Lua', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_194', 'LaplataLunaria', 'Brinco Argola com Pingente Raio', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_195', 'LaplataLunaria', 'Brinco Argola Bolinhas', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'bolinhas', 18990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_196', 'LaplataLunaria', 'Brinco Argola Esferas Torcidas', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'esferas', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_197', 'LaplataLunaria', 'Brinco Argola Fio Quadrado Pequena', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'quadrado', 19990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_198', 'LaplataLunaria', 'Brinco Argola Fio Quadrado Média', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'quadrado', 22990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_199', 'LaplataLunaria', 'Brinco Argola Fio Quadrado Grossa', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'quadrado', 25990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_200', 'LaplataLunaria', 'Brinco Argola Quadrada', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'quadrada', 22990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_201', 'LaplataLunaria', 'Brinco Argola Quadrada Texturizada', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'texturizada', 24990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_202', 'LaplataLunaria', 'Brinco Argola Torcida Média', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'torcida', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_203', 'LaplataLunaria', 'Brinco Argola Torcida Fina', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'torcida', 19990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_204', 'LaplataLunaria', 'Brinco Argola com Bolinha', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'bolinha', 17990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_205', 'LaplataLunaria', 'Brinco Argola com Pingente Gotinha', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_206', 'LaplataLunaria', 'Brinco Argola com Pingente Cruz', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_207', 'LaplataLunaria', 'Brinco Argola com Pingente Estrela do Mar', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_208', 'LaplataLunaria', 'Brinco Argola com Pingente Concha', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_209', 'LaplataLunaria', 'Brinco Argola com Pingente Olho Grego', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 22990, 'BRL', 10, 100, 7, 'active', NOW(), NOW()),
('B_210', 'LaplataLunaria', 'Brinco Argola com Pingente Trevo', 'finished_good', 'brinco', 'brincos', 'unidade', 5.0, 'N/A', 'N/A', 'N/A', 'pingente', 21990, 'BRL', 10, 100, 7, 'active', NOW(), NOW())
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

-- 3. Carregar Depósitos (wh_warehouse) - dados reais
INSERT INTO wh_warehouse (
    warehouse_id, tenant_id, name, address, city, state, zip_code, 
    country, contact_person, phone, email, is_default, status, 
    created_at, updated_at
) VALUES 
('WH-001', 'LaplataLunaria', 'Depósito Principal', 'Endereço do Depósito', 'Cidade', 'Estado', '00000-000', 'Brasil', 'Responsável', '(00) 0000-0000', 'deposito@laplatalunaria.com.br', true, 'active', NOW(), NOW())
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

-- 4. Carregar Saldos de Estoque (wh_inventory_balance) - dados reais
INSERT INTO wh_inventory_balance (
    balance_id, tenant_id, warehouse_id, sku, quantity_on_hand, 
    quantity_reserved, quantity_available, last_count_date, 
    status, created_at, updated_at
) VALUES 
('BAL001', 'LaplataLunaria', 'WH-001', 'B_175', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL002', 'LaplataLunaria', 'WH-001', 'B_176', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL003', 'LaplataLunaria', 'WH-001', 'B_177', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL004', 'LaplataLunaria', 'WH-001', 'B_178', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL005', 'LaplataLunaria', 'WH-001', 'B_179', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL006', 'LaplataLunaria', 'WH-001', 'B_180', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL007', 'LaplataLunaria', 'WH-001', 'B_181', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL008', 'LaplataLunaria', 'WH-001', 'B_182', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL009', 'LaplataLunaria', 'WH-001', 'B_183', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL010', 'LaplataLunaria', 'WH-001', 'B_184', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL011', 'LaplataLunaria', 'WH-001', 'B_185', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL012', 'LaplataLunaria', 'WH-001', 'B_186', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL013', 'LaplataLunaria', 'WH-001', 'B_187', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL014', 'LaplataLunaria', 'WH-001', 'B_188', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL015', 'LaplataLunaria', 'WH-001', 'B_189', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL016', 'LaplataLunaria', 'WH-001', 'B_190', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL017', 'LaplataLunaria', 'WH-001', 'B_191', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL018', 'LaplataLunaria', 'WH-001', 'B_192', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL019', 'LaplataLunaria', 'WH-001', 'B_193', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL020', 'LaplataLunaria', 'WH-001', 'B_194', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL021', 'LaplataLunaria', 'WH-001', 'B_195', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL022', 'LaplataLunaria', 'WH-001', 'B_196', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL023', 'LaplataLunaria', 'WH-001', 'B_197', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL024', 'LaplataLunaria', 'WH-001', 'B_198', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL025', 'LaplataLunaria', 'WH-001', 'B_199', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL026', 'LaplataLunaria', 'WH-001', 'B_200', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL027', 'LaplataLunaria', 'WH-001', 'B_201', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL028', 'LaplataLunaria', 'WH-001', 'B_202', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL029', 'LaplataLunaria', 'WH-001', 'B_203', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL030', 'LaplataLunaria', 'WH-001', 'B_204', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL031', 'LaplataLunaria', 'WH-001', 'B_205', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL032', 'LaplataLunaria', 'WH-001', 'B_206', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL033', 'LaplataLunaria', 'WH-001', 'B_207', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL034', 'LaplataLunaria', 'WH-001', 'B_208', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL035', 'LaplataLunaria', 'WH-001', 'B_209', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW()),
('BAL036', 'LaplataLunaria', 'WH-001', 'B_210', 14, 0, 14, '2024-01-01', 'active', NOW(), NOW())
ON CONFLICT (balance_id, tenant_id) DO UPDATE SET
    warehouse_id = EXCLUDED.warehouse_id,
    sku = EXCLUDED.sku,
    quantity_on_hand = EXCLUDED.quantity_on_hand,
    quantity_reserved = EXCLUDED.quantity_reserved,
    quantity_available = EXCLUDED.quantity_available,
    last_count_date = EXCLUDED.last_count_date,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 5. Carregar Pedidos de Compra (mm_purchase_order) - dados reais
INSERT INTO mm_purchase_order (
    po_id, tenant_id, vendor_id, order_date, expected_delivery, 
    status, total_amount, currency, notes, created_at, updated_at
) VALUES 
('PO-2025-001', 'LaplataLunaria', 'SUP_00001', '2025-07-01', '2025-07-21', 'received', 0, 'BRL', 'Pedido de brincos', NOW(), NOW())
ON CONFLICT (po_id, tenant_id) DO UPDATE SET
    vendor_id = EXCLUDED.vendor_id,
    order_date = EXCLUDED.order_date,
    expected_delivery = EXCLUDED.expected_delivery,
    status = EXCLUDED.status,
    total_amount = EXCLUDED.total_amount,
    currency = EXCLUDED.currency,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;

-- 6. Carregar Itens de Pedidos de Compra (mm_purchase_order_item) - dados reais
INSERT INTO mm_purchase_order_item (
    item_id, tenant_id, po_id, sku, quantity, unit_price, 
    total_price, currency, notes, created_at, updated_at
) VALUES 
('POI001', 'LaplataLunaria', 'PO-2025-001', 'B_175', 14, 4800, 67200, 'BRL', 'Brinco Argola Cravejado Trevo', NOW(), NOW()),
('POI002', 'LaplataLunaria', 'PO-2025-001', 'B_176', 14, 3600, 50400, 'BRL', 'Brinco Círculo Cravejado Olho Grego', NOW(), NOW()),
('POI003', 'LaplataLunaria', 'PO-2025-001', 'B_177', 14, 1400, 19600, 'BRL', 'Brinco Estrelas Liso', NOW(), NOW()),
('POI004', 'LaplataLunaria', 'PO-2025-001', 'B_178', 14, 3800, 53200, 'BRL', 'Brinco Infinito Cravejado', NOW(), NOW()),
('POI005', 'LaplataLunaria', 'PO-2025-001', 'B_179', 14, 2400, 33600, 'BRL', 'Brinco Lua Cravejado', NOW(), NOW()),
('POI006', 'LaplataLunaria', 'PO-2025-001', 'B_180', 14, 3000, 42000, 'BRL', 'Brinco Fios Polidos', NOW(), NOW()),
('POI007', 'LaplataLunaria', 'PO-2025-001', 'B_181', 14, 1600, 22400, 'BRL', 'Brinco Triângulo Arabescos', NOW(), NOW()),
('POI008', 'LaplataLunaria', 'PO-2025-001', 'B_182', 14, 2600, 36400, 'BRL', 'Brinco Argola Fio Quadrado', NOW(), NOW()),
('POI009', 'LaplataLunaria', 'PO-2025-001', 'B_183', 14, 2600, 36400, 'BRL', 'Brinco Argola Tarracha', NOW(), NOW()),
('POI010', 'LaplataLunaria', 'PO-2025-001', 'B_184', 14, 2600, 36400, 'BRL', 'Brinco Argola Torcida', NOW(), NOW()),
('POI011', 'LaplataLunaria', 'PO-2025-001', 'B_185', 14, 1800, 25200, 'BRL', 'Brinco Argola Lisa Fina Mini', NOW(), NOW()),
('POI012', 'LaplataLunaria', 'PO-2025-001', 'B_186', 14, 3800, 53200, 'BRL', 'Brinco Argola Lisa Grossa', NOW(), NOW()),
('POI013', 'LaplataLunaria', 'PO-2025-001', 'B_187', 14, 2400, 33600, 'BRL', 'Brinco Argola Lisa Média', NOW(), NOW()),
('POI014', 'LaplataLunaria', 'PO-2025-001', 'B_188', 14, 2100, 29400, 'BRL', 'Brinco Argola Lisa Pequena', NOW(), NOW()),
('POI015', 'LaplataLunaria', 'PO-2025-001', 'B_189', 14, 2000, 28000, 'BRL', 'Brinco Argola Lisa Super Fina', NOW(), NOW()),
('POI016', 'LaplataLunaria', 'PO-2025-001', 'B_190', 14, 2400, 33600, 'BRL', 'Brinco Argola Lisa Torcida', NOW(), NOW()),
('POI017', 'LaplataLunaria', 'PO-2025-001', 'B_191', 14, 2800, 39200, 'BRL', 'Brinco Argola com Pingente Coração', NOW(), NOW()),
('POI018', 'LaplataLunaria', 'PO-2025-001', 'B_192', 14, 2800, 39200, 'BRL', 'Brinco Argola com Pingente Estrela', NOW(), NOW()),
('POI019', 'LaplataLunaria', 'PO-2025-001', 'B_193', 14, 2800, 39200, 'BRL', 'Brinco Argola com Pingente Lua', NOW(), NOW()),
('POI020', 'LaplataLunaria', 'PO-2025-001', 'B_194', 14, 2800, 39200, 'BRL', 'Brinco Argola com Pingente Raio', NOW(), NOW()),
('POI021', 'LaplataLunaria', 'PO-2025-001', 'B_195', 14, 2400, 33600, 'BRL', 'Brinco Argola Bolinhas', NOW(), NOW()),
('POI022', 'LaplataLunaria', 'PO-2025-001', 'B_196', 14, 2800, 39200, 'BRL', 'Brinco Argola Esferas Torcidas', NOW(), NOW()),
('POI023', 'LaplataLunaria', 'PO-2025-001', 'B_197', 14, 2500, 35000, 'BRL', 'Brinco Argola Fio Quadrado Pequena', NOW(), NOW()),
('POI024', 'LaplataLunaria', 'PO-2025-001', 'B_198', 14, 2600, 36400, 'BRL', 'Brinco Argola Fio Quadrado Média', NOW(), NOW()),
('POI025', 'LaplataLunaria', 'PO-2025-001', 'B_199', 14, 2700, 37800, 'BRL', 'Brinco Argola Fio Quadrado Grossa', NOW(), NOW()),
('POI026', 'LaplataLunaria', 'PO-2025-001', 'B_200', 14, 2600, 36400, 'BRL', 'Brinco Argola Quadrada', NOW(), NOW()),
('POI027', 'LaplataLunaria', 'PO-2025-001', 'B_201', 14, 2700, 37800, 'BRL', 'Brinco Argola Quadrada Texturizada', NOW(), NOW()),
('POI028', 'LaplataLunaria', 'PO-2025-001', 'B_202', 14, 2800, 39200, 'BRL', 'Brinco Argola Torcida Média', NOW(), NOW()),
('POI029', 'LaplataLunaria', 'PO-2025-001', 'B_203', 14, 2200, 30800, 'BRL', 'Brinco Argola Torcida Fina', NOW(), NOW()),
('POI030', 'LaplataLunaria', 'PO-2025-001', 'B_204', 14, 2300, 32200, 'BRL', 'Brinco Argola com Bolinha', NOW(), NOW()),
('POI031', 'LaplataLunaria', 'PO-2025-001', 'B_205', 14, 2400, 33600, 'BRL', 'Brinco Argola com Pingente Gotinha', NOW(), NOW()),
('POI032', 'LaplataLunaria', 'PO-2025-001', 'B_206', 14, 2500, 35000, 'BRL', 'Brinco Argola com Pingente Cruz', NOW(), NOW()),
('POI033', 'LaplataLunaria', 'PO-2025-001', 'B_207', 14, 2600, 36400, 'BRL', 'Brinco Argola com Pingente Estrela do Mar', NOW(), NOW()),
('POI034', 'LaplataLunaria', 'PO-2025-001', 'B_208', 14, 2700, 37800, 'BRL', 'Brinco Argola com Pingente Concha', NOW(), NOW()),
('POI035', 'LaplataLunaria', 'PO-2025-001', 'B_209', 14, 2800, 39200, 'BRL', 'Brinco Argola com Pingente Olho Grego', NOW(), NOW()),
('POI036', 'LaplataLunaria', 'PO-2025-001', 'B_210', 14, 2900, 40600, 'BRL', 'Brinco Argola com Pingente Trevo', NOW(), NOW())
ON CONFLICT (item_id, tenant_id) DO UPDATE SET
    po_id = EXCLUDED.po_id,
    sku = EXCLUDED.sku,
    quantity = EXCLUDED.quantity,
    unit_price = EXCLUDED.unit_price,
    total_price = EXCLUDED.total_price,
    currency = EXCLUDED.currency,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;

-- 7. Carregar Recebimentos (mm_receiving) - dados reais
INSERT INTO mm_receiving (
    receiving_id, tenant_id, po_id, warehouse_id, received_date, 
    received_by, status, notes, created_at, updated_at
) VALUES 
('RC-2024-001', 'LaplataLunaria', 'PO-2025-001', 'WH-001', '2025-07-21', 'Vinicius', 'received', 'Recebimento completo de brincos', NOW(), NOW())
ON CONFLICT (receiving_id, tenant_id) DO UPDATE SET
    po_id = EXCLUDED.po_id,
    warehouse_id = EXCLUDED.warehouse_id,
    received_date = EXCLUDED.received_date,
    received_by = EXCLUDED.received_by,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- VALIDAÇÕES
-- ========================================

-- Verificar se há exatamente 1 depósito default por tenant
SELECT 
    tenant_id, 
    COUNT(*) as total_warehouses,
    COUNT(CASE WHEN is_default = true THEN 1 END) as default_warehouses
FROM wh_warehouse 
WHERE tenant_id = 'LaplataLunaria'
GROUP BY tenant_id;

-- Verificar integridade das FKs
SELECT 'Verificando integridade das FKs...' as status;

-- Verificar se todos os SKUs referenciados existem
SELECT 
    'SKUs não encontrados:' as check_type,
    COUNT(*) as count
FROM mm_purchase_order_item poi
LEFT JOIN mm_material m ON poi.sku = m.sku AND poi.tenant_id = m.tenant_id
WHERE m.sku IS NULL AND poi.tenant_id = 'LaplataLunaria';

-- Verificar se todos os vendor_ids referenciados existem
SELECT 
    'Vendor IDs não encontrados:' as check_type,
    COUNT(*) as count
FROM mm_purchase_order po
LEFT JOIN mm_vendor v ON po.vendor_id = v.vendor_id AND po.tenant_id = v.tenant_id
WHERE v.vendor_id IS NULL AND po.tenant_id = 'LaplataLunaria';

-- Verificar se todos os warehouse_ids referenciados existem
SELECT 
    'Warehouse IDs não encontrados:' as check_type,
    COUNT(*) as count
FROM wh_inventory_balance wib
LEFT JOIN wh_warehouse w ON wib.warehouse_id = w.warehouse_id AND wib.tenant_id = w.tenant_id
WHERE w.warehouse_id IS NULL AND wib.tenant_id = 'LaplataLunaria';

-- Log de carregamento
SELECT 'Dados reais carregados com sucesso!' as status, NOW() as timestamp;
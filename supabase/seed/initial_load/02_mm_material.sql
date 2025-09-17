-- 02_mm_material.sql - Load material data for LaplataLunaria
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
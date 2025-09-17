-- ========================================
-- DEPLOY INITIAL LOAD - ERP Laplata
-- ========================================
-- Script para carregar dados reais da Laplata Lunaria
-- Executa os 7 arquivos em ordem e valida foreign keys

-- ========================================
-- 1. LIMPEZA DOS DADOS EXISTENTES
-- ========================================
-- Limpar dados existentes para o tenant LaplataLunaria
-- Ordem: dependentes primeiro, depois principais

DELETE FROM mm_receiving WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order_item WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_material WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_vendor WHERE tenant_id = 'LaplataLunaria';

-- ========================================
-- 2. CARREGAMENTO DOS DADOS EM ORDEM
-- ========================================

-- 2.1. Fornecedores (base para compras)
\i 01_mm_vendor.sql

-- 2.2. Materiais (base para estoque e compras)
\i 02_mm_material.sql

-- 2.3. Depósitos (base para estoque)
\i 06_wh_warehouse.sql

-- 2.4. Saldo de Estoque (depende de materiais e depósitos)
\i 07_wh_inventory_balance.sql

-- 2.5. Pedidos de Compra (depende de fornecedores)
\i 03_mm_purchase_order.sql

-- 2.6. Itens dos Pedidos (depende de pedidos, materiais e depósitos)
\i 04_mm_purchase_order_item.sql

-- 2.7. Recebimentos (depende de pedidos, materiais e depósitos)
\i 05_mm_receiving.sql

-- ========================================
-- 3. VALIDAÇÃO DE FOREIGN KEYS
-- ========================================

-- Verificar se todos os materiais referenciados existem
DO $$
DECLARE
    missing_materials INTEGER;
BEGIN
    SELECT COUNT(*) INTO missing_materials
    FROM wh_inventory_balance wib
    LEFT JOIN mm_material mm ON wib.sku = mm.sku AND wib.tenant_id = mm.tenant_id
    WHERE wib.tenant_id = 'LaplataLunaria' AND mm.sku IS NULL;
    
    IF missing_materials > 0 THEN
        RAISE EXCEPTION 'Encontrados % materiais referenciados em wh_inventory_balance que não existem em mm_material', missing_materials;
    END IF;
    
    RAISE NOTICE 'Validação de materiais: OK';
END $$;

-- Verificar se todos os fornecedores referenciados existem
DO $$
DECLARE
    missing_vendors INTEGER;
BEGIN
    SELECT COUNT(*) INTO missing_vendors
    FROM mm_purchase_order po
    LEFT JOIN mm_vendor v ON po.vendor_id = v.vendor_id AND po.tenant_id = v.tenant_id
    WHERE po.tenant_id = 'LaplataLunaria' AND v.vendor_id IS NULL;
    
    IF missing_vendors > 0 THEN
        RAISE EXCEPTION 'Encontrados % fornecedores referenciados em mm_purchase_order que não existem em mm_vendor', missing_vendors;
    END IF;
    
    RAISE NOTICE 'Validação de fornecedores: OK';
END $$;

-- Verificar se todos os depósitos referenciados existem
DO $$
DECLARE
    missing_warehouses INTEGER;
BEGIN
    SELECT COUNT(*) INTO missing_warehouses
    FROM wh_inventory_balance wib
    LEFT JOIN wh_warehouse w ON wib.plant_id = w.warehouse_id AND wib.tenant_id = w.tenant_id
    WHERE wib.tenant_id = 'LaplataLunaria' AND w.warehouse_id IS NULL;
    
    IF missing_warehouses > 0 THEN
        RAISE EXCEPTION 'Encontrados % depósitos referenciados em wh_inventory_balance que não existem em wh_warehouse', missing_warehouses;
    END IF;
    
    RAISE NOTICE 'Validação de depósitos: OK';
END $$;

-- ========================================
-- 4. VALIDAÇÃO FINAL DOS DADOS
-- ========================================

-- Contar registros carregados
SELECT 
    'mm_vendor' as tabela, 
    COUNT(*) as registros 
FROM mm_vendor 
WHERE tenant_id = 'LaplataLunaria'

UNION ALL

SELECT 
    'mm_material' as tabela, 
    COUNT(*) as registros 
FROM mm_material 
WHERE tenant_id = 'LaplataLunaria'

UNION ALL

SELECT 
    'wh_warehouse' as tabela, 
    COUNT(*) as registros 
FROM wh_warehouse 
WHERE tenant_id = 'LaplataLunaria'

UNION ALL

SELECT 
    'wh_inventory_balance' as tabela, 
    COUNT(*) as registros 
FROM wh_inventory_balance 
WHERE tenant_id = 'LaplataLunaria'

UNION ALL

SELECT 
    'mm_purchase_order' as tabela, 
    COUNT(*) as registros 
FROM mm_purchase_order 
WHERE tenant_id = 'LaplataLunaria'

UNION ALL

SELECT 
    'mm_purchase_order_item' as tabela, 
    COUNT(*) as registros 
FROM mm_purchase_order_item 
WHERE tenant_id = 'LaplataLunaria'

UNION ALL

SELECT 
    'mm_receiving' as tabela, 
    COUNT(*) as registros 
FROM mm_receiving 
WHERE tenant_id = 'LaplataLunaria'

ORDER BY tabela;

-- ========================================
-- 5. VERIFICAÇÕES ESPECÍFICAS
-- ========================================

-- Verificar se existe exatamente 1 depósito padrão
DO $$
DECLARE
    default_warehouses INTEGER;
BEGIN
    SELECT COUNT(*) INTO default_warehouses
    FROM wh_warehouse 
    WHERE tenant_id = 'LaplataLunaria' AND is_default = true;
    
    IF default_warehouses != 1 THEN
        RAISE EXCEPTION 'Deve existir exatamente 1 depósito padrão, encontrados: %', default_warehouses;
    END IF;
    
    RAISE NOTICE 'Validação de depósito padrão: OK (1 encontrado)';
END $$;

-- Verificar se todos os materiais têm estoque
DO $$
DECLARE
    materials_without_stock INTEGER;
BEGIN
    SELECT COUNT(*) INTO materials_without_stock
    FROM mm_material mm
    LEFT JOIN wh_inventory_balance wib ON mm.sku = wib.sku AND mm.tenant_id = wib.tenant_id
    WHERE mm.tenant_id = 'LaplataLunaria' AND wib.sku IS NULL;
    
    IF materials_without_stock > 0 THEN
        RAISE WARNING 'Encontrados % materiais sem estoque registrado', materials_without_stock;
    ELSE
        RAISE NOTICE 'Validação de estoque: OK (todos os materiais têm estoque)';
    END IF;
END $$;

-- ========================================
-- 6. RESUMO FINAL
-- ========================================

RAISE NOTICE '========================================';
RAISE NOTICE 'CARREGAMENTO INICIAL CONCLUÍDO COM SUCESSO';
RAISE NOTICE '========================================';
RAISE NOTICE 'Tenant: LaplataLunaria';
RAISE NOTICE 'Data: %', NOW();
RAISE NOTICE '========================================';
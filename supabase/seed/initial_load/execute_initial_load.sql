-- Execute Initial Load - ERP Laplata
-- Script consolidado para carregar dados reais dos arquivos .txt

-- 1. Limpar dados existentes para o tenant LaplataLunaria
DELETE FROM mm_receiving WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order_item WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_material WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_vendor WHERE tenant_id = 'LaplataLunaria';

-- 2. Carregar dados dos arquivos SQL em ordem de dependência
\ir 01_mm_vendor.sql
\ir 02_mm_material.sql
\ir 06_wh_warehouse.sql
\ir 07_wh_inventory_balance.sql
\ir 03_mm_purchase_order.sql
\ir 04_mm_purchase_order_item.sql
\ir 05_mm_receiving.sql

-- 3. Validação final
SELECT 'mm_vendor' as tabela, COUNT(*) as registros FROM mm_vendor WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'mm_material' as tabela, COUNT(*) as registros FROM mm_material WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'wh_warehouse' as tabela, COUNT(*) as registros FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'wh_inventory_balance' as tabela, COUNT(*) as registros FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'mm_purchase_order' as tabela, COUNT(*) as registros FROM mm_purchase_order WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'mm_purchase_order_item' as tabela, COUNT(*) as registros FROM mm_purchase_order_item WHERE tenant_id = 'LaplataLunaria'
UNION ALL
SELECT 'mm_receiving' as tabela, COUNT(*) as registros FROM mm_receiving WHERE tenant_id = 'LaplataLunaria';
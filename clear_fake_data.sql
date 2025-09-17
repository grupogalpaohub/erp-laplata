-- Script para limpar dados falsos do Supabase
-- Executar no Supabase SQL Editor

-- Limpar dados falsos (manter apenas dados reais do LaplataLunaria)
DELETE FROM mm_receiving WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order_item WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_purchase_order WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_inventory_balance WHERE tenant_id = 'LaplataLunaria';
DELETE FROM wh_warehouse WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_material WHERE tenant_id = 'LaplataLunaria';
DELETE FROM mm_vendor WHERE tenant_id = 'LaplataLunaria';

-- Verificar limpeza
SELECT 'Dados falsos removidos!' as status, NOW() as timestamp;
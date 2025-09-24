-- PATCH SQL para corrigir preços de venda no módulo SD
-- Execute este script no Supabase para normalizar os valores

-- 1. Corrigir preços de venda que foram salvos 100x maiores
UPDATE mm_material 
SET mm_price_cents = mm_price_cents / 100
WHERE tenant_id = 'LaplataLunaria'
  AND mm_price_cents > 1000  -- Valores que claramente foram multiplicados por 100
  AND mm_price_cents % 100 = 0; -- Valores inteiros (sem centavos)

-- 2. Verificar correções
SELECT 
  mm_material,
  mm_comercial,
  mm_price_cents,
  mm_purchase_price_cents,
  ROUND(mm_price_cents / 100.0, 2) as preco_venda_reais,
  ROUND(mm_purchase_price_cents / 100.0, 2) as preco_compra_reais
FROM mm_material 
WHERE tenant_id = 'LaplataLunaria'
  AND mm_material IN ('B_175', 'B_176', 'G_184', 'G_185', 'G_186')
ORDER BY mm_material;

-- 3. Verificar se existem pedidos de venda com totais incorretos
SELECT 
  so_id,
  total_cents,
  total_final_cents,
  total_negotiated_cents,
  ROUND(total_cents / 100.0, 2) as total_reais,
  ROUND(total_final_cents / 100.0, 2) as total_final_reais
FROM sd_sales_order 
WHERE tenant_id = 'LaplataLunaria'
ORDER BY created_at DESC
LIMIT 5;

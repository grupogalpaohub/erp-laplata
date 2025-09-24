-- Script para corrigir preços de venda que foram salvos 100x maiores
-- Execute este script no Supabase para normalizar os valores

-- 1. Corrigir preços de venda que foram salvos multiplicados por 100
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
  AND mm_material IN ('B_175', 'B_176', 'G_184', 'G_185')
ORDER BY mm_material;

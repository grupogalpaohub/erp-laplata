-- CORREÇÃO DOS PREÇOS DE COMPRA - DIVIDIR POR 100
UPDATE mm_material 
SET mm_purchase_price_cents = mm_purchase_price_cents / 100
WHERE mm_purchase_price_cents > 0;

-- CORREÇÃO DOS PREÇOS DE VENDA - DIVIDIR POR 100  
UPDATE mm_material 
SET mm_price_cents = mm_price_cents / 100
WHERE mm_price_cents > 0;

-- VERIFICAR RESULTADO
SELECT mm_material, mm_purchase_price_cents, mm_price_cents 
FROM mm_material 
LIMIT 5;

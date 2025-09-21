-- =====================================================
-- PARTE 3: TRIGGERS DE AUTOMAÇÃO
-- Execute esta parte após as Partes 1 e 2
-- =====================================================

-- 1. Trigger para recebimentos de compra
CREATE OR REPLACE FUNCTION trg_mm_receiving_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando status muda para 'received' ou 'completed'
  IF NEW.status IN ('received','completed') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Entrada de estoque
    PERFORM post_inventory_movement(
      NEW.tenant_id, 
      NEW.plant_id, 
      NEW.mm_material, 
      NEW.qty_received,
      'purchase_receive', 
      'mm_receiving', 
      NEW.recv_id::text
    );

    -- Lançamento financeiro
    PERFORM fi_post_purchase_receipt(NEW.tenant_id, NEW.mm_order, NEW.recv_id::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trg_mm_receiving_after ON mm_receiving;
CREATE TRIGGER trg_mm_receiving_after
AFTER INSERT OR UPDATE OF status ON mm_receiving
FOR EACH ROW EXECUTE FUNCTION trg_mm_receiving_post();

-- 2. Trigger para reserva de estoque em pedidos de venda
CREATE OR REPLACE FUNCTION trg_sd_order_reserve()
RETURNS TRIGGER AS $$
DECLARE 
  r record;
BEGIN
  -- Quando status muda para 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Reservar cada item
    FOR r IN
      SELECT 
        tenant_id, 
        plant_id, 
        mm_material as sku, 
        quantity
      FROM sd_sales_order_item
      WHERE tenant_id = NEW.tenant_id AND so_id = NEW.so_id
    LOOP
      PERFORM post_inventory_movement(
        NEW.tenant_id, 
        r.plant_id, 
        r.sku, 
        r.quantity,
        'so_reserve', 
        'sd_sales_order', 
        NEW.so_id::text
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trg_sd_order_reserve ON sd_sales_order;
CREATE TRIGGER trg_sd_order_reserve
AFTER UPDATE OF status ON sd_sales_order
FOR EACH ROW EXECUTE FUNCTION trg_sd_order_reserve();

-- 3. Trigger para baixa de estoque em expedições
CREATE OR REPLACE FUNCTION trg_sd_shipment_issue()
RETURNS TRIGGER AS $$
DECLARE 
  r record;
BEGIN
  -- Quando status muda para 'complete' ou 'shipped'
  IF NEW.status IN ('complete','shipped') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Baixar cada item
    FOR r IN
      SELECT 
        i.tenant_id, 
        i.plant_id, 
        i.mm_material as sku, 
        i.quantity
      FROM sd_sales_order_item i
      WHERE i.tenant_id = NEW.tenant_id AND i.so_id = NEW.so_id
    LOOP
      -- Baixa on_hand (negativo)
      PERFORM post_inventory_movement(
        NEW.tenant_id, 
        r.plant_id, 
        r.sku, 
        -r.quantity, 
        'shipment', 
        'sd_shipment', 
        NEW.shipment_id::text
      );
      
      -- Libera reservado (negativo do reservado)
      PERFORM post_inventory_movement(
        NEW.tenant_id, 
        r.plant_id, 
        r.sku, 
        -r.quantity, 
        'so_release', 
        'sd_shipment', 
        NEW.shipment_id::text
      );
    END LOOP;

    -- Lançamento financeiro
    PERFORM fi_post_sales_shipment(NEW.tenant_id, NEW.so_id::text, NEW.shipment_id::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trg_sd_shipment_issue ON sd_shipment;
CREATE TRIGGER trg_sd_shipment_issue
AFTER UPDATE OF status ON sd_shipment
FOR EACH ROW EXECUTE FUNCTION trg_sd_shipment_issue();

SELECT 'Parte 3 executada com sucesso!' as status;

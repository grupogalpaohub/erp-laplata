INSERT INTO mm_purchase_order (
  tenant_id, mm_order, vendor_id, status, po_date, expected_delivery, notes, total_amount, currency, created_at
) VALUES
('LaplataLunaria','PO-2025-001','SUP_00001','received','2025-07-01','2025-07-21','Pedido inicial brincos',0,'BRL',NOW())
ON CONFLICT (mm_order) DO NOTHING;

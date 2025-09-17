-- 03_mm_purchase_order.sql - Load purchase order data for LaplataLunaria
INSERT INTO mm_purchase_order (
    po_id, tenant_id, vendor_id, status, order_date, expected_delivery,
    total_amount, currency, notes, created_at, updated_at
) VALUES 
('PO-2025-001', 'LaplataLunaria', 'SUP_00001', 'received', '2025-07-01', '2025-07-21', 0, 'BRL', 'Pedido de brincos para estoque', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (po_id, tenant_id) DO UPDATE SET
    vendor_id = EXCLUDED.vendor_id,
    status = EXCLUDED.status,
    order_date = EXCLUDED.order_date,
    expected_delivery = EXCLUDED.expected_delivery,
    total_amount = EXCLUDED.total_amount,
    currency = EXCLUDED.currency,
    notes = EXCLUDED.notes,
    updated_at = EXCLUDED.updated_at;
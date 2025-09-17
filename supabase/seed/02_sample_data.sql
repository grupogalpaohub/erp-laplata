-- Insert sample business data

-- Sample vendor
INSERT INTO mm_vendor (tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating)
VALUES ('LaplataLunaria', 'SUP_00001', 'Fornecedor Principal', 'contato@fornecedor.com', '(62) 99999-9999', 'Goiânia', 'GO', 'A');

-- Sample materials
INSERT INTO mm_material (tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, barcode, weight_grams, status, mm_vendor_id)
VALUES 
    ('LaplataLunaria', 'BR-001', 'BR001', 'Brinco de Prata 925', 'finished_good', 'prata', 4500, '7891234567890', 5, 'active', 'SUP_00001'),
    ('LaplataLunaria', 'BR-002', 'BR002', 'Colar de Prata 925', 'finished_good', 'prata', 3200, '7891234567891', 8, 'active', 'SUP_00001'),
    ('LaplataLunaria', 'BR-003', 'BR003', 'Anel de Prata 925', 'finished_good', 'prata', 2800, '7891234567892', 3, 'active', 'SUP_00001');

-- Sample customer
INSERT INTO crm_customer (tenant_id, customer_id, name, email, telefone, customer_type, status)
VALUES ('LaplataLunaria', 'CUST-0001', 'Cliente Exemplo', 'cliente@exemplo.com', '(62) 88888-8888', 'PF', 'active');

-- Sample financial account
INSERT INTO fi_account (tenant_id, account_id, name, type, currency, is_active)
VALUES ('LaplataLunaria', 'ACC-0001', 'Conta Corrente Principal', 'banco', 'BRL', TRUE);

-- Sample inventory balance
INSERT INTO wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty)
VALUES 
    ('LaplataLunaria', 'GOIANIA', 'BR-001', 100, 0),
    ('LaplataLunaria', 'GOIANIA', 'BR-002', 50, 0),
    ('LaplataLunaria', 'GOIANIA', 'BR-003', 75, 0);

-- Sample sales order
INSERT INTO sd_sales_order (tenant_id, so_id, customer_id, status, order_date, total_cents)
VALUES ('LaplataLunaria', 'SO-202401-000001', 'CUST-0001', 'confirmed', CURRENT_DATE, 4500);

-- Sample sales order item
INSERT INTO sd_sales_order_item (tenant_id, so_id, sku, quantity, unit_price_cents, line_total_cents)
VALUES ('LaplataLunaria', 'SO-202401-000001', 'BR-001', 1, 4500, 4500);

-- Sample lead
INSERT INTO crm_lead (tenant_id, lead_id, name, email, phone, source, status, score, created_date)
VALUES ('LaplataLunaria', 'LEAD-0001', 'Lead Exemplo', 'lead@exemplo.com', '(62) 77777-7777', 'instagram', 'novo', 75, CURRENT_DATE);

-- Sample opportunity
INSERT INTO crm_opportunity (tenant_id, opp_id, lead_id, stage, est_value_cents, probability, status, created_date)
VALUES ('LaplataLunaria', 'OPP-0001', 'LEAD-0001', 'discovery', 5000, 50, 'active', CURRENT_DATE);

-- Sample interaction
INSERT INTO crm_interaction (tenant_id, lead_id, channel, content, sentiment, created_date)
VALUES ('LaplataLunaria', 'LEAD-0001', 'whatsapp', 'Cliente interessado em brincos de prata', 'positive', CURRENT_DATE);

-- Sample purchase order
INSERT INTO mm_purchase_order (tenant_id, mm_order, vendor_id, status, po_date, expected_delivery)
VALUES ('LaplataLunaria', 'MM-202401-000001', 'SUP_00001', 'approved', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days');

-- Sample purchase order item
INSERT INTO mm_purchase_order_item (tenant_id, mm_order, plant_id, mm_material, mm_qtt, unit_cost_cents, line_total_cents)
VALUES ('LaplataLunaria', 'MM-202401-000001', 'GOIANIA', 'BR-001', 50, 3000, 150000);

-- Sample receiving
INSERT INTO mm_receiving (tenant_id, mm_order, plant_id, mm_material, qty_received)
VALUES ('LaplataLunaria', 'MM-202401-000001', 'GOIANIA', 'BR-001', 50);

-- Sample invoice
INSERT INTO fi_invoice (tenant_id, invoice_id, source_type, source_id, customer_id, amount_cents, due_date, status, created_date)
VALUES ('LaplataLunaria', 'INV-202401-000001', 'SO', 'SO-202401-000001', 'CUST-0001', 4500, CURRENT_DATE + INTERVAL '30 days', 'pending', CURRENT_DATE);

-- Sample payment
INSERT INTO fi_payment (tenant_id, payment_id, so_id, amount_cents, payment_method, status)
VALUES ('LaplataLunaria', 'PAY-202401-000001', 'SO-202401-000001', 4500, 'pix', 'pending');

-- Sample transaction
INSERT INTO fi_transaction (tenant_id, transaction_id, account_id, type, amount_cents, ref_type, ref_id)
VALUES ('LaplataLunaria', 'TXN-202401-000001', 'ACC-0001', 'credito', 4500, 'payment', 'PAY-202401-000001');

-- Sample cost center
INSERT INTO co_cost_center (tenant_id, cc_id, name, is_active)
VALUES 
    ('LaplataLunaria', 'CC-001', 'Vendas', TRUE),
    ('LaplataLunaria', 'CC-002', 'Produção', TRUE),
    ('LaplataLunaria', 'CC-003', 'Administrativo', TRUE);

-- Sample fiscal period
INSERT INTO co_fiscal_period (tenant_id, period_id, start_date, end_date, status)
VALUES ('LaplataLunaria', '2024-01', '2024-01-01', '2024-01-31', 'open');

-- Insert initial KPI snapshots
INSERT INTO co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number)
VALUES 
    ('LaplataLunaria', 'kpi_orders_today', NOW(), 1),
    ('LaplataLunaria', 'kpi_month_revenue_cents', NOW(), 4500),
    ('LaplataLunaria', 'kpi_active_leads', NOW(), 1),
    ('LaplataLunaria', 'kpi_stock_critical_count', NOW(), 0);
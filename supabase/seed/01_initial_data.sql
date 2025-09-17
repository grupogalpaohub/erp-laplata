-- Insert initial tenant
INSERT INTO tenant (tenant_id, display_name, locale, timezone) 
VALUES ('LaplataLunaria', 'Laplata Lunaria', 'pt-BR', 'America/Sao_Paulo');

-- Insert admin user profile (you'll need to replace the UUID with actual Supabase user UUID)
INSERT INTO user_profile (tenant_id, user_id, name, email, role, is_active)
VALUES ('LaplataLunaria', '00000000-0000-0000-0000-000000000000', 'Admin User', 'admin@laplata.com', 'admin', TRUE);

-- Insert document numbering configurations
INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
VALUES 
    ('LaplataLunaria', 'SO', 'SO', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'MM', 'MM', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'SH', 'SH', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'PAY', 'PAY', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'INV', 'INV', 'YYYYMM-SEQ6', 1, TRUE);

-- Insert default warehouse
INSERT INTO wh_warehouse (tenant_id, plant_id, name, is_default)
VALUES ('LaplataLunaria', 'GOIANIA', 'Depósito Goiânia', TRUE);

-- Insert setup configurations for each module
INSERT INTO mm_setup (tenant_id, default_payment_terms, default_currency, default_wh_id, require_mat_type, require_mat_class, allow_zero_price, default_uom)
VALUES ('LaplataLunaria', 30, 'BRL', 'GOIANIA', TRUE, TRUE, FALSE, 'UN');

INSERT INTO wh_setup (tenant_id, default_plant_id, reserve_policy, negative_stock_allowed, picking_strategy)
VALUES ('LaplataLunaria', 'GOIANIA', 'no_backorder', FALSE, 'fifo');

INSERT INTO sd_setup (tenant_id, backorder_policy, pricing_mode, default_channel, auto_reserve_on_confirm)
VALUES ('LaplataLunaria', 'block', 'material', 'site', TRUE);

INSERT INTO crm_setup (tenant_id, require_contact_info, auto_convert_on_first_order)
VALUES ('LaplataLunaria', TRUE, FALSE);

INSERT INTO fi_setup (tenant_id, currency, tax_inclusive, rounding_policy)
VALUES ('LaplataLunaria', 'BRL', FALSE, 'bankers');

INSERT INTO co_setup (tenant_id, timezone, kpi_refresh_cron)
VALUES ('LaplataLunaria', 'America/Sao_Paulo', '0 */15 * * * *');

-- Insert definition tables for MM
INSERT INTO mm_category_def (tenant_id, category, is_active)
VALUES 
    ('LaplataLunaria', 'brinco', TRUE),
    ('LaplataLunaria', 'colar', TRUE),
    ('LaplataLunaria', 'anel', TRUE),
    ('LaplataLunaria', 'pulseira', TRUE);

INSERT INTO mm_classification_def (tenant_id, classification, is_active)
VALUES 
    ('LaplataLunaria', 'prata', TRUE),
    ('LaplataLunaria', 'ouro', TRUE),
    ('LaplataLunaria', 'acabamento', TRUE),
    ('LaplataLunaria', 'embalagem', TRUE);

INSERT INTO mm_currency_def (tenant_id, currency, is_active)
VALUES ('LaplataLunaria', 'BRL', TRUE);

INSERT INTO mm_vendor_rating_def (tenant_id, rating, is_active)
VALUES 
    ('LaplataLunaria', 'A', TRUE),
    ('LaplataLunaria', 'B', TRUE),
    ('LaplataLunaria', 'C', TRUE);

INSERT INTO mm_status_def (tenant_id, object_type, status, description, is_final, order_index)
VALUES 
    ('LaplataLunaria', 'material', 'active', 'Ativo', FALSE, 1),
    ('LaplataLunaria', 'material', 'draft', 'Rascunho', FALSE, 2),
    ('LaplataLunaria', 'material', 'archived', 'Arquivado', TRUE, 3),
    ('LaplataLunaria', 'purchase_order', 'draft', 'Rascunho', FALSE, 1),
    ('LaplataLunaria', 'purchase_order', 'approved', 'Aprovado', FALSE, 2),
    ('LaplataLunaria', 'purchase_order', 'received', 'Recebido', TRUE, 3),
    ('LaplataLunaria', 'purchase_order', 'cancelled', 'Cancelado', TRUE, 4);

-- Insert definition tables for SD
INSERT INTO sd_order_status_def (tenant_id, status, description, is_final, order_index)
VALUES 
    ('LaplataLunaria', 'draft', 'Rascunho', FALSE, 1),
    ('LaplataLunaria', 'confirmed', 'Confirmado', FALSE, 2),
    ('LaplataLunaria', 'shipped', 'Enviado', FALSE, 3),
    ('LaplataLunaria', 'invoiced', 'Faturado', FALSE, 4),
    ('LaplataLunaria', 'delivered', 'Entregue', TRUE, 5),
    ('LaplataLunaria', 'cancelled', 'Cancelado', TRUE, 6);

INSERT INTO sd_shipment_status_def (tenant_id, status, description, is_final, order_index)
VALUES 
    ('LaplataLunaria', 'pending', 'Pendente', FALSE, 1),
    ('LaplataLunaria', 'partial', 'Parcial', FALSE, 2),
    ('LaplataLunaria', 'complete', 'Completo', TRUE, 3),
    ('LaplataLunaria', 'cancelled', 'Cancelado', TRUE, 4);

INSERT INTO sd_carrier_def (tenant_id, carrier_code, carrier_name, is_active)
VALUES 
    ('LaplataLunaria', 'correios', 'Correios', TRUE),
    ('LaplataLunaria', 'jadlog', 'Jadlog', TRUE),
    ('LaplataLunaria', 'total', 'Total Express', TRUE);

INSERT INTO sd_channel_def (tenant_id, channel, is_active)
VALUES 
    ('LaplataLunaria', 'site', TRUE),
    ('LaplataLunaria', 'whatsapp', TRUE),
    ('LaplataLunaria', 'instagram', TRUE),
    ('LaplataLunaria', 'loja_fisica', TRUE);

-- Insert definition tables for CRM
INSERT INTO crm_source_def (tenant_id, source, is_active)
VALUES 
    ('LaplataLunaria', 'instagram', TRUE),
    ('LaplataLunaria', 'whatsapp', TRUE),
    ('LaplataLunaria', 'site', TRUE),
    ('LaplataLunaria', 'indicacao', TRUE);

INSERT INTO crm_lead_status_def (tenant_id, status, description, order_index, is_final)
VALUES 
    ('LaplataLunaria', 'novo', 'Novo', 1, FALSE),
    ('LaplataLunaria', 'em_contato', 'Em Contato', 2, FALSE),
    ('LaplataLunaria', 'qualificado', 'Qualificado', 3, FALSE),
    ('LaplataLunaria', 'convertido', 'Convertido', 4, TRUE),
    ('LaplataLunaria', 'perdido', 'Perdido', 5, TRUE);

INSERT INTO crm_opp_stage_def (tenant_id, stage, description, order_index, is_final)
VALUES 
    ('LaplataLunaria', 'discovery', 'Descoberta', 1, FALSE),
    ('LaplataLunaria', 'validation', 'Validação', 2, FALSE),
    ('LaplataLunaria', 'closing', 'Fechamento', 3, FALSE),
    ('LaplataLunaria', 'won', 'Ganho', 4, TRUE),
    ('LaplataLunaria', 'lost', 'Perdido', 5, TRUE);

-- Insert definition tables for FI
INSERT INTO fi_payment_method_def (tenant_id, method, display_name, is_active)
VALUES 
    ('LaplataLunaria', 'pix', 'PIX', TRUE),
    ('LaplataLunaria', 'cartao', 'Cartão de Crédito', TRUE),
    ('LaplataLunaria', 'boleto', 'Boleto Bancário', TRUE),
    ('LaplataLunaria', 'transferencia', 'Transferência Bancária', TRUE);

INSERT INTO fi_payment_terms_def (tenant_id, terms_code, description, days, is_active)
VALUES 
    ('LaplataLunaria', 'NET30', '30 dias', 30, TRUE),
    ('LaplataLunaria', 'NET15', '15 dias', 15, TRUE),
    ('LaplataLunaria', 'NET7', '7 dias', 7, TRUE),
    ('LaplataLunaria', 'NET0', 'À vista', 0, TRUE);

-- Insert KPI definitions
INSERT INTO co_kpi_definition (tenant_id, kpi_key, name, unit, description)
VALUES 
    ('LaplataLunaria', 'kpi_orders_today', 'Pedidos Hoje', 'un', 'Número de pedidos criados hoje'),
    ('LaplataLunaria', 'kpi_month_revenue_cents', 'Receita do Mês', 'R$', 'Receita total do mês em centavos'),
    ('LaplataLunaria', 'kpi_active_leads', 'Leads Ativos', 'un', 'Número de leads ativos na semana'),
    ('LaplataLunaria', 'kpi_stock_critical_count', 'Estoque Crítico', 'un', 'Número de itens com estoque crítico');

-- Insert dashboard tiles
INSERT INTO co_dashboard_tile (tenant_id, tile_id, kpi_key, title, subtitle, order_index, color, is_active)
VALUES 
    ('LaplataLunaria', 'tile_1', 'kpi_orders_today', 'Pedidos Hoje', 'Média diária do mês', 1, 'blue', TRUE),
    ('LaplataLunaria', 'tile_2', 'kpi_month_revenue_cents', 'Receita do Mês', 'Média mensal histórica', 2, 'green', TRUE),
    ('LaplataLunaria', 'tile_3', 'kpi_active_leads', 'Leads Ativos (semana)', 'Média mensal', 3, 'purple', TRUE),
    ('LaplataLunaria', 'tile_4', 'kpi_stock_critical_count', 'Estoque Crítico (itens)', 'PNs críticos · Tendência de consumo', 4, 'red', TRUE);
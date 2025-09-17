-- ========================================
-- Customizing Seeds - Laplata Lunaria
-- ========================================

-- Criar Tenant Principal
INSERT INTO tenant (tenant_id, display_name, locale, timezone)
VALUES ('LaplataLunaria', 'La Plata Lunária', 'pt-BR', 'America/Sao_Paulo')
ON CONFLICT (tenant_id) DO NOTHING;

-- =======================
-- Setup Modules
-- =======================
INSERT INTO mm_setup (tenant_id, default_payment_terms, default_currency, default_uom, require_mat_type, require_mat_class, allow_zero_price)
VALUES ('LaplataLunaria', 30, 'BRL', 'unidade', true, true, false)
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO sd_setup (tenant_id, backorder_policy, pricing_mode, default_channel, auto_reserve_on_confirm)
VALUES ('LaplataLunaria', 'block', 'material', 'site', true)
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO wh_setup (tenant_id, default_plant_id, reserve_policy, negative_stock_allowed, picking_strategy)
VALUES ('LaplataLunaria', 'WH-001', 'no_backorder', false, 'fifo')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO fi_setup (tenant_id, currency, tax_inclusive, rounding_policy)
VALUES ('LaplataLunaria', 'BRL', false, 'bankers')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO co_setup (tenant_id, timezone, kpi_refresh_cron)
VALUES ('LaplataLunaria', 'America/Sao_Paulo', '0 */15 * * * *')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO crm_setup (tenant_id, require_contact_info, auto_convert_on_first_order)
VALUES ('LaplataLunaria', true, false)
ON CONFLICT (tenant_id) DO NOTHING;

-- =======================
-- Definições de Categorias
-- =======================
INSERT INTO mm_category_def (tenant_id, category, is_active) VALUES
('LaplataLunaria', 'brinco', true),
('LaplataLunaria', 'anel', true),
('LaplataLunaria', 'colar', true),
('LaplataLunaria', 'pulseira', true)
ON CONFLICT DO NOTHING;

-- =======================
-- Definições de Classificação
-- =======================
INSERT INTO mm_classification_def (tenant_id, classification, is_active) VALUES
('LaplataLunaria', '925', true),
('LaplataLunaria', 'banhado', true),
('LaplataLunaria', 'premium', true)
ON CONFLICT DO NOTHING;

-- =======================
-- Definições de Moeda
-- =======================
INSERT INTO mm_currency_def (tenant_id, currency, is_active) VALUES
('LaplataLunaria', 'BRL', true),
('LaplataLunaria', 'USD', true),
('LaplataLunaria', 'EUR', true)
ON CONFLICT DO NOTHING;

-- =======================
-- Vendor Rating
-- =======================
INSERT INTO mm_vendor_rating_def (tenant_id, rating, is_active) VALUES
('LaplataLunaria', 'A', true),
('LaplataLunaria', 'B', true),
('LaplataLunaria', 'C', true)
ON CONFLICT DO NOTHING;

-- =======================
-- Status MM (materiais, pedidos, recebimentos)
-- =======================
INSERT INTO mm_status_def (tenant_id, object_type, status, description, is_final, order_index) VALUES
('LaplataLunaria', 'material', 'active', 'Material ativo', false, 1),
('LaplataLunaria', 'material', 'archived', 'Material arquivado', true, 99),
('LaplataLunaria', 'po', 'draft', 'Pedido em rascunho', false, 1),
('LaplataLunaria', 'po', 'received', 'Pedido recebido', true, 99),
('LaplataLunaria', 'receiving', 'pending', 'Recebimento pendente', false, 1),
('LaplataLunaria', 'receiving', 'received', 'Recebimento concluído', true, 99)
ON CONFLICT DO NOTHING;

-- =======================
-- Status SD (vendas e entregas)
-- =======================
INSERT INTO sd_order_status_def (tenant_id, status, description, is_final, order_index) VALUES
('LaplataLunaria', 'draft', 'Pedido em rascunho', false, 1),
('LaplataLunaria', 'confirmed', 'Pedido confirmado', false, 2),
('LaplataLunaria', 'shipped', 'Pedido enviado', false, 3),
('LaplataLunaria', 'delivered', 'Pedido entregue', true, 99)
ON CONFLICT DO NOTHING;

INSERT INTO sd_shipment_status_def (tenant_id, status, description, is_final, order_index) VALUES
('LaplataLunaria', 'pending', 'Aguardando envio', false, 1),
('LaplataLunaria', 'in_transit', 'Em trânsito', false, 2),
('LaplataLunaria', 'delivered', 'Entregue', true, 99)
ON CONFLICT DO NOTHING;

-- =======================
-- Status WH (estoque e inventário)
-- =======================
INSERT INTO wh_inventory_status_def (tenant_id, status, is_active) VALUES
('LaplataLunaria', 'active', true),
('LaplataLunaria', 'blocked', true),
('LaplataLunaria', 'counting', true)
ON CONFLICT DO NOTHING;

-- =======================
-- Definições FI (formas de pagamento, condições, impostos)
-- =======================
INSERT INTO fi_payment_terms_def (tenant_id, terms_code, description, days, is_active) VALUES
('LaplataLunaria', 'NET30', 'Pagamento em 30 dias', 30, true),
('LaplataLunaria', 'NET15', 'Pagamento em 15 dias', 15, true)
ON CONFLICT DO NOTHING;

INSERT INTO fi_payment_method_def (tenant_id, method, display_name, is_active) VALUES
('LaplataLunaria', 'pix', 'PIX', true),
('LaplataLunaria', 'boleto', 'Boleto Bancário', true),
('LaplataLunaria', 'credito', 'Cartão de Crédito', true)
ON CONFLICT DO NOTHING;

INSERT INTO fi_tax_code_def (tenant_id, tax_code, description, rate_bp) VALUES
('LaplataLunaria', 'ISENTO', 'Isento de impostos', 0),
('LaplataLunaria', 'ICMS18', 'ICMS 18%', 1800),
('LaplataLunaria', 'PIS1', 'PIS 1%', 100),
('LaplataLunaria', 'COFINS3', 'COFINS 3%', 300)
ON CONFLICT DO NOTHING;

-- =======================
-- Dashboard (KPIs e Tiles)
-- =======================
INSERT INTO co_kpi_definition (tenant_id, kpi_key, name, unit, description) VALUES
('LaplataLunaria', 'SALES_TODAY', 'Vendas Hoje', 'BRL', 'Total de vendas do dia'),
('LaplataLunaria', 'ORDERS_OPEN', 'Pedidos Abertos', 'Qtd', 'Número de pedidos em aberto'),
('LaplataLunaria', 'INVENTORY_VALUE', 'Valor do Estoque', 'BRL', 'Valor total dos materiais em estoque')
ON CONFLICT DO NOTHING;

INSERT INTO co_dashboard_tile (tenant_id, tile_id, kpi_key, title, subtitle, order_index, color, is_active) VALUES
('LaplataLunaria', 'TILE01', 'SALES_TODAY', 'Vendas Hoje', 'Resumo diário', 1, '#4CAF50', true),
('LaplataLunaria', 'TILE02', 'ORDERS_OPEN', 'Pedidos Abertos', 'Pedidos em processamento', 2, '#2196F3', true),
('LaplataLunaria', 'TILE03', 'INVENTORY_VALUE', 'Estoque Atual', 'Valor total em BRL', 3, '#FFC107', true)
ON CONFLICT DO NOTHING;

-- =======================
-- CRM Status e Etapas
-- =======================
INSERT INTO crm_lead_status_def (tenant_id, status, description, order_index, is_final) VALUES
('LaplataLunaria', 'novo', 'Lead novo', 1, false),
('LaplataLunaria', 'qualificado', 'Lead qualificado', 2, false),
('LaplataLunaria', 'convertido', 'Lead convertido', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO crm_opp_stage_def (tenant_id, stage, description, order_index, is_final) VALUES
('LaplataLunaria', 'discovery', 'Descoberta inicial', 1, false),
('LaplataLunaria', 'proposal', 'Proposta enviada', 2, false),
('LaplataLunaria', 'closed_won', 'Fechado - Ganhou', 3, true),
('LaplataLunaria', 'closed_lost', 'Fechado - Perdido', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO crm_source_def (tenant_id, source, is_active) VALUES
('LaplataLunaria', 'instagram', true),
('LaplataLunaria', 'site', true),
('LaplataLunaria', 'indicacao', true)
ON CONFLICT DO NOTHING;

-- ========================================
-- Fim do arquivo customizing.sql
-- ========================================

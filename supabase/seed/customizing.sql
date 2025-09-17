-- Customizing Seeds for ERP La Plata
-- Idempotent inserts for tenant, setup, and definitions

-- ========================================
-- 1. Tenant
-- ========================================
INSERT INTO tenant (tenant_id, name, status, created_at, updated_at)
VALUES ('LaplataLunaria', 'Laplata Lunaria', 'active', NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 2. Default Warehouse
-- ========================================
INSERT INTO wh_warehouse (
    warehouse_id, tenant_id, name, address, city, state, zip_code, 
    country, contact_person, phone, email, is_default, status, 
    created_at, updated_at
) VALUES (
    'WH-001', 'LaplataLunaria', 'Depósito Principal', 
    'Rua Industrial, 1000', 'São Paulo', 'SP', '01234-567', 
    'Brasil', 'João Silva', '(11) 99999-9999', 'deposito@laplatalunaria.com.br', 
    true, 'active', NOW(), NOW()
)
ON CONFLICT (warehouse_id, tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    contact_person = EXCLUDED.contact_person,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    is_default = EXCLUDED.is_default,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 3. Module Setup
-- ========================================

-- MM Setup
INSERT INTO mm_setup (tenant_id, auto_approve_po, auto_receive_po, default_currency, created_at, updated_at)
VALUES ('LaplataLunaria', false, false, 'BRL', NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    auto_approve_po = EXCLUDED.auto_approve_po,
    auto_receive_po = EXCLUDED.auto_receive_po,
    default_currency = EXCLUDED.default_currency,
    updated_at = EXCLUDED.updated_at;

-- WH Setup
INSERT INTO wh_setup (tenant_id, auto_reserve_on_so, backorder_policy, created_at, updated_at)
VALUES ('LaplataLunaria', true, 'allow', NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    auto_reserve_on_so = EXCLUDED.auto_reserve_on_so,
    backorder_policy = EXCLUDED.backorder_policy,
    updated_at = EXCLUDED.updated_at;

-- SD Setup
INSERT INTO sd_setup (tenant_id, auto_reserve_on_confirm, backorder_policy, created_at, updated_at)
VALUES ('LaplataLunaria', true, 'allow', NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    auto_reserve_on_confirm = EXCLUDED.auto_reserve_on_confirm,
    backorder_policy = EXCLUDED.backorder_policy,
    updated_at = EXCLUDED.updated_at;

-- CRM Setup
INSERT INTO crm_setup (tenant_id, auto_assign_leads, created_at, updated_at)
VALUES ('LaplataLunaria', false, NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    auto_assign_leads = EXCLUDED.auto_assign_leads,
    updated_at = EXCLUDED.updated_at;

-- FI Setup
INSERT INTO fi_setup (tenant_id, default_currency, created_at, updated_at)
VALUES ('LaplataLunaria', 'BRL', NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    default_currency = EXCLUDED.default_currency,
    updated_at = EXCLUDED.updated_at;

-- CO Setup
INSERT INTO co_setup (tenant_id, kpi_refresh_interval_minutes, created_at, updated_at)
VALUES ('LaplataLunaria', 15, NOW(), NOW())
ON CONFLICT (tenant_id) DO UPDATE SET
    kpi_refresh_interval_minutes = EXCLUDED.kpi_refresh_interval_minutes,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 4. MM Definitions
-- ========================================

-- Material Categories
INSERT INTO mm_category_def (tenant_id, category_code, category_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'brinco', 'Brincos', 'Brincos de prata e ouro', NOW(), NOW()),
    ('LaplataLunaria', 'colar', 'Colares', 'Colares de prata e ouro', NOW(), NOW()),
    ('LaplataLunaria', 'anel', 'Anéis', 'Anéis de prata e ouro', NOW(), NOW()),
    ('LaplataLunaria', 'pulseira', 'Pulseiras', 'Pulseiras de prata e ouro', NOW(), NOW())
ON CONFLICT (tenant_id, category_code) DO UPDATE SET
    category_name = EXCLUDED.category_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Material Classifications
INSERT INTO mm_classification_def (tenant_id, classification_code, classification_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'prata', 'Prata', 'Peças de prata 925', NOW(), NOW()),
    ('LaplataLunaria', 'ouro', 'Ouro', 'Peças de ouro 18k', NOW(), NOW()),
    ('LaplataLunaria', 'acabamento', 'Acabamento', 'Materiais de acabamento', NOW(), NOW()),
    ('LaplataLunaria', 'embalagem', 'Embalagem', 'Materiais de embalagem', NOW(), NOW())
ON CONFLICT (tenant_id, classification_code) DO UPDATE SET
    classification_name = EXCLUDED.classification_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Currencies
INSERT INTO mm_currency_def (tenant_id, currency_code, currency_name, symbol, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'BRL', 'Real Brasileiro', 'R$', NOW(), NOW()),
    ('LaplataLunaria', 'USD', 'Dólar Americano', '$', NOW(), NOW())
ON CONFLICT (tenant_id, currency_code) DO UPDATE SET
    currency_name = EXCLUDED.currency_name,
    symbol = EXCLUDED.symbol,
    updated_at = EXCLUDED.updated_at;

-- Vendor Ratings
INSERT INTO mm_vendor_rating_def (tenant_id, rating_code, rating_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'A', 'Excelente', 'Fornecedor com excelente qualidade', NOW(), NOW()),
    ('LaplataLunaria', 'B', 'Bom', 'Fornecedor com boa qualidade', NOW(), NOW()),
    ('LaplataLunaria', 'C', 'Regular', 'Fornecedor com qualidade regular', NOW(), NOW())
ON CONFLICT (tenant_id, rating_code) DO UPDATE SET
    rating_name = EXCLUDED.rating_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Status Definitions
INSERT INTO mm_status_def (tenant_id, entity_type, status_code, status_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'material', 'active', 'Ativo', 'Material ativo', NOW(), NOW()),
    ('LaplataLunaria', 'material', 'inactive', 'Inativo', 'Material inativo', NOW(), NOW()),
    ('LaplataLunaria', 'purchase_order', 'draft', 'Rascunho', 'Pedido em rascunho', NOW(), NOW()),
    ('LaplataLunaria', 'purchase_order', 'approved', 'Aprovado', 'Pedido aprovado', NOW(), NOW()),
    ('LaplataLunaria', 'purchase_order', 'received', 'Recebido', 'Pedido recebido', NOW(), NOW()),
    ('LaplataLunaria', 'purchase_order', 'cancelled', 'Cancelado', 'Pedido cancelado', NOW(), NOW()),
    ('LaplataLunaria', 'receiving', 'received', 'Recebido', 'Recebimento confirmado', NOW(), NOW()),
    ('LaplataLunaria', 'receiving', 'partial', 'Parcial', 'Recebimento parcial', NOW(), NOW())
ON CONFLICT (tenant_id, entity_type, status_code) DO UPDATE SET
    status_name = EXCLUDED.status_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 5. SD Definitions
-- ========================================

-- Order Status
INSERT INTO sd_order_status_def (tenant_id, status_code, status_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'draft', 'Rascunho', 'Pedido em rascunho', NOW(), NOW()),
    ('LaplataLunaria', 'confirmed', 'Confirmado', 'Pedido confirmado', NOW(), NOW()),
    ('LaplataLunaria', 'shipped', 'Enviado', 'Pedido enviado', NOW(), NOW()),
    ('LaplataLunaria', 'delivered', 'Entregue', 'Pedido entregue', NOW(), NOW()),
    ('LaplataLunaria', 'cancelled', 'Cancelado', 'Pedido cancelado', NOW(), NOW())
ON CONFLICT (tenant_id, status_code) DO UPDATE SET
    status_name = EXCLUDED.status_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Shipment Status
INSERT INTO sd_shipment_status_def (tenant_id, status_code, status_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'pending', 'Pendente', 'Envio pendente', NOW(), NOW()),
    ('LaplataLunaria', 'shipped', 'Enviado', 'Enviado', NOW(), NOW()),
    ('LaplataLunaria', 'delivered', 'Entregue', 'Entregue', NOW(), NOW())
ON CONFLICT (tenant_id, status_code) DO UPDATE SET
    status_name = EXCLUDED.status_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Carriers
INSERT INTO sd_carrier_def (tenant_id, carrier_code, carrier_name, contact_info, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'correios', 'Correios', '0800 725 0100', NOW(), NOW()),
    ('LaplataLunaria', 'jadlog', 'Jadlog', '0800 770 3600', NOW(), NOW())
ON CONFLICT (tenant_id, carrier_code) DO UPDATE SET
    carrier_name = EXCLUDED.carrier_name,
    contact_info = EXCLUDED.contact_info,
    updated_at = EXCLUDED.updated_at;

-- Channels
INSERT INTO sd_channel_def (tenant_id, channel_code, channel_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'site', 'Site', 'Vendas pelo site', NOW(), NOW()),
    ('LaplataLunaria', 'whatsapp', 'WhatsApp', 'Vendas pelo WhatsApp', NOW(), NOW()),
    ('LaplataLunaria', 'instagram', 'Instagram', 'Vendas pelo Instagram', NOW(), NOW())
ON CONFLICT (tenant_id, channel_code) DO UPDATE SET
    channel_name = EXCLUDED.channel_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 6. CRM Definitions
-- ========================================

-- Lead Sources
INSERT INTO crm_source_def (tenant_id, source_code, source_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'instagram', 'Instagram', 'Leads do Instagram', NOW(), NOW()),
    ('LaplataLunaria', 'whatsapp', 'WhatsApp', 'Leads do WhatsApp', NOW(), NOW()),
    ('LaplataLunaria', 'site', 'Site', 'Leads do site', NOW(), NOW())
ON CONFLICT (tenant_id, source_code) DO UPDATE SET
    source_name = EXCLUDED.source_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Lead Status
INSERT INTO crm_lead_status_def (tenant_id, status_code, status_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'new', 'Novo', 'Lead novo', NOW(), NOW()),
    ('LaplataLunaria', 'contacted', 'Contatado', 'Lead contatado', NOW(), NOW()),
    ('LaplataLunaria', 'qualified', 'Qualificado', 'Lead qualificado', NOW(), NOW()),
    ('LaplataLunaria', 'converted', 'Convertido', 'Lead convertido', NOW(), NOW()),
    ('LaplataLunaria', 'lost', 'Perdido', 'Lead perdido', NOW(), NOW())
ON CONFLICT (tenant_id, status_code) DO UPDATE SET
    status_name = EXCLUDED.status_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Opportunity Stages
INSERT INTO crm_opp_stage_def (tenant_id, stage_code, stage_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'prospecting', 'Prospecção', 'Fase de prospecção', NOW(), NOW()),
    ('LaplataLunaria', 'qualification', 'Qualificação', 'Fase de qualificação', NOW(), NOW()),
    ('LaplataLunaria', 'proposal', 'Proposta', 'Fase de proposta', NOW(), NOW()),
    ('LaplataLunaria', 'negotiation', 'Negociação', 'Fase de negociação', NOW(), NOW()),
    ('LaplataLunaria', 'closed_won', 'Fechado Ganho', 'Oportunidade ganha', NOW(), NOW()),
    ('LaplataLunaria', 'closed_lost', 'Fechado Perdido', 'Oportunidade perdida', NOW(), NOW())
ON CONFLICT (tenant_id, stage_code) DO UPDATE SET
    stage_name = EXCLUDED.stage_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 7. FI Definitions
-- ========================================

-- Payment Methods
INSERT INTO fi_payment_method_def (tenant_id, method_code, method_name, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'pix', 'PIX', 'Pagamento via PIX', NOW(), NOW()),
    ('LaplataLunaria', 'cartao', 'Cartão', 'Pagamento via cartão', NOW(), NOW()),
    ('LaplataLunaria', 'boleto', 'Boleto', 'Pagamento via boleto', NOW(), NOW())
ON CONFLICT (tenant_id, method_code) DO UPDATE SET
    method_name = EXCLUDED.method_name,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Payment Terms
INSERT INTO fi_payment_terms_def (tenant_id, terms_code, terms_name, days, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'NET30', '30 dias', 30, 'Pagamento em 30 dias', NOW(), NOW()),
    ('LaplataLunaria', 'NET15', '15 dias', 15, 'Pagamento em 15 dias', NOW(), NOW()),
    ('LaplataLunaria', 'NET7', '7 dias', 7, 'Pagamento em 7 dias', NOW(), NOW())
ON CONFLICT (tenant_id, terms_code) DO UPDATE SET
    terms_name = EXCLUDED.terms_name,
    days = EXCLUDED.days,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- Tax Codes
INSERT INTO fi_tax_code_def (tenant_id, tax_code, tax_name, tax_rate, description, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'ICMS18', 'ICMS 18%', 18.0, 'ICMS 18%', NOW(), NOW()),
    ('LaplataLunaria', 'ICMS12', 'ICMS 12%', 12.0, 'ICMS 12%', NOW(), NOW()),
    ('LaplataLunaria', 'ISENTO', 'Isento', 0.0, 'Isento de impostos', NOW(), NOW())
ON CONFLICT (tenant_id, tax_code) DO UPDATE SET
    tax_name = EXCLUDED.tax_name,
    tax_rate = EXCLUDED.tax_rate,
    description = EXCLUDED.description,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 8. Document Numbering
-- ========================================

INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'SO', 'SO', 'YYYYMM-SEQ6', 1, true, NOW(), NOW()),
    ('LaplataLunaria', 'MM', 'PO', 'YYYYMM-SEQ6', 1, true, NOW(), NOW()),
    ('LaplataLunaria', 'SH', 'SH', 'YYYYMM-SEQ6', 1, true, NOW(), NOW()),
    ('LaplataLunaria', 'PAY', 'PAY', 'YYYYMM-SEQ6', 1, true, NOW(), NOW()),
    ('LaplataLunaria', 'INV', 'INV', 'YYYYMM-SEQ6', 1, true, NOW(), NOW())
ON CONFLICT (tenant_id, doc_type) DO UPDATE SET
    prefix = EXCLUDED.prefix,
    format = EXCLUDED.format,
    next_seq = EXCLUDED.next_seq,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;

-- ========================================
-- 9. KPI Definitions
-- ========================================

INSERT INTO co_kpi_definition (tenant_id, kpi_key, kpi_name, description, calculation_method, target_value, unit, created_at, updated_at)
VALUES 
    ('LaplataLunaria', 'kpi_orders_today', 'Pedidos Hoje', 'Número de pedidos hoje', 'count', 10, 'unidades', NOW(), NOW()),
    ('LaplataLunaria', 'kpi_month_revenue_cents', 'Receita do Mês', 'Receita do mês em centavos', 'sum', 10000000, 'centavos', NOW(), NOW()),
    ('LaplataLunaria', 'kpi_active_leads', 'Leads Ativos', 'Número de leads ativos', 'count', 50, 'leads', NOW(), NOW()),
    ('LaplataLunaria', 'kpi_stock_critical_count', 'Estoque Crítico', 'Número de itens com estoque baixo', 'count', 5, 'itens', NOW(), NOW())
ON CONFLICT (tenant_id, kpi_key) DO UPDATE SET
    kpi_name = EXCLUDED.kpi_name,
    description = EXCLUDED.description,
    calculation_method = EXCLUDED.calculation_method,
    target_value = EXCLUDED.target_value,
    unit = EXCLUDED.unit,
    updated_at = EXCLUDED.updated_at;
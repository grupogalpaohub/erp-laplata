-- Adicionar campos necessários para o módulo FI/CO conforme requerimento

-- Tabela para lançamentos financeiros
CREATE TABLE IF NOT EXISTS fi_financial_entry (
    tenant_id TEXT NOT NULL,
    entry_id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
    category TEXT NOT NULL,
    amount_cents INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    reference_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para contas a pagar
CREATE TABLE IF NOT EXISTS fi_accounts_payable (
    tenant_id TEXT NOT NULL,
    ap_id TEXT PRIMARY KEY,
    vendor_id TEXT REFERENCES mm_vendor(vendor_id),
    due_date DATE NOT NULL,
    amount_due_cents INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Pago', 'Atrasado', 'Cancelado')),
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para contas a receber
CREATE TABLE IF NOT EXISTS fi_accounts_receivable (
    tenant_id TEXT NOT NULL,
    ar_id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES crm_customer(customer_id),
    due_date DATE NOT NULL,
    amount_due_cents INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Recebido', 'Atrasado', 'Cancelado')),
    receipt_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para categorias de despesas
CREATE TABLE IF NOT EXISTS fi_expense_category (
    tenant_id TEXT NOT NULL,
    category_code TEXT NOT NULL,
    category_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, category_code)
);

-- Inserir categorias padrão
INSERT INTO fi_expense_category (tenant_id, category_code, category_name, is_active)
VALUES
    ('LaplataLunaria', 'VENDAS', 'Vendas', TRUE),
    ('LaplataLunaria', 'FORNECEDORES', 'Fornecedores', TRUE),
    ('LaplataLunaria', 'MARKETING', 'Marketing', TRUE),
    ('LaplataLunaria', 'FRETE', 'Frete', TRUE),
    ('LaplataLunaria', 'IMPOSTOS', 'Impostos', TRUE),
    ('LaplataLunaria', 'OUTROS', 'Outros', TRUE)
ON CONFLICT (tenant_id, category_code) DO UPDATE SET
    category_name = EXCLUDED.category_name,
    is_active = EXCLUDED.is_active;

-- Inserir métodos de pagamento padrão
INSERT INTO fi_payment_method_def (tenant_id, method, display_name, is_active)
VALUES
    ('LaplataLunaria', 'PIX', 'PIX', TRUE),
    ('LaplataLunaria', 'CARTAO', 'Cartão de Crédito/Débito', TRUE),
    ('LaplataLunaria', 'BOLETO', 'Boleto Bancário', TRUE),
    ('LaplataLunaria', 'TRANSFERENCIA', 'Transferência Bancária', TRUE),
    ('LaplataLunaria', 'DINHEIRO', 'Dinheiro', TRUE)
ON CONFLICT (tenant_id, method) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    is_active = EXCLUDED.is_active;

-- Função para atualizar status de contas a pagar/receber baseado na data
CREATE OR REPLACE FUNCTION update_accounts_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Para contas a pagar
    IF TG_TABLE_NAME = 'fi_accounts_payable' THEN
        IF NEW.status = 'Aberto' AND NEW.due_date < CURRENT_DATE THEN
            NEW.status = 'Atrasado';
        END IF;
    END IF;
    
    -- Para contas a receber
    IF TG_TABLE_NAME = 'fi_accounts_receivable' THEN
        IF NEW.status = 'Aberto' AND NEW.due_date < CURRENT_DATE THEN
            NEW.status = 'Atrasado';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar status automaticamente
CREATE TRIGGER trigger_update_ap_status
    BEFORE INSERT OR UPDATE ON fi_accounts_payable
    FOR EACH ROW
    EXECUTE FUNCTION update_accounts_status();

CREATE TRIGGER trigger_update_ar_status
    BEFORE INSERT OR UPDATE ON fi_accounts_receivable
    FOR EACH ROW
    EXECUTE FUNCTION update_accounts_status();

-- View para KPIs financeiros
CREATE OR REPLACE VIEW fi_financial_kpis AS
SELECT 
    tenant_id,
    -- Receita total (últimos 30 dias)
    COALESCE((
        SELECT SUM(amount_cents) 
        FROM fi_financial_entry 
        WHERE tenant_id = fe.tenant_id 
        AND type = 'entrada' 
        AND date >= CURRENT_DATE - INTERVAL '30 days'
    ), 0) as total_revenue_30d_cents,
    
    -- Despesa total (últimos 30 dias)
    COALESCE((
        SELECT SUM(amount_cents) 
        FROM fi_financial_entry 
        WHERE tenant_id = fe.tenant_id 
        AND type = 'saida' 
        AND date >= CURRENT_DATE - INTERVAL '30 days'
    ), 0) as total_expenses_30d_cents,
    
    -- Contas a receber em aberto
    COALESCE((
        SELECT SUM(amount_due_cents) 
        FROM fi_accounts_receivable 
        WHERE tenant_id = fe.tenant_id 
        AND status IN ('Aberto', 'Atrasado')
    ), 0) as open_ar_cents,
    
    -- Contas a pagar em aberto
    COALESCE((
        SELECT SUM(amount_due_cents) 
        FROM fi_accounts_payable 
        WHERE tenant_id = fe.tenant_id 
        AND status IN ('Aberto', 'Atrasado')
    ), 0) as open_ap_cents
    
FROM fi_financial_entry fe
GROUP BY tenant_id;

-- CRM CUSTOMER – MIGRAÇÃO SEGURA (idempotente)

-- 1) Campos de contato e endereço
ALTER TABLE crm_customer
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS phone_country TEXT DEFAULT 'BR',
  ADD COLUMN IF NOT EXISTS contact_name TEXT,
  ADD COLUMN IF NOT EXISTS document_id TEXT,
  ADD COLUMN IF NOT EXISTS addr_street TEXT,
  ADD COLUMN IF NOT EXISTS addr_number TEXT,
  ADD COLUMN IF NOT EXISTS addr_complement TEXT,
  ADD COLUMN IF NOT EXISTS addr_district TEXT,
  ADD COLUMN IF NOT EXISTS addr_city TEXT,
  ADD COLUMN IF NOT EXISTS addr_state TEXT,
  ADD COLUMN IF NOT EXISTS addr_zip TEXT,
  ADD COLUMN IF NOT EXISTS addr_country TEXT DEFAULT 'BR',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2) Campos CRM
ALTER TABLE crm_customer
  ADD COLUMN IF NOT EXISTS customer_category TEXT,
  ADD COLUMN IF NOT EXISTS lead_classification TEXT,
  ADD COLUMN IF NOT EXISTS sales_channel TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS preferred_payment_method TEXT,
  ADD COLUMN IF NOT EXISTS preferred_payment_terms TEXT;

-- 3) Copiar dados legados SE as colunas antigas existirem
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='crm_customer' AND column_name='email'
  ) THEN
    EXECUTE $cpy$
      UPDATE crm_customer 
      SET contact_email = email
      WHERE contact_email IS NULL AND email IS NOT NULL
    $cpy$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='crm_customer' AND column_name='telefone'
  ) THEN
    EXECUTE $cpy$
      UPDATE crm_customer 
      SET contact_phone = telefone
      WHERE contact_phone IS NULL AND telefone IS NOT NULL
    $cpy$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='crm_customer' AND column_name='status'
  ) THEN
    EXECUTE $cpy$
      UPDATE crm_customer
      SET is_active = CASE WHEN status = 'active' THEN TRUE ELSE FALSE END
      WHERE is_active IS NULL
    $cpy$;
  END IF;
END $$;

-- 4) Índice único parcial (evita conflito se houver e-mails repetidos/nulos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname='public' AND indexname='ux_crm_customer_tenant_email_notnull'
  ) THEN
    CREATE UNIQUE INDEX ux_crm_customer_tenant_email_notnull
      ON crm_customer(tenant_id, contact_email)
      WHERE contact_email IS NOT NULL;
  END IF;
END $$;

-- 5) Índices úteis
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname='public' AND indexname='ix_crm_customer_tenant'
  ) THEN
    CREATE INDEX ix_crm_customer_tenant ON crm_customer(tenant_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname='public' AND indexname='ix_crm_customer_sales_channel'
  ) THEN
    CREATE INDEX ix_crm_customer_sales_channel ON crm_customer(tenant_id, sales_channel);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname='public' AND indexname='ix_crm_customer_lead_class'
  ) THEN
    CREATE INDEX ix_crm_customer_lead_class ON crm_customer(tenant_id, lead_classification);
  END IF;
END $$;

-- 6) Comentários
COMMENT ON COLUMN crm_customer.contact_email IS 'Email de contato do cliente';
COMMENT ON COLUMN crm_customer.contact_phone IS 'Telefone de contato do cliente';
COMMENT ON COLUMN crm_customer.customer_category IS 'Categoria do cliente (VIP, REGULAR, etc.)';
COMMENT ON COLUMN crm_customer.lead_classification IS 'Classificação do lead (novo, qualificado, etc.)';
COMMENT ON COLUMN crm_customer.sales_channel IS 'Canal de vendas (whatsapp, instagram, etc.)';
COMMENT ON COLUMN crm_customer.preferred_payment_method IS 'Método de pagamento favorito do cliente';
COMMENT ON COLUMN crm_customer.preferred_payment_terms IS 'Prazo de pagamento favorito do cliente';

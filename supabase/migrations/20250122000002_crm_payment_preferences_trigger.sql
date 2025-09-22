-- Trigger para atualizar preferências de pagamento automaticamente
-- quando um pagamento for inserido ou atualizado

-- Função para atualizar preferências de pagamento
CREATE OR REPLACE FUNCTION update_customer_payment_preferences()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_id TEXT;
  v_tenant_id TEXT;
BEGIN
  -- Obter customer_id e tenant_id do pedido de venda
  SELECT so.customer_id, so.tenant_id
  INTO v_customer_id, v_tenant_id
  FROM sd_sales_order so
  WHERE so.so_id = NEW.so_id;

  -- Se não encontrar o pedido, retornar
  IF v_customer_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Atualizar preferências de pagamento do cliente
  PERFORM update_customer_payment_preferences_sql(v_tenant_id, v_customer_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função SQL para atualizar preferências (chamada pela função acima)
CREATE OR REPLACE FUNCTION update_customer_payment_preferences_sql(
  p_tenant_id TEXT,
  p_customer_id TEXT
)
RETURNS VOID AS $$
DECLARE
  v_preferred_method TEXT;
  v_preferred_terms TEXT;
  v_method_count INTEGER;
  v_terms_count INTEGER;
  v_method_date TEXT;
  v_terms_date TEXT;
BEGIN
  -- Calcular método de pagamento mais usado
  SELECT 
    payment_method,
    COUNT(*) as method_count,
    MAX(payment_date) as method_date
  INTO v_preferred_method, v_method_count, v_method_date
  FROM sd_payment p
  JOIN sd_sales_order so ON p.so_id = so.so_id
  WHERE p.tenant_id = p_tenant_id
    AND so.customer_id = p_customer_id
    AND p.payment_method IS NOT NULL
  GROUP BY payment_method
  ORDER BY method_count DESC, method_date DESC
  LIMIT 1;

  -- Calcular prazo de pagamento mais usado
  SELECT 
    payment_terms,
    COUNT(*) as terms_count,
    MAX(payment_date) as terms_date
  INTO v_preferred_terms, v_terms_count, v_terms_date
  FROM sd_payment p
  JOIN sd_sales_order so ON p.so_id = so.so_id
  WHERE p.tenant_id = p_tenant_id
    AND so.customer_id = p_customer_id
    AND p.payment_terms IS NOT NULL
  GROUP BY payment_terms
  ORDER BY terms_count DESC, terms_date DESC
  LIMIT 1;

  -- Atualizar cliente com as preferências calculadas
  UPDATE crm_customer
  SET 
    preferred_payment_method = v_preferred_method,
    preferred_payment_terms = v_preferred_terms,
    updated_at = NOW()
  WHERE tenant_id = p_tenant_id
    AND customer_id = p_customer_id
    AND (preferred_payment_method IS DISTINCT FROM v_preferred_method
         OR preferred_payment_terms IS DISTINCT FROM v_preferred_terms);

END;
$$ LANGUAGE plpgsql;

-- Criar trigger para sd_payment
DROP TRIGGER IF EXISTS trigger_update_customer_payment_preferences ON sd_payment;

CREATE TRIGGER trigger_update_customer_payment_preferences
  AFTER INSERT OR UPDATE ON sd_payment
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_payment_preferences();

-- Comentários para documentação
COMMENT ON FUNCTION update_customer_payment_preferences() IS 
'Trigger que atualiza automaticamente as preferências de pagamento do cliente quando um pagamento é inserido ou atualizado';

COMMENT ON FUNCTION update_customer_payment_preferences_sql(TEXT, TEXT) IS 
'Função SQL que calcula e atualiza as preferências de pagamento de um cliente baseado no histórico de pagamentos';

import { supabaseServer } from '@/lib/supabase/server';

/**
 * Atualiza as preferências de pagamento de um cliente baseado no histórico de pagamentos
 * @param tenantId - ID do tenant
 * @param customerId - ID do cliente
 */
export async function updateCustomerPaymentPreferences(tenantId: string, customerId: string) {
  try {
    const supabase = supabaseServer();
    
    console.log(`[CRM] Atualizando preferências de pagamento para cliente ${customerId}`);
    
    // Buscar histórico de pagamentos do cliente
    const { data: payments, error: paymentsError } = await supabase
      .from('sd_payment')
      .select(`
        payment_method,
        payment_terms,
        payment_date,
        so_id,
        sd_sales_order!inner(customer_id)
      `)
      .eq('tenant_id', tenantId)
      .eq('sd_sales_order.customer_id', customerId)
      .order('payment_date', { ascending: false });

    if (paymentsError) {
      console.error('[CRM] Erro ao buscar pagamentos:', paymentsError);
      return;
    }

    if (!payments || payments.length === 0) {
      console.log(`[CRM] Nenhum pagamento encontrado para cliente ${customerId}`);
      return;
    }

    console.log(`[CRM] Encontrados ${payments.length} pagamentos para cliente ${customerId}`);

    // Calcular método de pagamento mais usado
    const methodCounts = new Map<string, number>();
    const methodDates = new Map<string, string>();
    
    payments.forEach((payment: any) => {
      if (payment.payment_method) {
        const count = methodCounts.get(payment.payment_method) || 0;
        methodCounts.set(payment.payment_method, count + 1);
        
        // Guardar a data mais recente para desempate
        if (!methodDates.get(payment.payment_method) || payment.payment_date > methodDates.get(payment.payment_method)!) {
          methodDates.set(payment.payment_method, payment.payment_date);
        }
      }
    });

    // Encontrar método mais frequente (em caso de empate, usar o mais recente)
    let preferredMethod = null;
    let maxCount = 0;
    let mostRecentDate = '';

    for (const [method, count] of methodCounts) {
      const date = methodDates.get(method) || '';
      if (count > maxCount || (count === maxCount && date > mostRecentDate)) {
        preferredMethod = method;
        maxCount = count;
        mostRecentDate = date;
      }
    }

    // Calcular prazo de pagamento mais usado
    const termsCounts = new Map<string, number>();
    const termsDates = new Map<string, string>();
    
    payments.forEach((payment: any) => {
      if (payment.payment_terms) {
        const count = termsCounts.get(payment.payment_terms) || 0;
        termsCounts.set(payment.payment_terms, count + 1);
        
        // Guardar a data mais recente para desempate
        if (!termsDates.get(payment.payment_terms) || payment.payment_date > termsDates.get(payment.payment_terms)!) {
          termsDates.set(payment.payment_terms, payment.payment_date);
        }
      }
    });

    // Encontrar prazo mais frequente (em caso de empate, usar o mais recente)
    let preferredTerms = null;
    maxCount = 0;
    mostRecentDate = '';

    for (const [terms, count] of termsCounts) {
      const date = termsDates.get(terms) || '';
      if (count > maxCount || (count === maxCount && date > mostRecentDate)) {
        preferredTerms = terms;
        maxCount = count;
        mostRecentDate = date;
      }
    }

    // Atualizar cliente com as preferências calculadas
    const updateData: any = {};
    if (preferredMethod) updateData.preferred_payment_method = preferredMethod;
    if (preferredTerms) updateData.preferred_payment_terms = preferredTerms;

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString();
      
      const { error: updateError } = await supabase
        .from('crm_customer')
        .update(updateData)
        .eq('tenant_id', tenantId)
        .eq('customer_id', customerId);

      if (updateError) {
        console.error('[CRM] Erro ao atualizar preferências:', updateError);
      } else {
        console.log(`[CRM] Preferências atualizadas para cliente ${customerId}:`, updateData);
      }
    }

  } catch (error) {
    console.error('[CRM] Erro ao atualizar preferências de pagamento:', error);
  }
}

/**
 * Atualiza preferências de pagamento para todos os clientes (backfill)
 * @param tenantId - ID do tenant
 */
export async function backfillAllCustomerPaymentPreferences(tenantId: string) {
  try {
    const supabase = supabaseServer();
    
    console.log(`[CRM] Iniciando backfill de preferências de pagamento para tenant ${tenantId}`);
    
    // Buscar todos os clientes
    const { data: customers, error: customersError } = await supabase
      .from('crm_customer')
      .select('customer_id')
      .eq('tenant_id', tenantId);

    if (customersError) {
      console.error('[CRM] Erro ao buscar clientes:', customersError);
      return;
    }

    if (!customers || customers.length === 0) {
      console.log('[CRM] Nenhum cliente encontrado');
      return;
    }

    console.log(`[CRM] Processando ${customers.length} clientes`);

    // Processar cada cliente
    for (const customer of customers) {
      await updateCustomerPaymentPreferences(tenantId, customer.customer_id);
    }

    console.log('[CRM] Backfill concluído');

  } catch (error) {
    console.error('[CRM] Erro no backfill de preferências:', error);
  }
}


import { supabaseServer } from './supabase/server'
import { getTenantId } from './auth'

/**
 * Obtém tipos de material do customizing
 */
export async function getMaterialTypes() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('mm_category_def')
      .select('category, is_active')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('category')

    if (error) {
      console.error('Error fetching material types:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching material types:', error)
    return []
  }
}

/**
 * Obtém classificações de material do customizing
 */
export async function getMaterialClassifications() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('mm_classification_def')
      .select('classification, is_active')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('classification')

    if (error) {
      console.error('Error fetching material classifications:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching material classifications:', error)
    return []
  }
}

/**
 * Obtém fornecedores ativos
 */
export async function getVendors() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('vendor_name')

    if (error) {
      console.error('Error fetching vendors:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

/**
 * Obtém clientes ativos
 */
export async function getCustomers() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('crm_customer')
      .select('customer_id, name, email, telefone, customer_type, status')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching customers:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}

/**
 * Obtém materiais ativos
 */
export async function getMaterials() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_price_cents, mm_mat_type, mm_mat_class')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('mm_material')

    if (error) {
      console.error('Error fetching materials:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching materials:', error)
    return []
  }
}

/**
 * Obtém depósitos/plantas ativas
 */
export async function getWarehouses() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('wh_warehouse')
      .select('plant_id, name, is_default')
      .eq('tenant_id', tenantId)
      .order('name')

    if (error) {
      console.error('Error fetching warehouses:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return []
  }
}

/**
 * Obtém status de pedidos do customizing
 */
export async function getOrderStatuses() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('sd_order_status_def')
      .select('status, description, is_final, order_index')
      .eq('tenant_id', tenantId)
      .order('order_index')

    if (error) {
      console.error('Error fetching order statuses:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching order statuses:', error)
    return []
  }
}

/**
 * Obtém métodos de pagamento do customizing
 */
export async function getPaymentMethods() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    const { data, error } = await supabase
      .from('fi_payment_terms_def')
      .select('terms_code, description')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('description')

    if (error) {
      console.error('Error fetching payment methods:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return []
  }
}

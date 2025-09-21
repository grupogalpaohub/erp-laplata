import { createSupabaseServerClient } from './supabase/server'
import { getTenantId } from './auth'

export async function getVendors() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  const { data, error } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name')
    .eq('tenant_id', tenantId)
    .order('vendor_name')

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return data || []
}

export async function getMaterials() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  const { data, error } = await supabase
    .from('v_material_overview')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('mm_material')

  if (error) {
    console.error('Error fetching materials:', error)
    return []
  }

  return data || []
}

export async function getCustomers() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  const { data, error } = await supabase
    .from('sd_customer')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }

  return data || []
}

export async function getMaterialTypes() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  const { data, error } = await supabase
    .from('mm_material_type')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('type_name')

  if (error) {
    console.error('Error fetching material types:', error)
    return []
  }

  return data || []
}

export async function getMaterialClassifications() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  const { data, error } = await supabase
    .from('mm_material_classification')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('classification_name')

  if (error) {
    console.error('Error fetching material classifications:', error)
    return []
  }

  return data || []
}

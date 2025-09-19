import { supabaseServer } from '@/src/lib/supabase/server'

export async function getTenantId(): Promise<string> {
  const sb = await supabaseServer()
  const { data } = await sb.auth.getUser()
  const t = (data?.user?.app_metadata as any)?.tenant_id
  return (t && typeof t === 'string') ? t : 'LaplataLunaria'
}

export async function getMaterialTypes() {
  const sb = await supabaseServer()
  const tenant = await getTenantId()
  const { data, error } = await sb
    .from('mm_category_def')
    .select('category')
    .eq('tenant_id', tenant).eq('is_active', true)
    .order('category', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(r => r.category)
}

export async function getMaterialClassifications() {
  const sb = await supabaseServer()
  const tenant = await getTenantId()
  const { data, error } = await sb
    .from('mm_classification_def')
    .select('classification')
    .eq('tenant_id', tenant).eq('is_active', true)
    .order('classification', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(r => r.classification)
}

export async function getMaterials(limit=1000) {
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('mm_material')
    .select('mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, status')
    .order('mm_material', { ascending: true })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getVendors(limit=1000) {
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('mm_vendor')
    .select('vendor_id, vendor_name, name')
    .order('vendor_name', { ascending: true })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data ?? []).map(v => ({
    vendor_id: (v as any).vendor_id,
    vendor_name: (v as any).vendor_name ?? (v as any).name ?? (v as any).vendor_id
  }))
}

export async function getDefaultPlantId() {
  const sb = await supabaseServer()
  const tenant = await getTenantId()
  const { data, error } = await sb
    .from('wh_warehouse')
    .select('plant_id')
    .eq('tenant_id', tenant)
    .eq('is_default', true)
    .single()
  if (error) throw new Error(error.message)
  return data?.plant_id || 'WH-001'
}

export async function getDefaultMaterialStatus() {
  const sb = await supabaseServer()
  const tenant = await getTenantId()
  const { data, error } = await sb
    .from('mm_status_def')
    .select('status')
    .eq('tenant_id', tenant)
    .eq('object_type', 'material')
    .eq('is_final', false)
    .order('order_index')
    .limit(1)
    .single()
  if (error) return 'active'
  return data?.status || 'active'
}

export async function getDefaultPOStatus() {
  const sb = await supabaseServer()
  const tenant = await getTenantId()
  const { data, error } = await sb
    .from('mm_status_def')
    .select('status')
    .eq('tenant_id', tenant)
    .eq('object_type', 'purchase_order')
    .eq('is_final', false)
    .order('order_index')
    .limit(1)
    .single()
  if (error) return 'draft'
  return data?.status || 'draft'
}

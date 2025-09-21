import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { getTenantId } from '@/lib/auth';

export async function getMaterials() {
  const supabase = createSupabaseServerClient();
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('mm_material')
    .select('*')
    .eq('tenant_id', tenantId);
  if (error) throw error;
  return data || [];
}

export async function getVendors() {
  const supabase = createSupabaseServerClient();
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name, is_active')
    .eq('tenant_id', tenantId)
    .eq('is_active', true);
  if (error) throw error;
  return data || [];
}

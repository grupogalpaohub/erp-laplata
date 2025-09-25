import { createClient } from '@supabase/supabase-js';
import { getTenantId } from '@/lib/auth';

export async function getMaterials() {
  // Usar service role key diretamente para bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('mm_material')
    .select('*')
    .eq('tenant_id', tenantId);
  if (error) throw error;
  return data || [];
}

export async function getVendors() {
  // Usar service role key diretamente para bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const tenantId = await getTenantId();
  const { data, error } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name, status')
    .eq('tenant_id', tenantId)
    .eq('status', 'active');
  if (error) throw error;
  return data || [];
}


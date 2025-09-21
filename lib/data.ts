import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function getMaterials() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('materials').select('*');
  if (error) throw error;
  return data || [];
}

export async function getVendors() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) throw error;
  return data || [];
}

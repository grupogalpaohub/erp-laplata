import { supabaseServer } from '@/lib/supabase/server';
export async function fetchCustomers(limit=100) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("crm_customer")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

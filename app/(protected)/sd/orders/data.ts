import { getSupabaseServerClient } from "@/lib/supabase/server";
export async function fetchSalesOrders(limit=100) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sd_sales_order")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

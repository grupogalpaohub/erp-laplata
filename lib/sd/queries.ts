import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SalesOrderRow = {
  so_id?: string | null;
  status?: string | null;
  customer_id?: string | null;
  total_cents?: number | null;
  order_total?: number | null;
  total_value?: number | null;
  created_at?: string | null;
};

export async function fetchSalesOrders(limit = 100): Promise<SalesOrderRow[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sd_sales_order")
    .select("so_id, status, customer_id, total_cents, order_total, total_value, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Detecta se estamos em DEV/localhost no servidor */
export function isDevRuntime(): boolean {
  return process.env.NODE_ENV !== "production";
}

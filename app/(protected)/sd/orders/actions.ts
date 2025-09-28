"use server";
import { supabaseServer } from '@/lib/supabase/server';
import { requireSession } from "@/lib/auth/requireSession";
import { toCents } from "@/lib/money";
import { revalidatePath } from "next/cache";

export async function createSalesOrder(formData: FormData) {
  await requireSession();
  const supabase = supabaseServer();
  const header = {
    customer_id: String(formData.get("customer_id") ?? "").trim(),
    payment_method: String(formData.get("payment_method") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };
  const { data: so, error } = await supabase.from("sd_sales_order").insert(header).select("so_id").single();
  if (error) throw new Error(error.message);

  const raw = formData.getAll("items[]") as string[];
  const items = raw.map(j => JSON.parse(j));
  const rows = items.map((it:any) => ({
    so_id: so.so_id,
    mm_material: it.mm_material,
    quantity: Number(it.quantity||0),
    unit_price_cents_at_order: toCents(it.unit_price),
  }));
  const { error: e2 } = await supabase.from("sd_sales_order_item").insert(rows);
  if (e2) throw new Error(e2.message);

  revalidatePath("/sd/orders");
}

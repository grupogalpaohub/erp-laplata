"use server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/requireSession";
import { toCents } from "@/lib/money";
import { revalidatePath } from "next/cache";

export async function createMaterial(formData: FormData) {
  await requireSession();
  const supabase = getSupabaseServerClient();
  const payload = {
    mm_material: String(formData.get("mm_material") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    mm_price_cents: toCents(formData.get("mm_price")),
    mm_purchase_price_cents: toCents(formData.get("mm_purchase_price")),
  };
  const { error } = await supabase.from("mm_material").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/mm/catalog");
}

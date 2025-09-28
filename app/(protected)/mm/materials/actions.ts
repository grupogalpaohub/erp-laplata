"use server";
import { supabaseServer } from '@/utils/supabase/server';
import { requireSession } from "@/lib/auth/requireSession";
import { toCents } from "@/lib/money";
import { revalidatePath } from "next/cache";

export async function createMaterial(formData: FormData) {
  await requireSession();
  const supabase = supabaseServer();
  const payload = {
    mm_material: String(formData.get("mm_material") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    status: String(formData.get("status") ?? "active"),
    mm_price_cents: toCents(Number(formData.get("mm_price") || 0)),
    mm_purchase_price_cents: toCents(Number(formData.get("mm_purchase_price") || 0)),
  };
  const { error } = await supabase.from("mm_material").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/mm/catalog");
}

"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { toCents } from "@/lib/money";
import { requireSession } from "@/lib/auth/requireSession";

const schema = z.object({
  mm_material: z.string().min(1),
  name: z.string().min(1),
  mm_price: z.string().min(1),
  mm_purchase_price: z.string().optional(),
});

export async function createMaterial(formData: FormData) {
  await requireSession();
  const raw = Object.fromEntries(formData);
  const data = schema.parse(raw);

  const supabase = getSupabaseServerClient();
  const mm_price_cents = toCents(data.mm_price);
  const mm_purchase_price_cents = data.mm_purchase_price ? toCents(data.mm_purchase_price) : null;

  const { error } = await supabase.from("mm_material").insert({
    mm_material: data.mm_material,
    name: data.name,
    mm_price_cents,
    mm_purchase_price_cents,
  });
  if (error) throw error;

  revalidatePath("/mm/catalog");
}

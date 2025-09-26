"use server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/requireSession";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
  await requireSession();
  const supabase = getSupabaseServerClient();
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    document_no: String(formData.get("document_no") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    status: "active",
  };
  const { error } = await supabase.from("crm_customer").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/crm");
}

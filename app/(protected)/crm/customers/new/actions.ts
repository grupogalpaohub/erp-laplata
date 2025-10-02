// app/crm/customers/new/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/requireSession";

type FormState =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export async function createCustomerAction(prev: FormState, formData: FormData): Promise<FormState> {
  try {
    console.log('createCustomerAction called with formData:', Object.fromEntries(formData.entries()))
    
    try {
      await requireSession();
      console.log('requireSession passed')
    } catch (sessionError) {
      console.error('requireSession failed:', sessionError)
      return { ok: false, error: 'Sessão inválida. Faça login novamente.' }
    }

    // Monta payload a partir do form (usando campos corretos da tabela)
    const payload = {
      name: formData.get("name"),
      customer_type: formData.get("customer_type") || "PF",
      contact_email: formData.get("contact_email"),
      document_id: formData.get("document_id"),
      contact_phone: formData.get("contact_phone"),
      phone_country: "BR",
      contact_name: formData.get("name"),
      addr_street: formData.get("address"),
      addr_city: formData.get("city"),
      addr_state: formData.get("state"),
      addr_country: formData.get("country") || "BR",
      addr_zip: formData.get("zip_code"),
      is_active: true,
      status: "active",
      created_date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      // opcionais
      sales_channel: formData.get("sales_channel"),
      customer_category: formData.get("customer_category"),
      notes: formData.get("notes")
    };

    console.log('Payload to send to API:', payload)

    // Chama a API em vez de usar Supabase diretamente
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/crm/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('API response:', result)

    if (!result.ok) {
      return { ok: false, error: result.error?.message || 'Erro ao criar cliente' };
    }

    revalidatePath("/crm/customers");
    return { ok: true, id: String(result.data?.customer_id ?? "") };
  } catch (e: any) {
    console.error('Error in createCustomerAction:', e)
    return { ok: false, error: e?.message ?? "Erro inesperado" };
  }
}

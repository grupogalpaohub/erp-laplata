// app/crm/customers/new/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from "@/lib/auth/requireSession";
import { BASE_COLUMNS, OPTIONAL_COLUMNS, CRM_CUSTOMER_TABLE } from "@/lib/crm/columns";

type FormState =
  | { ok: true; id?: string }
  | { ok: false; error: string };

function pickKnownColumns(
  payload: Record<string, any>,
  allowed: readonly string[]
) {
  const out: Record<string, any> = {};
  console.log('pickKnownColumns - payload:', payload)
  console.log('pickKnownColumns - allowed:', allowed)
  
  for (const k of allowed) {
    if (payload[k] !== undefined && payload[k] !== "") {
      out[k] = payload[k];
      console.log(`pickKnownColumns - added ${k}:`, payload[k])
    }
  }
  
  console.log('pickKnownColumns - result:', out)
  return out;
}

/**
 * Remove progressivamente chaves que o PostgREST apontar como inválidas (erro menciona 'column ...').
 * Isso permite inserir sem travar, mesmo se as colunas opcionais ainda não existirem no DB.
 */
function stripUnknownFromError(payload: Record<string, any>, errMsg: string) {
  // tenta identificar "column \"xxx\" does not exist"
  const m = errMsg.match(/column \"?([a-zA-Z0-9_]+)\"? does not exist/i);
  if (m?.[1]) {
    const key = m[1];
    const clone = { ...payload };
    delete clone[key];
    return clone;
  }
  return payload;
}

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
    
    const supabase = supabaseServer()
    console.log('Supabase client created')

    // Monta payload a partir do form (usando campos corretos da tabela)
    const payloadRaw: Record<string, any> = {
      name: formData.get("name"),
      customer_type: formData.get("customer_type"), // "PF" | "PJ"
      email: formData.get("contact_email"),
      contact_email: formData.get("contact_email"),
      document_id: formData.get("document_id"),
      telefone: formData.get("contact_phone"),
      contact_phone: formData.get("contact_phone"),
      phone_country: "BR",
      contact_name: formData.get("name"),
      addr_street: formData.get("address"),
      addr_city: formData.get("city"),
      addr_state: formData.get("state"),
      addr_country: formData.get("country"),
      addr_zip: formData.get("zip_code"),
      is_active: true,
      status: "active",
      created_date: new Date().toISOString().split('T')[0] // yyyy-mm-dd

      // opcionais (se existirem):
      // sales_channel: formData.get("sales_channel"),
      // preferred_payment_method: formData.get("payment_method_pref"),
      // preferred_payment_terms: formData.get("payment_terms"),
      // customer_category: formData.get("customer_category"),
      // notes: formData.get("notes")
    };

    // 1ª tentativa: base + opcionais (se existirem)
    let candidate = {
      ...pickKnownColumns(payloadRaw, BASE_COLUMNS),
      ...pickKnownColumns(payloadRaw, OPTIONAL_COLUMNS),
    };

    console.log('Payload candidate:', candidate)
    console.log('BASE_COLUMNS:', BASE_COLUMNS)
    console.log('OPTIONAL_COLUMNS:', OPTIONAL_COLUMNS)

    // Verificar se o payload está vazio
    if (Object.keys(candidate).length === 0) {
      console.error('Payload candidate is empty!')
      return { ok: false, error: 'Dados do formulário inválidos' }
    }

    let { data, error } = await supabase
      .from(CRM_CUSTOMER_TABLE)
      .insert(candidate)
      .select("customer_id")
      .single();

    console.log('Supabase insert result:', { data, error })

    // Se acusar coluna inexistente, removemos e tentamos de novo (máximo 3 vezes)
    let tries = 0;
    while (error && tries < 3 && /does not exist/i.test(error.message)) {
      candidate = stripUnknownFromError(candidate, error.message);
      const retry = await supabase
        .from(CRM_CUSTOMER_TABLE)
        .insert(candidate)
        .select("customer_id")
        .single();
      data = retry.data;
      error = retry.error;
      tries++;
    }

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/crm/customers");
    return { ok: true, id: String(data?.customer_id ?? "") };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Erro inesperado" };
  }
}

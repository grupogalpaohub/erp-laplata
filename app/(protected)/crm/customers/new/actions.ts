'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';

const CustomerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  contact_name: z.string().optional().or(z.literal('')),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional().or(z.literal('')),
});

export async function createCustomerAction(formData: FormData) {
  try {
    // ✅ recebe FormData corretamente
    const raw = Object.fromEntries(formData.entries());
    const parsed = CustomerSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, zod: parsed.error.flatten() };
    }
    const c = parsed.data;

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,         // lido do .env.local
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,    // chave anônima (guardrail ok)
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );

    // ✅ Gerar PK texto exigida pelo schema
    const customer_id = `CUST-${Date.now()}`;

    // ⚠️ Use EXATAMENTE os nomes REAIS das colunas do seu schema crm_customer
    const payload = {
      customer_id,
      name: c.name,
      status: 'active',
      created_date: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
      is_active: true,
      email: c.email || null,
      telefone: c.telefone || null,
      contact_name: c.contact_name || null,
      contact_email: c.contact_email || null,
      contact_phone: c.contact_phone || null,
    };

    const { error } = await supabase.from('crm_customer').insert([payload]);
    if (error) {
      // Devolve erro real para a UI exibir
      return { ok: false, error: error.message };
    }

    return { ok: true, customer_id };
  } catch (e: any) {
    return { ok: false, exception: String(e?.message ?? e) };
  }
}

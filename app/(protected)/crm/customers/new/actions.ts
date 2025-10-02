'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';

const CustomerSchema = z.object({
  // Dados básicos
  name: z.string().min(1, 'Nome é obrigatório'),
  customer_type: z.enum(['PF', 'PJ']).default('PF'),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional().or(z.literal('')),
  
  // Documento
  document_id: z.string().optional().or(z.literal('')),
  
  // Endereço
  addr_street: z.string().optional().or(z.literal('')),
  addr_number: z.string().optional().or(z.literal('')),
  addr_complement: z.string().optional().or(z.literal('')),
  addr_district: z.string().optional().or(z.literal('')),
  addr_city: z.string().optional().or(z.literal('')),
  addr_state: z.string().optional().or(z.literal('')),
  addr_zip: z.string().optional().or(z.literal('')),
  addr_country: z.string().optional().or(z.literal('')),
  
  // Dados CRM
  customer_category: z.string().optional().or(z.literal('')),
  lead_classification: z.string().optional().or(z.literal('')),
  sales_channel: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  
  // Status
  is_active: z.string().transform((val) => val === 'true' || val === 'on').optional().default(true),
});

export async function createCustomerAction(formData: FormData) {
  try {
    // ✅ recebe FormData corretamente
    const raw = Object.fromEntries(formData.entries());
    
    // ✅ Processar checkbox is_active (FormData não envia checkbox desmarcado)
    if (raw.is_active === undefined) {
      raw.is_active = 'false';
    }
    
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

    // ✅ Use EXATAMENTE os nomes REAIS das colunas do schema crm_customer
    const payload = {
      customer_id,
      name: c.name,
      customer_type: c.customer_type,
      status: 'active',
      created_date: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
      is_active: c.is_active ?? true,
      
      // Dados de contato
      email: c.email || null,
      telefone: c.telefone || null,
      
      // Documento
      document_id: c.document_id || null,
      
      // Endereço
      addr_street: c.addr_street || null,
      addr_number: c.addr_number || null,
      addr_complement: c.addr_complement || null,
      addr_district: c.addr_district || null,
      addr_city: c.addr_city || null,
      addr_state: c.addr_state || null,
      addr_zip: c.addr_zip || null,
      addr_country: c.addr_country || 'BR',
      
      // Dados CRM
      customer_category: c.customer_category || null,
      lead_classification: c.lead_classification || null,
      sales_channel: c.sales_channel || null,
      notes: c.notes || null,
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

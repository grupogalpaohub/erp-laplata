import { supabaseServer, getTenantFromSession } from '@/utils/supabase/server'
import { success, fail } from '@/utils/http'
import { parsePagination } from '@/utils/pagination'
import { CRM_CustomerSchema, validateNoTenantId } from '@/utils/validation/schemas'
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const { page, pageSize, from, to } = parsePagination(url.searchParams);

    let query = supabase
      .from("crm_customer")
      .select("*", { count: "exact" })
      .eq('tenant_id', tenant_id)
      .order("created_date", { ascending: false });
      
    if (q) {
      query = query.ilike("name", `%${q}%`).or(`contact_email.ilike.%${q}%,customer_id.ilike.%${q}%`);
    }

    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return fail('CUSTOMER_FETCH_FAILED', error.message, 400);
    }

    return success(data ?? [], count ?? 0, page, pageSize);
    
  } catch (error: any) {
    return fail('CUSTOMER_FETCH_ERROR', error.message, 500);
  }
}

export async function POST(req: Request) {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json().catch(() => ({}));

    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    const tenantValidation = validateNoTenantId(body);
    if (!tenantValidation.valid) {
      return fail('TENANT_FORBIDDEN', tenantValidation.error!, 400);
    }

    // VALIDAÇÃO: Schema Zod
    const parse = CRM_CustomerSchema.safeParse(body);
    if (!parse.success) {
      return fail('VALIDATION_ERROR', parse.error.message, 400);
    }

    const customer = {
      tenant_id,
      customer_id: parse.data.customer_id,
      name: parse.data.name,
      email: parse.data.email ?? null,
      telefone: parse.data.telefone ?? null,
      customer_type: parse.data.customer_type ?? "PF",
      status: parse.data.status ?? "active",
      created_date: parse.data.created_date ?? new Date().toISOString().split('T')[0],
      customer_category: parse.data.customer_category ?? null,
      lead_classification: parse.data.lead_classification ?? null,
      sales_channel: parse.data.sales_channel ?? null,
      notes: parse.data.notes ?? null,
      preferred_payment_method: parse.data.preferred_payment_method ?? null,
      preferred_payment_terms: parse.data.preferred_payment_terms ?? null,
      contact_email: parse.data.contact_email ?? parse.data.email ?? null,
      contact_phone: parse.data.contact_phone ?? parse.data.telefone ?? null,
      phone_country: parse.data.phone_country ?? "BR",
      contact_name: parse.data.contact_name ?? null,
      document_id: parse.data.document_id ?? null,
      addr_street: parse.data.addr_street ?? null,
      addr_number: parse.data.addr_number ?? null,
      addr_complement: parse.data.addr_complement ?? null,
      addr_district: parse.data.addr_district ?? null,
      addr_city: parse.data.addr_city ?? null,
      addr_state: parse.data.addr_state ?? null,
      addr_zip: parse.data.addr_zip ?? null,
      addr_country: parse.data.addr_country ?? "BR",
      is_active: parse.data.is_active ?? true,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("crm_customer")
      .insert(customer)
      .select("*")
      .single();
      
    if (error) {
      return fail('CUSTOMER_CREATE_FAILED', error.message, 400);
    }

    return success(data, undefined, undefined, undefined);
    
  } catch (error: any) {
    return fail('CUSTOMER_CREATE_ERROR', error.message, 500);
  }
}

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getTenantFromSession } from '@/lib/auth'

export async function GET() {
  const cookieStore = cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  // Obter tenant_id da sessão
  const { data: { session } } = await sb.auth.getSession()
  const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
  
  const { data, error } = await sb
    .from("mm_material")
    .select("*")
    .eq("tenant_id", tenant_id)
    .order('created_at', { ascending: false })
    .limit(50);
    
  return Response.json({ ok: !error, data: data ?? [], error });
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value } }
  )

  const body = await req.json()

  // GUARDRAIL: Bloquear tenant_id do payload
  if ('tenant_id' in body) {
    return Response.json({
      ok: false,
      error: { code: 'TENANT_FORBIDDEN', message: 'tenant_id não pode vir do payload' }
    }, { status: 400 });
  }

  // GUARDRAIL: Derivar tenant_id da sessão
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return Response.json({
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
    }, { status: 401 });
  }
  
  const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';

  // GUARDRAIL: não aceitar mm_material do payload
  if ('mm_material' in body) {
    return Response.json({
      ok: false,
      error: { code: 'MM_MATERIAL_FORBIDDEN', message: 'mm_material não pode vir do payload' }
    }, { status: 400 });
  }

  // Campos mínimos
  const payload = {
    tenant_id,
    mm_desc: body.mm_desc ?? '',
    commercial_name: body.commercial_name ?? null,
    mm_mat_type: body.mm_mat_type ?? null,
    mm_mat_class: body.mm_mat_class ?? null,
    mm_purchase_price_cents: body.mm_purchase_price_cents ?? null,
    mm_price_cents: body.mm_price_cents ?? null,
    mm_vendor_id: body.mm_vendor_id ?? null,
    unit_of_measure: body.unit_of_measure ?? 'unidade',
    barcode: body.barcode ?? null,
    weight_grams: body.weight_grams ?? null,
    status: body.status ?? "active",
    mm_pur_link: body.mm_pur_link ?? null,
    dimensions: body.dimensions ?? null,
    purity: body.purity ?? null,
    color: body.color ?? null,
    finish: body.finish ?? null,
    min_stock: body.min_stock ?? 0,
    max_stock: body.max_stock ?? 1000,
    lead_time_days: body.lead_time_days ?? 7,
    price_last_updated_at: new Date().toISOString(),
    mm_comercial: body.mm_comercial ?? null
  }

  const { data, error } = await supabase
    .from('mm_material')
    .insert([payload])
    .select('tenant_id, mm_material, mm_desc, commercial_name')
    .single()

  if (error) {
    return Response.json({ ok:false, error: { code:'MM_CREATE_FAILED', message: error.message }}, { status: 400 })
  }

  return Response.json({ ok:true, data })
}
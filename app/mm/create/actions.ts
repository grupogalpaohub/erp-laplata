'use server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function toIntOrNull(v: FormDataEntryValue | null) {
  if (v === null) return null
  const s = String(v).trim()
  if (s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

export async function createMaterial(prevState: { ok: boolean; error?: string }, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const payload = {
    tenant_id: process.env.TENANT_ID || 'default',
    mm_material: String(formData.get('mm_material') ?? '').trim(),
    mm_comercial: (formData.get('mm_comercial') as string | null) ?? null,
    mm_desc: String(formData.get('mm_desc') ?? '').trim(),
    mm_mat_type: (formData.get('mm_mat_type') as string | null) ?? null,
    mm_mat_class: (formData.get('mm_mat_class') as string | null) ?? null,
    mm_price_cents: toIntOrNull(formData.get('mm_price_cents')),
    commercial_name: (formData.get('commercial_name') as string | null) ?? null,
    lead_time_days: toIntOrNull(formData.get('lead_time_days')),
    mm_vendor_id: (formData.get('mm_vendor_id') as string | null) ?? null,
    status: (formData.get('status') as string | null) ?? 'active',
  }

  // valida mínimos obrigatórios — sem alterar schema, só validação de UI
  if (!payload.mm_material) return { ok: false, error: 'mm_material (SKU) é obrigatório.' }
  if (!payload.mm_desc)     return { ok: false, error: 'mm_desc (Descrição) é obrigatório.' }

  const { error } = await supabase.from('mm_material').insert([payload])
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}

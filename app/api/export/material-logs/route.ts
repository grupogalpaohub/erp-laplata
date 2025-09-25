export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { formatBRL } from '@/lib/money'

export async function GET() {
  const supabase = getSupabaseServerClient()
  const [{ data: price }, { data: change }] = await Promise.all([
    supabase.from('mm_price_log').select('mm_material, old_price, new_price, changed_at, changed_by').order('changed_at', { ascending: false }),
    supabase.from('mm_change_log').select('record_id, field_name, old_value, new_value, changed_at, changed_by').order('changed_at', { ascending: false })
  ])

  const lines: string[] = []
  lines.push('tipo,material,campo,old_value,new_value,changed_at,changed_by')
  for (const r of (price ?? [])) {
    lines.push([
      'price',
      csv(r.mm_material),
      '',
        csv(formatBRL(Number(r.old_price||0))),
        csv(formatBRL(Number(r.new_price||0))),
      csv(new Date(r.changed_at).toISOString()),
      csv(r.changed_by ?? '')
    ].join(','))
  }
  for (const r of (change ?? [])) {
    lines.push([
      'field',
      csv(r.record_id),
      csv(r.field_name),
      csv(r.old_value ?? ''),
      csv(r.new_value ?? ''),
      csv(new Date(r.changed_at).toISOString()),
      csv(r.changed_by ?? '')
    ].join(','))
  }

  const body = lines.join('\n')
  return new NextResponse(body, {
    headers: {
      'content-type': 'text/csv; charset=UTF-8',
      'content-disposition': `attachment; filename="material_logs.csv"`
    }
  })
}

function csv(v: any) {
  const s = String(v ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}


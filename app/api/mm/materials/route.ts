export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from('mm_material')
      .select(`
        mm_material,
        mm_comercial,
        mm_desc,
        mm_mat_type,
        mm_mat_class,
        mm_price_cents,
        commercial_name,
        lead_time_days,
        mm_vendor_id,
        status
      `)
      .eq('tenant_id', 'LaplataLunaria')
      .order('mm_material', { ascending: true })

    if (error) {
      console.error('Erro ao buscar materiais:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar materiais' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Erro na API de materiais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

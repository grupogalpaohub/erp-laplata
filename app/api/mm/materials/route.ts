import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('mm_material')
      .select(`
        mm_material, 
        mm_comercial, 
        mm_desc, 
        mm_mat_type, 
        mm_mat_class, 
        mm_price_cents, 
        purchase_price_cents,
        catalog_url,
        commercial_name, 
        lead_time_days, 
        mm_vendor_id, 
        status
      `)
      .eq('tenant_id', tenantId)
      .order('mm_material')

    if (error) {
      console.error('Error fetching materials:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
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
        mm_purchase_price_cents,
        commercial_name, 
        lead_time_days, 
        mm_vendor_id, 
        status,
        mm_pur_link,
        min_stock,
        max_stock
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
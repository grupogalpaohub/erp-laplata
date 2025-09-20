import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'

export async function GET() {
  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()
    
    console.log('Public test materials - tenantId:', tenantId)
    
    const { data: materials, error } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, purchase_price_cents, sale_price_cents, mm_vendor_id')
      .eq('tenant_id', tenantId)
      .order('mm_material')
      .limit(10)

    if (error) {
      console.error('Error fetching materials:', error)
      return NextResponse.json({ 
        ok: false, 
        error: error.message,
        tenantId,
        materials: []
      })
    }

    return NextResponse.json({
      ok: true,
      tenantId,
      materialsCount: materials?.length || 0,
      materials: materials || [],
      sample: materials?.slice(0, 3) || []
    })
  } catch (e: any) {
    console.error('Public test materials error:', e)
    return NextResponse.json({ 
      ok: false, 
      error: String(e.message || e),
      tenantId: 'error',
      materials: []
    }, { status: 500 })
  }
}

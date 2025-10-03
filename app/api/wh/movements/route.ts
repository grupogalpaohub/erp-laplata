import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const plant_id = searchParams.get('plant_id')
    const mm_material = searchParams.get('mm_material')
    const movement_type = searchParams.get('movement_type')
    const reference_type = searchParams.get('reference_type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('wh_inventory_ledger')
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification),
        wh_warehouse:plant_id(plant_name, address)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('ledger_id', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (plant_id) {
      query = query.eq('plant_id', plant_id)
    }
    if (mm_material) {
      query = query.eq('mm_material', mm_material)
    }
    if (movement_type) {
      query = query.eq('movement_type', movement_type)
    }
    if (reference_type) {
      query = query.eq('reference_type', reference_type)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching inventory movements:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      data: data || [], 
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/wh/movements:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

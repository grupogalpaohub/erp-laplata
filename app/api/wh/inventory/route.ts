import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { UpdateInventoryBalanceSchema } from '@/lib/schemas/wh'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const plant_id = searchParams.get('plant_id')
    const mm_material = searchParams.get('mm_material')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('wh_inventory_balance')
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification),
        wh_warehouse:plant_id(plant_name, address)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('mm_material', { ascending: true })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (plant_id) {
      query = query.eq('plant_id', plant_id)
    }
    if (mm_material) {
      query = query.eq('mm_material', mm_material)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching inventory balance:', error)
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
    console.error('Unhandled error in GET /api/wh/inventory:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = UpdateInventoryBalanceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: validation.error.issues[0].message 
        } 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('wh_inventory_balance')
      .update(validation.data)
      .eq('tenant_id', tenantId)
      .eq('plant_id', validation.data.plant_id)
      .eq('mm_material', validation.data.mm_material)
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification),
        wh_warehouse:plant_id(plant_name, address)
      `)
      .single()

    if (error) {
      console.error('Error updating inventory balance:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in PUT /api/wh/inventory:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
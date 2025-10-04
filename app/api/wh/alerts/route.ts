import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreateLowStockAlertSchema, UpdateLowStockAlertSchema } from '@/lib/schemas/wh'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const plant_id = searchParams.get('plant_id')
    const status = searchParams.get('status') || 'active'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('wh_low_stock_alert')
      .select(`
        *,
        mm_material:mm_material(mm_desc, mm_mat_class, mm_mat_type),
        wh_warehouse:plant_id(name, address)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('status', status)
      .order('alert_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (plant_id) {
      query = query.eq('plant_id', plant_id)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching low stock alerts:', error)
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
    console.error('Unhandled error in GET /api/wh/alerts:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = CreateLowStockAlertSchema.safeParse(body)
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
      .from('wh_low_stock_alert')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        alert_id: crypto.randomUUID(),
        alert_date: new Date().toISOString()
      })
      .select(`
        *,
        mm_material:mm_material(mm_desc, mm_mat_class, mm_mat_type),
        wh_warehouse:plant_id(name, address)
      `)
      .single()

    if (error) {
      console.error('Error creating low stock alert:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/wh/alerts:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreateSalesOrderItemSchema } from '@/lib/schemas/sd'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const so_id = searchParams.get('so_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('sd_sales_order_item')
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification, unit_price_cents)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('row_no', { ascending: true })
      .range(offset, offset + limit - 1)

    // Filtrar por pedido se especificado
    if (so_id) {
      query = query.eq('so_id', so_id)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching sales order items:', error)
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
    console.error('Unhandled error in GET /api/sd/sales-order-items:', error)
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

    const validation = CreateSalesOrderItemSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: validation.error.issues[0].message 
        } 
      }, { status: 400 })
    }

    // Calcular o próximo row_no para o pedido
    const { data: maxItem, error: maxError } = await supabase
      .from('sd_sales_order_item')
      .select('row_no')
      .eq('so_id', validation.data.so_id)
      .eq('tenant_id', tenantId)
      .order('row_no', { ascending: false })
      .limit(1)

    if (maxError) {
      console.error('Error getting max row_no:', maxError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: maxError.code, message: maxError.message } 
      }, { status: 500 })
    }

    const nextRowNo = (maxItem?.[0]?.row_no || 0) + 1

    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        row_no: nextRowNo
      })
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification, unit_price_cents)
      `)
      .single()

    if (error) {
      console.error('Error creating sales order item:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/sd/sales-order-items:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
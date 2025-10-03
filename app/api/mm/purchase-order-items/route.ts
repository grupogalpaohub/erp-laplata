import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreatePurchaseOrderItemSchema } from '@/lib/schemas/mm'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const mm_order = searchParams.get('mm_order')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('mm_purchase_order_item')
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification, unit_price_cents)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('po_item_id', { ascending: true })
      .range(offset, offset + limit - 1)

    // Filtrar por pedido se especificado
    if (mm_order) {
      query = query.eq('mm_order', mm_order)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching purchase order items:', error)
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
    console.error('Unhandled error in GET /api/mm/purchase-order-items:', error)
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

    const validation = CreatePurchaseOrderItemSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: validation.error.issues[0].message 
        } 
      }, { status: 400 })
    }

    // Calcular o próximo po_item_id para o pedido
    const { data: maxItem, error: maxError } = await supabase
      .from('mm_purchase_order_item')
      .select('po_item_id')
      .eq('mm_order', validation.data.mm_order)
      .eq('tenant_id', tenantId)
      .order('po_item_id', { ascending: false })
      .limit(1)

    if (maxError) {
      console.error('Error getting max po_item_id:', maxError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: maxError.code, message: maxError.message } 
      }, { status: 500 })
    }

    const nextItemId = (maxItem?.[0]?.po_item_id || 0) + 1

    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        po_item_id: nextItemId
      })
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification, unit_price_cents)
      `)
      .single()

    if (error) {
      console.error('Error creating purchase order item:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/mm/purchase-order-items:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
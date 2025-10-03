import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreatePurchaseOrderSchema } from '@/lib/schemas/mm'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const vendor_id = searchParams.get('vendor_id') || ''

    const offset = (page - 1) * limit

    let query = supabase
      .from('mm_purchase_order')
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('order_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }
    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching purchase orders:', error)
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
    console.error('Unhandled error in GET /api/mm/purchase-orders:', error)
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

    const validation = CreatePurchaseOrderSchema.safeParse(body)
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
      .from('mm_purchase_order')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        mm_order: crypto.randomUUID()
      })
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone)
      `)
      .single()

    if (error) {
      console.error('Error creating purchase order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/mm/purchase-orders:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
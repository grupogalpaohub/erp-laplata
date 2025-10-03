import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreateSalesOrderSchema } from '@/lib/schemas/sd'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const customer_id = searchParams.get('customer_id') || ''

    const offset = (page - 1) * limit

    let query = supabase
      .from('sd_sales_order')
      .select(`
        *,
        crm_customer:customer_id(customer_name, email, phone)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('order_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }
    if (customer_id) {
      query = query.eq('customer_id', customer_id)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching sales orders:', error)
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
    console.error('Unhandled error in GET /api/sd/sales-orders:', error)
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

    const validation = CreateSalesOrderSchema.safeParse(body)
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
      .from('sd_sales_order')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        so_id: crypto.randomUUID()
      })
      .select(`
        *,
        crm_customer:customer_id(customer_name, email, phone)
      `)
      .single()

    if (error) {
      console.error('Error creating sales order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/sd/sales-orders:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreateCustomerSchema } from '@/lib/schemas/sd'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const customer_type = searchParams.get('customer_type') || ''

    const offset = (page - 1) * limit

    let query = supabase
      .from('crm_customer')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('customer_name', { ascending: true })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (customer_type) {
      query = query.eq('customer_type', customer_type)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching customers:', error)
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
    console.error('Unhandled error in GET /api/sd/customers:', error)
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

    const validation = CreateCustomerSchema.safeParse(body)
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
      .from('crm_customer')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        customer_id: crypto.randomUUID()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/sd/customers:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

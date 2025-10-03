import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreateReceivingSchema } from '@/lib/schemas/mm'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const mm_order = searchParams.get('mm_order')
    const mm_material = searchParams.get('mm_material')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('mm_receiving')
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification),
        mm_purchase_order:mm_order(vendor_id, order_date, status)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('received_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (mm_order) {
      query = query.eq('mm_order', mm_order)
    }
    if (mm_material) {
      query = query.eq('mm_material', mm_material)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching receivings:', error)
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
    console.error('Unhandled error in GET /api/mm/receivings:', error)
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

    const validation = CreateReceivingSchema.safeParse(body)
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
      .from('mm_receiving')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        recv_id: crypto.randomUUID(),
        received_at: new Date().toISOString()
      })
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification),
        mm_purchase_order:mm_order(vendor_id, order_date, status)
      `)
      .single()

    if (error) {
      console.error('Error creating receiving:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/mm/receivings:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { CreateMaterialSchema, UpdateMaterialSchema } from '@/lib/schemas/mm'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const vendor_id = searchParams.get('vendor_id') || ''

    const offset = (page - 1) * limit

    let query = supabase
      .from('mm_material')
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone)
      `)
      .eq('tenant_id', tenantId)
      .order('material_name', { ascending: true })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (search) {
      query = query.or(`material_name.ilike.%${search}%,category.ilike.%${search}%,classification.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching materials:', error)
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
    console.error('Unhandled error in GET /api/mm/materials:', error)
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

    const validation = CreateMaterialSchema.safeParse(body)
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
      .from('mm_material')
      .insert({ 
        ...validation.data, 
        tenant_id: tenantId,
        mm_material: crypto.randomUUID()
      })
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone)
      `)
      .single()

    if (error) {
      console.error('Error creating material:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in POST /api/mm/materials:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
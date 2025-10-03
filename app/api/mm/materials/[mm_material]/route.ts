import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { UpdateMaterialSchema } from '@/lib/schemas/mm'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { mm_material: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { data, error } = await supabase
      .from('mm_material')
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone)
      `)
      .eq('mm_material', params.mm_material)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Material não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error fetching material:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/mm/materials/[mm_material]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { mm_material: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = UpdateMaterialSchema.safeParse(body)
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
      .update(validation.data)
      .eq('mm_material', params.mm_material)
      .eq('tenant_id', tenantId)
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Material não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error updating material:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in PUT /api/mm/materials/[mm_material]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { mm_material: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { error } = await supabase
      .from('mm_material')
      .delete()
      .eq('mm_material', params.mm_material)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error deleting material:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('Unhandled error in DELETE /api/mm/materials/[mm_material]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
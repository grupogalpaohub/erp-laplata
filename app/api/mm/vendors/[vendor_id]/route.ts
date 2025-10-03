import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { UpdateVendorSchema } from '@/lib/schemas/mm'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { vendor_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { data, error } = await supabase
      .from('mm_vendor')
      .select('*')
      .eq('vendor_id', params.vendor_id)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Fornecedor não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error fetching vendor:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/mm/vendors/[vendor_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { vendor_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = UpdateVendorSchema.safeParse(body)
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
      .from('mm_vendor')
      .update(validation.data)
      .eq('vendor_id', params.vendor_id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Fornecedor não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error updating vendor:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in PUT /api/mm/vendors/[vendor_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { vendor_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { error } = await supabase
      .from('mm_vendor')
      .delete()
      .eq('vendor_id', params.vendor_id)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error deleting vendor:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('Unhandled error in DELETE /api/mm/vendors/[vendor_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
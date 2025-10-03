import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { UpdateCustomerSchema } from '@/lib/schemas/sd'

export async function GET(
  request: Request,
  { params }: { params: { customer_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { data, error } = await supabase
      .from('crm_customer')
      .select('*')
      .eq('customer_id', params.customer_id)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Cliente não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error fetching customer:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/sd/customers/[customer_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { customer_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = UpdateCustomerSchema.safeParse(body)
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
      .update(validation.data)
      .eq('customer_id', params.customer_id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Cliente não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error updating customer:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in PUT /api/sd/customers/[customer_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { customer_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { error } = await supabase
      .from('crm_customer')
      .delete()
      .eq('customer_id', params.customer_id)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error deleting customer:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('Unhandled error in DELETE /api/sd/customers/[customer_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

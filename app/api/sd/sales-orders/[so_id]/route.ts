import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { UpdateSalesOrderSchema } from '@/lib/schemas/sd'

export async function GET(
  request: Request,
  { params }: { params: { so_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { data, error } = await supabase
      .from('sd_sales_order')
      .select(`
        *,
        crm_customer:customer_id(customer_name, email, phone),
        items:sd_sales_order_item(
          row_no,
          mm_material,
          quantity,
          unit_price_cents,
          total_cents,
          mm_material:mm_material(material_name, category, classification)
        )
      `)
      .eq('so_id', params.so_id)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Pedido de venda não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error fetching sales order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/sd/sales-orders/[so_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { so_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = UpdateSalesOrderSchema.safeParse(body)
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
      .update(validation.data)
      .eq('so_id', params.so_id)
      .eq('tenant_id', tenantId)
      .select(`
        *,
        crm_customer:customer_id(customer_name, email, phone)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Pedido de venda não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error updating sales order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in PUT /api/sd/sales-orders/[so_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { so_id: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    // Primeiro deletar os itens do pedido
    const { error: itemsError } = await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('so_id', params.so_id)
      .eq('tenant_id', tenantId)

    if (itemsError) {
      console.error('Error deleting sales order items:', itemsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: itemsError.code, message: itemsError.message } 
      }, { status: 500 })
    }

    // Depois deletar o pedido
    const { error } = await supabase
      .from('sd_sales_order')
      .delete()
      .eq('so_id', params.so_id)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error deleting sales order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('Unhandled error in DELETE /api/sd/sales-orders/[so_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

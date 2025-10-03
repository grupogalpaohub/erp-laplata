import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { UpdatePurchaseOrderSchema } from '@/lib/schemas/mm'

export async function GET(
  request: Request,
  { params }: { params: { mm_order: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    const { data, error } = await supabase
      .from('mm_purchase_order')
      .select(`
        *,
        mm_vendor:vendor_id(vendor_name, email, phone),
        items:mm_purchase_order_item(
          po_item_id,
          mm_material,
          quantity,
          unit_price_cents,
          line_total_cents,
          plant_id,
          currency,
          notes,
          mm_material:mm_material(material_name, category, classification)
        )
      `)
      .eq('mm_order', params.mm_order)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          ok: false, 
          error: { code: 'NOT_FOUND', message: 'Pedido de compra não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error fetching purchase order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/mm/purchase-orders/[mm_order]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { mm_order: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const body = await request.json()

    const validation = UpdatePurchaseOrderSchema.safeParse(body)
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
      .update(validation.data)
      .eq('mm_order', params.mm_order)
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
          error: { code: 'NOT_FOUND', message: 'Pedido de compra não encontrado' } 
        }, { status: 404 })
      }
      console.error('Error updating purchase order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('Unhandled error in PUT /api/mm/purchase-orders/[mm_order]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { mm_order: string } }
) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()

    // Primeiro deletar os itens do pedido
    const { error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', params.mm_order)
      .eq('tenant_id', tenantId)

    if (itemsError) {
      console.error('Error deleting purchase order items:', itemsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: itemsError.code, message: itemsError.message } 
      }, { status: 500 })
    }

    // Depois deletar o pedido
    const { error } = await supabase
      .from('mm_purchase_order')
      .delete()
      .eq('mm_order', params.mm_order)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error deleting purchase order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('Unhandled error in DELETE /api/mm/purchase-orders/[mm_order]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
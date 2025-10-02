import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

type Params = { so_id: string }

export async function GET(_req: Request, { params }: { params: Params }) {
  const soId = params?.so_id ?? ''
  if (!soId) {
    return NextResponse.json({ ok: false, error: { message: 'missing so_id' } }, { status: 400 })
  }

  try {
    const supabase = supabaseServer()

    // Buscar itens do pedido de vendas
    const { data: items, error } = await supabase
      .from('sd_sales_order_item')
      .select(`
        so_id,
        sku,
        quantity,
        unit_price_cents,
        line_total_cents,
        row_no,
        mm_material
      `)
      .eq('so_id', soId)
      .order('row_no', { ascending: true })

    if (error) {
      console.error('Error fetching sales order items:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: error.code, 
          message: error.message 
        } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      items: items ?? [] 
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in GET /api/sd/orders/[so_id]/items:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Params }) {
  const soId = params?.so_id ?? ''
  if (!soId) {
    return NextResponse.json({ ok: false, error: { message: 'missing so_id' } }, { status: 400 })
  }

  try {
    const supabase = supabaseServer()
    const body = await req.json()

    // Validar campos obrigatórios
    if (!body.sku) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_SKU', 
          message: 'sku é obrigatório' 
        } 
      }, { status: 400 })
    }

    if (!body.mm_material) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_MATERIAL', 
          message: 'mm_material é obrigatório' 
        } 
      }, { status: 400 })
    }

    if (!body.quantity || body.quantity <= 0) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'INVALID_QUANTITY', 
          message: 'quantity deve ser maior que zero' 
        } 
      }, { status: 400 })
    }

    // Buscar próximo row_no
    const { data: lastItem } = await supabase
      .from('sd_sales_order_item')
      .select('row_no')
      .eq('so_id', soId)
      .order('row_no', { ascending: false })
      .limit(1)

    const row_no = (lastItem?.[0]?.row_no || 0) + 1

    // Calcular line_total_cents
    const line_total_cents = body.quantity * (body.unit_price_cents || 0)

    // Inserir item
    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .insert({
        so_id: soId,
        sku: body.sku,
        mm_material: body.mm_material,
        material_id: body.mm_material, // material_id deve ser igual a mm_material
        quantity: Number(body.quantity),
        unit_price_cents: body.unit_price_cents || 0,
        line_total_cents,
        row_no
      })
      .select(`
        so_id,
        sku,
        quantity,
        unit_price_cents,
        line_total_cents,
        row_no,
        mm_material
      `)
      .single()

    if (error) {
      console.error('Error creating sales order item:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: error.code, 
          message: error.message 
        } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      item: data 
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error in POST /api/sd/orders/[so_id]/items:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const soId = params?.so_id ?? ''
  if (!soId) {
    return NextResponse.json({ ok: false, error: { message: 'missing so_id' } }, { status: 400 })
  }

  try {
    const supabase = supabaseServer()
    const { searchParams } = new URL(req.url)
    const row_no = searchParams.get('row_no')

    if (!row_no) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_ROW_NO', 
          message: 'row_no é obrigatório' 
        } 
      }, { status: 400 })
    }

    // Deletar item específico
    const { error } = await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('so_id', soId)
      .eq('row_no', Number(row_no))

    if (error) {
      console.error('Error deleting sales order item:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: error.code, 
          message: error.message 
        } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      data: { deleted: true }
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in DELETE /api/sd/orders/[so_id]/items:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { po_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .select(`
        po_item_id,
        mm_material,
        mm_qtt,
        unit_cost_cents,
        line_total_cents,
        notes,
        mm_material_data:mm_material(mm_comercial, mm_desc)
      `)
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)
      .order('po_item_id')

    if (error) {
      console.error('Error fetching purchase order items:', error)
      return NextResponse.json({ error: 'Erro ao buscar itens' }, { status: 500 })
    }

    // Transformar os dados para a interface esperada
    const items = (data || []).map((item: any) => ({
      po_item_id: item.po_item_id,
      mm_material: item.mm_material,
      mm_qtt: item.mm_qtt,
      unit_cost_cents: item.unit_cost_cents,
      line_total_cents: item.line_total_cents,
      notes: item.notes,
      mm_comercial: item.mm_material_data?.mm_comercial || null,
      mm_desc: item.mm_material_data?.mm_desc || null
    }))

    return NextResponse.json(items)

  } catch (error) {
    console.error('Error fetching purchase order items:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { po_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const { items } = body

    // Deletar itens existentes
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)

    // Inserir novos itens
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        tenant_id: tenantId,
        mm_order: params.po_id,
        plant_id: 'WH-001',
        mm_material: item.mm_material,
        mm_qtt: item.mm_qtt,
        unit_cost_cents: item.unit_cost_cents,
        line_total_cents: item.line_total_cents,
        currency: 'BRL',
        notes: item.notes
      }))

      const { error } = await supabase
        .from('mm_purchase_order_item')
        .insert(orderItems)

      if (error) {
        console.error('Error updating purchase order items:', error)
        return NextResponse.json({ error: 'Erro ao atualizar itens' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating purchase order items:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

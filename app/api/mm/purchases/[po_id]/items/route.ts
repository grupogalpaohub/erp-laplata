import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    console.log('=== NOVA API - BUSCAR ITENS ===')
    console.log('PO ID:', params.po_id)
    console.log('Tenant ID:', tenantId)

    // Query simples e direta
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Erro ao buscar itens:', error)
      return NextResponse.json({ error: 'Erro ao buscar itens' }, { status: 500 })
    }

    console.log('Itens encontrados:', data?.length || 0)
    console.log('Dados:', data)

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Erro interno:', error)
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

    console.log('=== NOVA API - ATUALIZAR ITENS ===')
    console.log('PO ID:', params.po_id)
    console.log('Tenant ID:', tenantId)

    const body = await request.json()
    const { items } = body

    console.log('Itens recebidos:', items?.length || 0)

    // 1. Deletar itens existentes
    const { error: deleteError } = await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)

    if (deleteError) {
      console.error('Erro ao deletar itens:', deleteError)
      return NextResponse.json({ error: 'Erro ao deletar itens' }, { status: 500 })
    }

    console.log('Itens deletados com sucesso')

    // 2. Inserir novos itens
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

      console.log('Itens para inserir:', orderItems)

      const { data: insertedItems, error: insertError } = await supabase
        .from('mm_purchase_order_item')
        .insert(orderItems)
        .select('*')

      if (insertError) {
        console.error('Erro ao inserir itens:', insertError)
        return NextResponse.json({ error: 'Erro ao inserir itens' }, { status: 500 })
      }

      console.log('Itens inseridos:', insertedItems?.length || 0)
    }

    revalidatePath('/mm/purchases')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

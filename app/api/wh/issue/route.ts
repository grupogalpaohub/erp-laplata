import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { material_id, quantity, reference_type, reference_id, reason = 'SO_SHIPMENT' } = body

    // Validar dados obrigatórios
    if (!material_id || !quantity || !reference_type || !reference_id) {
      return NextResponse.json(
        { error: 'Material, quantidade, tipo de referência e ID são obrigatórios' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantidade deve ser positiva' },
        { status: 400 }
      )
    }

    // Verificar estoque disponível
    const { data: stock, error: stockError } = await supabase
      .from('v_wh_stock')
      .select('available_qty, on_hand_qty, reserved_qty')
      .eq('tenant_id', tenantId)
      .eq('mm_material', material_id)
      .single()

    if (stockError || !stock) {
      return NextResponse.json(
        { error: 'Material não encontrado no estoque' },
        { status: 404 }
      )
    }

    if (stock.available_qty < quantity) {
      return NextResponse.json(
        { 
          error: 'Estoque disponível insuficiente',
          available: stock.available_qty,
          requested: quantity
        },
        { status: 400 }
      )
    }

    // Buscar custo do material para o ledger
    const { data: material, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_price_cents')
      .eq('tenant_id', tenantId)
      .eq('mm_material', material_id)
      .single()

    const unitCost = material?.mm_price_cents || 0

    // Executar baixa via função do banco
    const { data: result, error: issueError } = await supabase
      .rpc('wh_apply_balance_delta', {
        p_tenant_id: tenantId,
        p_plant_id: 'PLANT_001', // TODO: tornar configurável
        p_material: material_id,
        p_on_hand_delta: -quantity, // Reduz estoque
        p_reserved_delta: -quantity, // Reduz reserva
        p_unit_cost_cents: unitCost,
        p_reason: reason,
        p_ref_table: reference_type,
        p_ref_id: reference_id
      })

    if (issueError) {
      console.error('Error issuing inventory:', issueError)
      return NextResponse.json(
        { error: 'Erro ao dar baixa no estoque' },
        { status: 500 }
      )
    }

    // Se for expedição de venda, integrar com FI
    if (reason === 'SO_SHIPMENT') {
      try {
        await supabase.rpc('fi_post_sales_shipment', {
          p_tenant: tenantId,
          p_order: reference_id,
          p_cogs_cents: quantity * unitCost,
          p_revenue_cents: quantity * unitCost // TODO: usar preço de venda real
        })
      } catch (fiError) {
        console.warn('FI integration failed:', fiError)
        // Não falha a operação por causa do FI
      }
    }

    return NextResponse.json({
      success: true,
      movement_id: result,
      message: `${quantity} unidades dadas baixa com sucesso`
    })

  } catch (error) {
    console.error('Error in inventory issue:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


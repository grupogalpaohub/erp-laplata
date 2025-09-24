import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { 
      material_id, 
      quantity, 
      from_plant, 
      to_plant, 
      reference_type, 
      reference_id, 
      reason = 'TRANSFER' 
    } = body

    // Validar dados obrigatórios
    if (!material_id || !quantity || !from_plant || !to_plant || !reference_type || !reference_id) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantidade deve ser positiva' },
        { status: 400 }
      )
    }

    if (from_plant === to_plant) {
      return NextResponse.json(
        { error: 'Planta de origem e destino devem ser diferentes' },
        { status: 400 }
      )
    }

    // Verificar estoque na planta de origem
    const { data: fromStock, error: fromStockError } = await supabase
      .from('v_wh_stock')
      .select('available_qty')
      .eq('tenant_id', tenantId)
      .eq('mm_material', material_id)
      .eq('plant_id', from_plant)
      .single()

    if (fromStockError || !fromStock) {
      return NextResponse.json(
        { error: 'Material não encontrado na planta de origem' },
        { status: 404 }
      )
    }

    if (fromStock.available_qty < quantity) {
      return NextResponse.json(
        { 
          error: 'Estoque insuficiente na planta de origem',
          available: fromStock.available_qty,
          requested: quantity
        },
        { status: 400 }
      )
    }

    // Buscar custo do material
    const { data: material, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_price_cents')
      .eq('tenant_id', tenantId)
      .eq('mm_material', material_id)
      .single()

    const unitCost = material?.mm_price_cents || 0

    // Executar transferência: saída da origem
    const { data: outResult, error: outError } = await supabase
      .rpc('wh_apply_balance_delta', {
        p_tenant_id: tenantId,
        p_plant_id: from_plant,
        p_material: material_id,
        p_on_hand_delta: -quantity,
        p_reserved_delta: 0,
        p_unit_cost_cents: unitCost,
        p_reason: 'TRANSFER_OUT',
        p_ref_table: reference_type,
        p_ref_id: reference_id
      })

    if (outError) {
      console.error('Error transferring out:', outError)
      return NextResponse.json(
        { error: 'Erro ao transferir da planta de origem' },
        { status: 500 }
      )
    }

    // Executar transferência: entrada no destino
    const { data: inResult, error: inError } = await supabase
      .rpc('wh_apply_balance_delta', {
        p_tenant_id: tenantId,
        p_plant_id: to_plant,
        p_material: material_id,
        p_on_hand_delta: quantity,
        p_reserved_delta: 0,
        p_unit_cost_cents: unitCost,
        p_reason: 'TRANSFER_IN',
        p_ref_table: reference_type,
        p_ref_id: reference_id
      })

    if (inError) {
      console.error('Error transferring in:', inError)
      // Tentar reverter a saída
      await supabase.rpc('wh_apply_balance_delta', {
        p_tenant_id: tenantId,
        p_plant_id: from_plant,
        p_material: material_id,
        p_on_hand_delta: quantity,
        p_reserved_delta: 0,
        p_unit_cost_cents: unitCost,
        p_reason: 'TRANSFER_REVERSAL',
        p_ref_table: reference_type,
        p_ref_id: reference_id
      })
      
      return NextResponse.json(
        { error: 'Erro ao transferir para planta de destino' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      out_movement_id: outResult,
      in_movement_id: inResult,
      message: `${quantity} unidades transferidas de ${from_plant} para ${to_plant}`
    })

  } catch (error) {
    console.error('Error in inventory transfer:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

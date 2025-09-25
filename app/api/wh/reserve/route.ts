import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { material_id, quantity, reference_type, reference_id, reason = 'SO_RESERVE' } = body

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
      .select('available_qty')
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
          error: 'Estoque insuficiente',
          available: stock.available_qty,
          requested: quantity
        },
        { status: 400 }
      )
    }

    // Executar reserva via função do banco
    const { data: result, error: reserveError } = await supabase
      .rpc('wh_apply_balance_delta', {
        p_tenant_id: tenantId,
        p_plant_id: 'PLANT_001', // TODO: tornar configurável
        p_material: material_id,
        p_on_hand_delta: 0,
        p_reserved_delta: quantity,
        p_unit_cost_cents: 0, // Reserva não afeta custo
        p_reason: reason,
        p_ref_table: reference_type,
        p_ref_id: reference_id
      })

    if (reserveError) {
      console.error('Error reserving inventory:', reserveError)
      return NextResponse.json(
        { error: 'Erro ao reservar estoque' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      movement_id: result,
      message: `${quantity} unidades reservadas com sucesso`
    })

  } catch (error) {
    console.error('Error in inventory reserve:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


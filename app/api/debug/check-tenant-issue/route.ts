import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar se há algum problema com o tenant_id
    const { data: tenantData, error: tenantError } = await supabase
      .from('mm_purchase_order_item')
      .select('tenant_id')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(1)

    if (tenantError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao verificar tenant_id',
        details: tenantError.message
      })
    }

    // Verificar se há algum problema com o material
    const { data: materialData, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material')
      .eq('mm_material', 'B_175')
      .limit(1)

    if (materialError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao verificar material',
        details: materialError.message
      })
    }

    // Verificar se há algum problema com o pedido
    const { data: orderData, error: orderError } = await supabase
      .from('mm_purchase_order')
      .select('mm_order')
      .eq('mm_order', 'PO-2025-001')
      .limit(1)

    if (orderError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao verificar pedido',
        details: orderError.message
      })
    }

    return NextResponse.json({
      success: true,
      tenantData: tenantData,
      materialData: materialData,
      orderData: orderData
    })

  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

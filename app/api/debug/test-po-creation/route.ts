import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const tenantId = 'LaplataLunaria'

    // Dados de teste
    const testItem = {
      tenant_id: tenantId,
      mm_order: 'PO-TEST-001',
      plant_id: 'WH-001',
      mm_material: 'B_175',
      mm_qtt: 1,
      unit_cost_cents: 1000,
      line_total_cents: 1000,
      currency: 'BRL'
    }

    console.log('Tentando inserir item de teste:', testItem)

    // Tentar inserir item de teste
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert(testItem)
      .select()

    if (error) {
      console.error('Erro ao inserir item:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        testItem
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-001')

    return NextResponse.json({
      success: true,
      message: 'Item inserido com sucesso',
      data
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

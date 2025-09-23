import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Teste 1: Inserir apenas campos obrigatórios
    const simpleItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-003',
      mm_material: 'B_175',
      mm_qtt: 1
    }

    console.log('Teste 1 - Inserção simples:', simpleItem)

    const { data: data1, error: error1 } = await supabase
      .from('mm_purchase_order_item')
      .insert(simpleItem)
      .select()

    if (error1) {
      return NextResponse.json({
        success: false,
        test: 'simple',
        error: error1.message,
        code: error1.code,
        details: error1.details,
        hint: error1.hint
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-003')

    // Teste 2: Inserir com todos os campos
    const fullItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-004',
      plant_id: 'WH-001',
      mm_material: 'B_175',
      mm_qtt: 1,
      unit_cost_cents: 1000,
      line_total_cents: 1000,
      currency: 'BRL'
    }

    console.log('Teste 2 - Inserção completa:', fullItem)

    const { data: data2, error: error2 } = await supabase
      .from('mm_purchase_order_item')
      .insert(fullItem)
      .select()

    if (error2) {
      return NextResponse.json({
        success: false,
        test: 'full',
        error: error2.message,
        code: error2.code,
        details: error2.details,
        hint: error2.hint
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-004')

    return NextResponse.json({
      success: true,
      message: 'Ambos os testes passaram',
      simpleTest: data1,
      fullTest: data2
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

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Teste 1: Inserir com campos exatos como estão no banco
    const exactItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-007',
      mm_material: 'B_175',
      mm_qtt: 1,
      unit_cost_cents: 1000,
      line_total_cents: 1000,
      currency: 'BRL'
    }

    console.log('Teste 1 - Campos exatos:', exactItem)

    const { data: data1, error: error1 } = await supabase
      .from('mm_purchase_order_item')
      .insert(exactItem)
      .select()

    if (error1) {
      return NextResponse.json({
        success: false,
        test: 'exact_fields',
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
      .eq('mm_order', 'PO-TEST-007')

    // Teste 2: Verificar se há algum problema com o nome do campo
    const { data: sampleData, error: sampleError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .limit(1)

    if (sampleError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar dados de exemplo',
        details: sampleError.message
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Inserção com campos exatos funcionou',
      data: data1,
      sampleData: sampleData
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

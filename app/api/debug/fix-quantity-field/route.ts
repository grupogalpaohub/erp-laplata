import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Tentar inserir com um campo quantity adicional para ver se resolve
    const itemWithQuantity = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-009',
      mm_material: 'B_175',
      mm_qtt: 1,
      quantity: 1, // Adicionar campo quantity
      unit_cost_cents: 1000,
      line_total_cents: 1000,
      currency: 'BRL'
    }

    console.log('Tentando inserir com campo quantity:', itemWithQuantity)

    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert(itemWithQuantity)
      .select()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir com campo quantity',
        details: error.message,
        code: error.code,
        hint: error.hint
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-009')

    return NextResponse.json({
      success: true,
      message: 'Inserção com campo quantity funcionou',
      data: data
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

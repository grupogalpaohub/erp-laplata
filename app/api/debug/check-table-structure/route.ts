import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Tentar inserir um item simples para ver o erro exato
    const testItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-002',
      plant_id: 'WH-001',
      mm_material: 'B_175',
      mm_qtt: 1,
      unit_cost_cents: 1000,
      line_total_cents: 1000,
      currency: 'BRL'
    }

    console.log('Tentando inserir:', testItem)

    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert(testItem)
      .select()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        testItem
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-002')

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

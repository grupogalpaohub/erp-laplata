import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Tentar inserir com material válido
    const validItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-006',
      mm_material: 'B_175', // Material existente
      mm_qtt: 1,
      unit_cost_cents: 1000,
      line_total_cents: 1000
    }

    console.log('Tentando inserir com material válido:', validItem)

    const { data: validData, error: validError } = await supabase
      .from('mm_purchase_order_item')
      .insert(validItem)
      .select()

    if (validError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir com material válido',
        details: validError.message,
        code: validError.code,
        hint: validError.hint
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-006')

    return NextResponse.json({
      success: true,
      message: 'Inserção com material válido funcionou',
      data: validData
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

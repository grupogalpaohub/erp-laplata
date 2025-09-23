import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar se conseguimos fazer uma consulta simples
    const { data: simpleQuery, error: simpleError } = await supabase
      .from('mm_purchase_order_item')
      .select('tenant_id, mm_order, mm_material')
      .limit(1)

    if (simpleError) {
      return NextResponse.json({
        success: false,
        error: 'Erro na consulta simples',
        details: simpleError.message
      })
    }

    // Verificar se conseguimos fazer uma inserção simples
    const { data: simpleInsert, error: simpleInsertError } = await supabase
      .from('mm_purchase_order_item')
      .insert({
        tenant_id: 'LaplataLunaria',
        mm_order: 'PO-TEST-008',
        mm_material: 'B_175',
        mm_qtt: 1
      })
      .select()

    if (simpleInsertError) {
      return NextResponse.json({
        success: false,
        error: 'Erro na inserção simples',
        details: simpleInsertError.message,
        code: simpleInsertError.code,
        hint: simpleInsertError.hint
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-008')

    return NextResponse.json({
      success: true,
      message: 'Cliente Supabase funcionando',
      simpleQuery: simpleQuery,
      simpleInsert: simpleInsert
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

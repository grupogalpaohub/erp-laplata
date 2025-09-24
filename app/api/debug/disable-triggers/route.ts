import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Desabilitar todos os triggers da tabela temporariamente
    const { data: disableResult, error: disableError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE mm_purchase_order_item DISABLE TRIGGER ALL;
      `
    })

    if (disableError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao desabilitar triggers',
        details: disableError.message
      })
    }

    // Tentar inserir item simples
    const simpleItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-TEST-005',
      mm_material: 'B_175',
      mm_qtt: 1
    }

    const { data: insertData, error: insertError } = await supabase
      .from('mm_purchase_order_item')
      .insert(simpleItem)
      .select()

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir mesmo com triggers desabilitados',
        details: insertError.message,
        code: insertError.code
      })
    }

    // Limpar dados de teste
    await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', 'PO-TEST-005')

    // Reabilitar triggers
    const { error: enableError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE mm_purchase_order_item ENABLE TRIGGER ALL;
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Inserção funcionou com triggers desabilitados',
      data: insertData,
      enableError: enableError?.message
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

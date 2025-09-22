import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Desabilitar triggers que podem estar causando problemas
    const disableTriggers = `
      -- Desabilitar triggers da tabela sd_sales_order
      ALTER TABLE sd_sales_order DISABLE TRIGGER ALL;
      ALTER TABLE sd_sales_order_item DISABLE TRIGGER ALL;
    `
    
    // Executar via inserção direta
    const { error: triggerError } = await supabase
      .from('_sql')
      .insert({ query: disableTriggers })
    
    if (triggerError) {
      console.error('Trigger disable error:', triggerError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao desabilitar triggers',
        details: triggerError
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Triggers desabilitados com sucesso'
    })
    
  } catch (error) {
    console.error('Error disabling triggers:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}

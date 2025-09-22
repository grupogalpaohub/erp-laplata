import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Remover trigger que está causando problema
    const removeTrigger = `
      DROP TRIGGER IF EXISTS trg_so_assign_doc_no ON sd_sales_order;
      DROP FUNCTION IF EXISTS so_assign_doc_no();
    `
    
    // Executar via query direta
    const { data, error } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', removeTrigger)
    
    if (error) {
      console.error('Trigger removal error:', error)
      return NextResponse.json({
        success: false,
        error: 'Erro ao remover trigger',
        details: error
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Trigger removido com sucesso'
    })
    
  } catch (error) {
    console.error('Error removing trigger:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}

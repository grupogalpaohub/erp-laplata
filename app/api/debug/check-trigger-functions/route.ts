import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar se há algum trigger que está causando o problema
    const { data: triggerInfo, error: triggerError } = await supabase
      .from('pg_trigger')
      .select('tgname, tgrelid, tgfoid')
      .eq('tgrelid', 'mm_purchase_order_item')

    return NextResponse.json({
      success: true,
      triggerInfo: triggerInfo || [],
      errors: {
        triggerError: triggerError?.message
      }
    })

  } catch (error) {
    console.error('Erro ao verificar funções:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

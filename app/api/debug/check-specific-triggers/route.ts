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
    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('tgname, tgrelid, tgfoid, tgtype')
      .eq('tgrelid', 'mm_purchase_order_item')

    // Verificar se há algum constraint que está causando o problema
    const { data: constraints, error: constraintsError } = await supabase
      .from('pg_constraint')
      .select('conname, contype, conrelid, confrelid')
      .eq('conrelid', 'mm_purchase_order_item')

    // Verificar se há algum índice que está causando o problema
    const { data: indexes, error: indexesError } = await supabase
      .from('pg_index')
      .select('indexrelid, indrelid, indkey')
      .eq('indrelid', 'mm_purchase_order_item')

    return NextResponse.json({
      success: true,
      triggers: triggers || [],
      constraints: constraints || [],
      indexes: indexes || [],
      errors: {
        triggersError: triggersError?.message,
        constraintsError: constraintsError?.message,
        indexesError: indexesError?.message
      }
    })

  } catch (error) {
    console.error('Erro ao verificar triggers:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

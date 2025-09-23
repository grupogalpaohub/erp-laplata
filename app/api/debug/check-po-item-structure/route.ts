import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar estrutura da tabela mm_purchase_order_item
    const { data: columns, error: columnsError } = await supabase.rpc('exec', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'mm_purchase_order_item' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    })

    // Verificar se existe algum dado na tabela
    const { data: sampleData, error: dataError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      columns: columns || [],
      sampleData: sampleData || [],
      errors: {
        columnsError: columnsError?.message,
        dataError: dataError?.message
      }
    })

  } catch (error) {
    console.error('Erro ao verificar estrutura:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    // Verificar estrutura da tabela
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'mm_purchase_order_item' })

    if (columnsError) {
      // Fallback: query direta
      const { data: directQuery, error: directError } = await supabase
        .from('mm_purchase_order_item')
        .select('*')
        .limit(0)

      return NextResponse.json({
        success: false,
        columnsError: columnsError.message,
        directError: directError?.message,
        directData: directQuery
      })
    }

    return NextResponse.json({
      success: true,
      columns
    })

  } catch (error) {
    console.error('Error in check:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

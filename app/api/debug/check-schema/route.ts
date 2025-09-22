import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar estrutura da tabela mm_material
    const { data: materialColumns, error: materialError } = await supabase
      .from('mm_material')
      .select('*')
      .limit(1)
    
    // Verificar estrutura da tabela mm_purchase_order_item
    const { data: poItemColumns, error: poItemError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .limit(1)
    
    // Verificar se tabela customizing existe
    const { data: customizingData, error: customizingError } = await supabase
      .from('customizing')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      mm_material: {
        exists: !materialError,
        columns: materialColumns && materialColumns.length > 0 ? Object.keys(materialColumns[0]) : [],
        error: materialError?.message
      },
      mm_purchase_order_item: {
        exists: !poItemError,
        columns: poItemColumns && poItemColumns.length > 0 ? Object.keys(poItemColumns[0]) : [],
        error: poItemError?.message
      },
      customizing: {
        exists: !customizingError,
        columns: customizingData && customizingData.length > 0 ? Object.keys(customizingData[0]) : [],
        error: customizingError?.message
      }
    })

  } catch (error) {
    console.error('Erro na API de verificação de schema:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

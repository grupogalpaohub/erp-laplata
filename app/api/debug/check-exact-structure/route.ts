import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar estrutura exata da tabela
    const { data: tableInfo, error: tableError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .limit(0)

    // Verificar se conseguimos inserir um registro vazio
    const { data: emptyInsert, error: emptyError } = await supabase
      .from('mm_purchase_order_item')
      .insert({})
      .select()

    // Verificar se há algum problema com o tenant_id
    const { data: tenantCheck, error: tenantError } = await supabase
      .from('mm_purchase_order_item')
      .select('tenant_id')
      .limit(1)

    return NextResponse.json({
      success: true,
      tableInfo: tableInfo || [],
      emptyInsert: emptyInsert || [],
      tenantCheck: tenantCheck || [],
      errors: {
        tableError: tableError?.message,
        emptyError: emptyError?.message,
        tenantError: tenantError?.message
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

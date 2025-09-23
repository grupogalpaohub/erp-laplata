import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar se RLS está habilitado na tabela
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('exec', {
      sql: `
        SELECT schemaname, tablename, rowsecurity, hasrls
        FROM pg_tables 
        WHERE tablename = 'mm_purchase_order_item';
      `
    })

    // Verificar políticas RLS
    const { data: policies, error: policiesError } = await supabase.rpc('exec', {
      sql: `
        SELECT policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies 
        WHERE tablename = 'mm_purchase_order_item';
      `
    })

    // Verificar se há algum problema com tenant_id
    const { data: sampleData, error: sampleError } = await supabase
      .from('mm_purchase_order_item')
      .select('tenant_id, mm_order, mm_material')
      .limit(1)

    return NextResponse.json({
      success: true,
      rlsStatus: rlsStatus || [],
      policies: policies || [],
      sampleData: sampleData || [],
      errors: {
        rlsError: rlsError?.message,
        policiesError: policiesError?.message,
        sampleError: sampleError?.message
      }
    })

  } catch (error) {
    console.error('Erro ao verificar RLS:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
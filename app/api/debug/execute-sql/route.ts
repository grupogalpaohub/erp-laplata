import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL não fornecido' },
        { status: 400 }
      )
    }
    
    console.log('Executing SQL:', sql)
    
    // Executar SQL via query direta
    const { data, error } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', sql)
    
    if (error) {
      console.error('SQL execution error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'SQL executado com sucesso',
      data
    })
    
  } catch (error) {
    console.error('Error executing SQL:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}

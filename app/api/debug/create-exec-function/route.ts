import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Criar função exec para executar SQL
    const createExecFunction = `
      CREATE OR REPLACE FUNCTION exec(sql text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN 'OK';
      EXCEPTION
        WHEN OTHERS THEN
          RETURN 'ERROR: ' || SQLERRM;
      END;
      $$;
    `
    
    // Executar via query direta
    const { error } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', createExecFunction)
    
    if (error) {
      console.error('Error creating exec function:', error)
      return NextResponse.json(
        { error: 'Erro ao criar função exec' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Função exec criada com sucesso'
    })
    
  } catch (error) {
    console.error('Error creating exec function:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


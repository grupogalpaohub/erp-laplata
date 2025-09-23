import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar se o trigger existe
    const { data: triggerExists, error: triggerError } = await supabase.rpc('exec', {
      sql: `
        SELECT EXISTS (
          SELECT 1 FROM pg_trigger 
          WHERE tgname = 'trg_so_assign_doc_no' 
          AND tgrelid = 'sd_sales_order'::regclass
        );
      `
    })

    // Verificar se a função existe
    const { data: functionExists, error: functionError } = await supabase.rpc('exec', {
      sql: `
        SELECT EXISTS (
          SELECT 1 FROM pg_proc 
          WHERE proname = 'so_assign_doc_no'
        );
      `
    })

    // Verificar se a tabela doc_numbering existe
    const { data: tableExists, error: tableError } = await supabase.rpc('exec', {
      sql: `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'doc_numbering'
        );
      `
    })

    return NextResponse.json({
      success: true,
      triggerExists: triggerExists || [],
      functionExists: functionExists || [],
      tableExists: tableExists || [],
      errors: {
        triggerError: triggerError?.message,
        functionError: functionError?.message,
        tableError: tableError?.message
      }
    })

  } catch (error) {
    console.error('Erro ao verificar trigger:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

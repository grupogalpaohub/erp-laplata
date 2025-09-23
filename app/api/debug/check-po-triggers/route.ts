import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar triggers na tabela mm_purchase_order_item
    const { data: triggers, error: triggersError } = await supabase.rpc('exec', {
      sql: `
        SELECT tgname, pg_get_triggerdef(oid) as definition
        FROM pg_trigger 
        WHERE tgrelid = 'mm_purchase_order_item'::regclass
        AND NOT tgisinternal;
      `
    })

    // Verificar constraints
    const { data: constraints, error: constraintsError } = await supabase.rpc('exec', {
      sql: `
        SELECT conname, contype, pg_get_constraintdef(oid) as definition
        FROM pg_constraint 
        WHERE conrelid = 'mm_purchase_order_item'::regclass;
      `
    })

    // Verificar se a tabela existe
    const { data: tableExists, error: tableError } = await supabase.rpc('exec', {
      sql: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'mm_purchase_order_item'
        );
      `
    })

    return NextResponse.json({
      success: true,
      triggers: triggers || [],
      constraints: constraints || [],
      tableExists: tableExists || [],
      errors: {
        triggersError: triggersError?.message,
        constraintsError: constraintsError?.message,
        tableError: tableError?.message
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

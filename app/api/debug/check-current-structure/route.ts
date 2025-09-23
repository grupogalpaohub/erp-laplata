import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Verificar estrutura da tabela sd_sales_order
    const { data: salesOrderColumns, error: soError } = await supabase.rpc('exec', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'sd_sales_order' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    })

    // 2. Verificar estrutura da tabela sd_sales_order_item
    const { data: salesOrderItemColumns, error: soiError } = await supabase.rpc('exec', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'sd_sales_order_item' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    })

    // 3. Verificar constraints da tabela sd_sales_order_item
    const { data: constraints, error: constraintsError } = await supabase.rpc('exec', {
      sql: `
        SELECT conname, contype, pg_get_constraintdef(oid) as definition
        FROM pg_constraint 
        WHERE conrelid = 'sd_sales_order_item'::regclass
        AND contype = 'p';
      `
    })

    // 4. Verificar se existem dados de teste
    const { data: testOrders, error: testError } = await supabase
      .from('sd_sales_order')
      .select('*')
      .limit(1)

    // 5. Verificar triggers existentes
    const { data: triggers, error: triggersError } = await supabase.rpc('exec', {
      sql: `
        SELECT tgname, pg_get_triggerdef(oid) as definition
        FROM pg_trigger 
        WHERE tgrelid = 'sd_sales_order'::regclass
        AND NOT tgisinternal;
      `
    })

    return NextResponse.json({
      success: true,
      salesOrderColumns: salesOrderColumns || [],
      salesOrderItemColumns: salesOrderItemColumns || [],
      constraints: constraints || [],
      testOrders: testOrders || [],
      triggers: triggers || [],
      errors: {
        soError: soError?.message,
        soiError: soiError?.message,
        constraintsError: constraintsError?.message,
        testError: testError?.message,
        triggersError: triggersError?.message
      }
    })

  } catch (error) {
    console.error('Erro ao verificar estrutura:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

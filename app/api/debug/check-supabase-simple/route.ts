import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    console.log('🔍 VERIFICAÇÃO SIMPLES DO SUPABASE...')
    
    // 1. Verificar tabelas existentes
    const { data: tables, error: tablesError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT table_name
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `
      })
    
    if (tablesError) {
      console.error('❌ Erro ao listar tabelas:', tablesError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao listar tabelas',
        details: tablesError.message
      }, { status: 500 })
    }
    
    // 2. Verificar estrutura das tabelas principais
    const mainTables = ['mm_vendor', 'mm_material', 'crm_customer', 'sd_sales_order', 'doc_numbering']
    const tableStructures = {}
    
    for (const tableName of mainTables) {
      try {
        const { data: columns, error: columnsError } = await supabase
          .rpc('exec', {
            sql: `
              SELECT column_name, data_type, is_nullable
              FROM information_schema.columns 
              WHERE table_name = '${tableName}' 
              AND table_schema = 'public'
              ORDER BY ordinal_position;
            `
          })
        
        if (!columnsError && columns) {
          tableStructures[tableName] = columns
        }
      } catch (err) {
        console.log(`⚠️ Erro ao verificar ${tableName}:`, err)
        tableStructures[tableName] = { error: err instanceof Error ? err.message : 'Erro desconhecido' }
      }
    }
    
    // 3. Verificar dados de exemplo
    const sampleData = {}
    try {
      const { data: vendors } = await supabase.from('mm_vendor').select('*').limit(2)
      const { data: materials } = await supabase.from('mm_material').select('*').limit(2)
      const { data: customers } = await supabase.from('crm_customer').select('*').limit(2)
      const { data: orders } = await supabase.from('sd_sales_order').select('*').limit(2)
      
      sampleData.mm_vendor = vendors || []
      sampleData.mm_material = materials || []
      sampleData.crm_customer = customers || []
      sampleData.sd_sales_order = orders || []
    } catch (err) {
      console.log('⚠️ Erro ao buscar dados de exemplo:', err)
    }
    
    // 4. Verificar triggers
    const { data: triggers, error: triggersError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT tgrelid::regclass AS table_name, tgname AS trigger_name
          FROM pg_trigger
          WHERE NOT tgisinternal
          AND tgrelid IN (
            SELECT oid FROM pg_class 
            WHERE relnamespace = 'public'::regnamespace
            AND relkind = 'r'
          )
          ORDER BY tgrelid::regclass::text;
        `
      })
    
    // 5. Verificar funções
    const { data: functions, error: functionsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT proname AS function_name
          FROM pg_proc
          WHERE pronamespace = 'public'::regnamespace
          AND prokind = 'f'
          ORDER BY proname;
        `
      })
    
    console.log('✅ Verificação simples finalizada!')
    
    return NextResponse.json({
      success: true,
      investigation: {
        tables: tables || [],
        tableStructures,
        sampleData,
        triggers: triggers || [],
        functions: functions || []
      },
      errors: {
        tablesError: tablesError?.message,
        triggersError: triggersError?.message,
        functionsError: functionsError?.message
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro na verificação simples:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

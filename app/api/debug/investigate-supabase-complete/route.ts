import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    console.log('🔍 INVESTIGAÇÃO COMPLETA DO SUPABASE...')
    
    // 1. Verificar todas as tabelas existentes
    const { data: tables, error: tablesError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT table_name, table_type
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
    
    // 2. Verificar colunas de cada tabela principal
    const mainTables = [
      'mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item',
      'crm_customer', 'sd_sales_order', 'sd_sales_order_item',
      'wh_warehouse', 'wh_inventory_balance',
      'fi_account', 'fi_invoice', 'fi_payment', 'fi_transaction',
      'co_cost_center', 'co_kpi_definition', 'co_kpi_snapshot',
      'doc_numbering', 'audit_log', 'tenant', 'user_profile'
    ]
    
    const tableStructures = {}
    
    for (const tableName of mainTables) {
      const { data: columns, error: columnsError } = await supabase
        .rpc('exec', {
          sql: `
            SELECT 
              column_name, 
              data_type, 
              is_nullable, 
              column_default,
              character_maximum_length,
              numeric_precision,
              numeric_scale
            FROM information_schema.columns 
            WHERE table_name = '${tableName}' 
            AND table_schema = 'public'
            ORDER BY ordinal_position;
          `
        })
      
      if (!columnsError && columns) {
        tableStructures[tableName] = columns
      }
    }
    
    // 3. Verificar constraints (PK, FK, UK)
    const { data: constraints, error: constraintsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT 
            conrelid::regclass AS table_name,
            contype,
            conname,
            pg_get_constraintdef(oid) AS definition
          FROM pg_constraint
          WHERE connamespace = 'public'::regnamespace
          ORDER BY conrelid::regclass::text, contype, conname;
        `
      })
    
    // 4. Verificar índices
    const { data: indexes, error: indexesError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT 
            tab.relname AS table_name,
            idx.relname AS index_name,
            pg_get_indexdef(i.oid) AS indexdef,
            i.indisunique AS is_unique
          FROM pg_index i
          JOIN pg_class idx ON idx.oid = i.indexrelid
          JOIN pg_class tab ON tab.oid = i.indrelid
          JOIN pg_namespace n ON n.oid = tab.relnamespace
          WHERE n.nspname = 'public'
          ORDER BY tab.relname, idx.relname;
        `
      })
    
    // 5. Verificar triggers
    const { data: triggers, error: triggersError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT 
            tgrelid::regclass AS table_name,
            tgname AS trigger_name,
            pg_get_triggerdef(oid) AS definition
          FROM pg_trigger
          WHERE NOT tgisinternal
          AND tgrelid IN (
            SELECT oid FROM pg_class 
            WHERE relnamespace = 'public'::regnamespace
            AND relkind = 'r'
          )
          ORDER BY tgrelid::regclass::text, tgname;
        `
      })
    
    // 6. Verificar funções
    const { data: functions, error: functionsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT 
            proname AS function_name,
            pg_get_function_identity_arguments(oid) AS arguments,
            pg_get_functiondef(oid) AS definition
          FROM pg_proc
          WHERE pronamespace = 'public'::regnamespace
          AND prokind = 'f'
          ORDER BY proname;
        `
      })
    
    // 7. Verificar enums
    const { data: enums, error: enumsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT 
            t.typname AS enum_name,
            e.enumlabel AS label,
            e.enumsortorder AS sort_order
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE n.nspname = 'public'
          ORDER BY t.typname, e.enumsortorder;
        `
      })
    
    // 8. Verificar políticas RLS
    const { data: rlsPolicies, error: rlsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
          FROM pg_policies
          WHERE schemaname = 'public'
          ORDER BY tablename, policyname;
        `
      })
    
    // 9. Verificar dados de exemplo em tabelas principais
    const sampleData = {}
    const sampleTables = ['mm_vendor', 'mm_material', 'crm_customer', 'sd_sales_order']
    
    for (const tableName of sampleTables) {
      const { data: sample, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3)
      
      if (!sampleError && sample) {
        sampleData[tableName] = sample
      }
    }
    
    // 10. Verificar configurações do tenant
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenant')
      .select('*')
      .limit(5)
    
    const { data: docNumberingData, error: docNumberingError } = await supabase
      .from('doc_numbering')
      .select('*')
      .limit(10)
    
    console.log('✅ Investigação completa finalizada!')
    
    return NextResponse.json({
      success: true,
      investigation: {
        tables: tables || [],
        tableStructures,
        constraints: constraints || [],
        indexes: indexes || [],
        triggers: triggers || [],
        functions: functions || [],
        enums: enums || [],
        rlsPolicies: rlsPolicies || [],
        sampleData,
        tenantData: tenantData || [],
        docNumberingData: docNumberingData || []
      },
      errors: {
        tablesError: tablesError?.message,
        constraintsError: constraintsError?.message,
        indexesError: indexesError?.message,
        triggersError: triggersError?.message,
        functionsError: functionsError?.message,
        enumsError: enumsError?.message,
        rlsError: rlsError?.message,
        tenantError: tenantError?.message,
        docNumberingError: docNumberingError?.message
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro na investigação completa:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

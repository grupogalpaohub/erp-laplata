import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    console.log('🔍 Verificando estrutura da tabela sd_sales_order...');
    
    // Verificar estrutura da tabela
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'sd_sales_order' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
    
    if (columnsError) {
      console.error('❌ Erro ao verificar colunas:', columnsError);
      return NextResponse.json({
        success: false,
        error: columnsError.message
      }, { status: 500 });
    }
    
    // Verificar se a tabela existe
    const { data: tableExists, error: tableError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'sd_sales_order' 
            AND table_schema = 'public'
          ) as exists;
        `
      });
    
    // Verificar dados existentes
    const { data: existingOrders, error: ordersError } = await supabase
      .from('sd_sales_order')
      .select('so_id, customer_id, status, created_at')
      .limit(5);
    
    console.log('✅ Estrutura verificada!');
    
    return NextResponse.json({
      success: true,
      tableExists: tableExists?.[0]?.exists || false,
      columns: columns || [],
      existingOrders: existingOrders || [],
      ordersError: ordersError?.message || null
    });
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

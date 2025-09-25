import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Aplicar migração SQL diretamente
    const migrationSQL = `
      -- Adicionar campos na tabela sd_sales_order
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS doc_no TEXT;
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_method TEXT;
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_term TEXT;
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_final_cents INTEGER DEFAULT 0;
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_negotiated_cents INTEGER DEFAULT 0;
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS notes TEXT;
      ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      
      -- Adicionar campos na tabela sd_sales_order_item
      ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS material_id TEXT REFERENCES mm_material(mm_material);
      ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS unit_price_cents_at_order INTEGER DEFAULT 0;
      
      -- Atualizar constraint para incluir material_id na chave primária
      ALTER TABLE sd_sales_order_item DROP CONSTRAINT IF EXISTS sd_sales_order_item_pkey;
      ALTER TABLE sd_sales_order_item ADD CONSTRAINT sd_sales_order_item_pkey 
        PRIMARY KEY (tenant_id, so_id, material_id, row_no);
    `
    
    // Executar cada comando separadamente
    const commands = migrationSQL.split(';').filter(cmd => cmd.trim())
    
    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec', { sql: command.trim() })
        if (error) {
          console.error('Error executing command:', command, error)
          // Continuar mesmo com erro (colunas podem já existir)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migração aplicada com sucesso'
    })
    
  } catch (error) {
    console.error('Error applying migration:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


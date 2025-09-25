import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Aplicar migração para adicionar campos na sd_sales_order
    const { error: alterError } = await supabase.rpc('exec', {
      sql: `
        -- Adicionar campos necessários para o módulo SD
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS doc_no TEXT;
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_method TEXT;
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_term TEXT;
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_final_cents INTEGER DEFAULT 0;
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_negotiated_cents INTEGER DEFAULT 0;
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS notes TEXT;
        ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

        -- Adicionar campos necessários para itens do pedido
        ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS material_id TEXT REFERENCES mm_material(mm_material);
        ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS unit_price_cents_at_order INTEGER DEFAULT 0;

        -- Atualizar constraint para incluir material_id na chave primária
        ALTER TABLE sd_sales_order_item DROP CONSTRAINT IF EXISTS sd_sales_order_item_pkey;
        ALTER TABLE sd_sales_order_item ADD CONSTRAINT sd_sales_order_item_pkey 
          PRIMARY KEY (tenant_id, so_id, material_id, row_no);
      `
    })

    if (alterError) {
      console.error('Erro ao aplicar migração:', alterError)
      return NextResponse.json({ 
        success: false, 
        error: alterError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Migração aplicada com sucesso' 
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}


import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = createSupabaseServerClient()
    
    // Aplicar migração para adicionar campos necessários
    const migrationSQL = `
      -- Adicionar campo de preço de compra
      ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS purchase_price_cents INTEGER DEFAULT 0;
      
      -- Adicionar campo de link do catálogo online
      ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS catalog_url TEXT;
      
      -- Adicionar campo de lead time em dias
      ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 0;
      
      -- Adicionar campo de status (se não existir)
      ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
      
      -- Adicionar campo de data de atualização
      ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      
      -- Corrigir campo de quantidade na tabela de itens de pedido
      ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS quantity NUMERIC DEFAULT 0;
      
      -- Atualizar dados existentes para usar o campo correto
      UPDATE mm_purchase_order_item SET quantity = mm_qtt WHERE quantity = 0 AND mm_qtt > 0;
      
      -- Adicionar campo de data de atualização
      ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
      
      -- Criar tabela de customizing se não existir
      CREATE TABLE IF NOT EXISTS customizing (
        tenant_id TEXT NOT NULL,
        category TEXT NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (tenant_id, category, value)
      );
      
      -- Inserir dados de customizing para tipos de material
      INSERT INTO customizing (tenant_id, category, value, description) VALUES
        ('LaplataLunaria', 'material_type', 'Brinco', 'Brinco de ouro ou prata'),
        ('LaplataLunaria', 'material_type', 'Cordão', 'Cordão de ouro ou prata'),
        ('LaplataLunaria', 'material_type', 'Choker', 'Choker de ouro ou prata'),
        ('LaplataLunaria', 'material_type', 'Gargantilha', 'Gargantilha de ouro ou prata'),
        ('LaplataLunaria', 'material_type', 'Anel', 'Anel de ouro ou prata'),
        ('LaplataLunaria', 'material_type', 'Pulseira', 'Pulseira de ouro ou prata')
      ON CONFLICT (tenant_id, category, value) DO NOTHING;
      
      -- Inserir dados de customizing para classificações de material
      INSERT INTO customizing (tenant_id, category, value, description) VALUES
        ('LaplataLunaria', 'material_classification', 'Elementar', 'Classificação elementar'),
        ('LaplataLunaria', 'material_classification', 'Amuleto', 'Classificação amuleto'),
        ('LaplataLunaria', 'material_classification', 'Protetor', 'Classificação protetor'),
        ('LaplataLunaria', 'material_classification', 'Decoração', 'Classificação decoração')
      ON CONFLICT (tenant_id, category, value) DO NOTHING;
      
      -- Inserir dados de customizing para termos de pagamento
      INSERT INTO customizing (tenant_id, category, value, description) VALUES
        ('LaplataLunaria', 'payment_terms', 'PIX', 'Pagamento via PIX'),
        ('LaplataLunaria', 'payment_terms', 'Transferência', 'Transferência bancária'),
        ('LaplataLunaria', 'payment_terms', 'Boleto', 'Boleto bancário'),
        ('LaplataLunaria', 'payment_terms', 'Cartão', 'Cartão de crédito/débito')
      ON CONFLICT (tenant_id, category, value) DO NOTHING;
    `

    // Executar a migração
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('Erro ao aplicar migração:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Migração aplicada com sucesso',
      data
    })

  } catch (error) {
    console.error('Erro na API de migração:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

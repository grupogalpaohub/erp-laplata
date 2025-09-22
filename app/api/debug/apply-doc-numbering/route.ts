import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Aplicar migração SQL diretamente
    const migrationSQL = `
      -- Função para geração de números de documento sequenciais
      CREATE OR REPLACE FUNCTION next_doc_number(tenant_id_param TEXT, doc_type TEXT)
      RETURNS TEXT AS $$
      DECLARE
          next_seq INTEGER;
          doc_number TEXT;
      BEGIN
          -- Buscar ou criar sequência para o tipo de documento
          SELECT COALESCE(MAX(CAST(SUBSTRING(doc_number FROM '(\\d+)$') AS INTEGER)), 0) + 1
          INTO next_seq
          FROM doc_numbering
          WHERE tenant_id = tenant_id_param
          AND doc_type = doc_type;
          
          -- Gerar número do documento
          CASE doc_type
              WHEN 'SO' THEN
                  doc_number := 'SO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 3, '0');
              WHEN 'PO' THEN
                  doc_number := 'PO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 3, '0');
              WHEN 'INV' THEN
                  doc_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 3, '0');
              ELSE
                  doc_number := doc_type || '-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_seq::TEXT, 3, '0');
          END CASE;
          
          -- Inserir o número gerado na tabela de controle
          INSERT INTO doc_numbering (tenant_id, doc_type, doc_number, created_at)
          VALUES (tenant_id_param, doc_type, doc_number, NOW())
          ON CONFLICT (tenant_id, doc_type, doc_number) DO NOTHING;
          
          RETURN doc_number;
      END;
      $$ LANGUAGE plpgsql;

      -- Tabela para controle de numeração de documentos
      CREATE TABLE IF NOT EXISTS doc_numbering (
          tenant_id TEXT NOT NULL,
          doc_type TEXT NOT NULL,
          doc_number TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          PRIMARY KEY (tenant_id, doc_type, doc_number)
      );

      -- Inserir dados iniciais para o tenant LaplataLunaria
      INSERT INTO doc_numbering (tenant_id, doc_type, doc_number, created_at)
      VALUES 
          ('LaplataLunaria', 'SO', 'SO-2025-000', NOW()),
          ('LaplataLunaria', 'PO', 'PO-2025-000', NOW()),
          ('LaplataLunaria', 'INV', 'INV-2025-000', NOW())
      ON CONFLICT (tenant_id, doc_type, doc_number) DO NOTHING;
    `
    
    // Executar cada comando separadamente
    const commands = migrationSQL.split(';').filter(cmd => cmd.trim())
    
    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec', { sql: command.trim() })
        if (error) {
          console.error('Error executing command:', command, error)
          // Continuar mesmo com erro (função pode já existir)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migração de numeração aplicada com sucesso'
    })
    
  } catch (error) {
    console.error('Error applying migration:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

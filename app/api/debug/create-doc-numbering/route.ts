import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Criar tabela doc_numbering
    const createTable = `
      CREATE TABLE IF NOT EXISTS doc_numbering (
        tenant_id TEXT NOT NULL,
        doc_type TEXT NOT NULL,
        doc_number TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (tenant_id, doc_type, doc_number)
      );
    `
    
    // Inserir dados iniciais
    const insertData = `
      INSERT INTO doc_numbering (tenant_id, doc_type, doc_number, created_at)
      VALUES 
        ('LaplataLunaria', 'SO', 'SO-2025-000', NOW()),
        ('LaplataLunaria', 'PO', 'PO-2025-000', NOW()),
        ('LaplataLunaria', 'INV', 'INV-2025-000', NOW())
      ON CONFLICT (tenant_id, doc_type, doc_number) DO NOTHING;
    `
    
    // Criar função next_doc_number
    const createFunction = `
      CREATE OR REPLACE FUNCTION next_doc_number(tenant_id_param TEXT, doc_type TEXT)
      RETURNS TEXT AS $$
      DECLARE
          next_seq INTEGER;
          doc_number TEXT;
      BEGIN
          -- Buscar próximo número sequencial
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
    `
    
    // Executar comandos via inserção direta
    const { error: tableError } = await supabase
      .from('_sql')
      .insert({ query: createTable })
    
    if (tableError) {
      console.error('Table creation error:', tableError)
    }
    
    const { error: dataError } = await supabase
      .from('_sql')
      .insert({ query: insertData })
    
    if (dataError) {
      console.error('Data insertion error:', dataError)
    }
    
    const { error: functionError } = await supabase
      .from('_sql')
      .insert({ query: createFunction })
    
    if (functionError) {
      console.error('Function creation error:', functionError)
    }
    
    // Testar função
    const { data: testResult, error: testError } = await supabase
      .rpc('next_doc_number', { 
        tenant_id_param: 'LaplataLunaria', 
        doc_type: 'SO' 
      })
    
    if (testError) {
      console.error('Function test error:', testError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao testar função',
        details: testError
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tabela e função criadas com sucesso',
      testResult
    })
    
  } catch (error) {
    console.error('Error creating doc numbering:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}


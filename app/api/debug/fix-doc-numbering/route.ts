import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    console.log('🔧 Aplicando correção do trigger de numeração...');
    
    // 1) Dropar trigger e função problemática
    console.log('1. Removendo trigger e função problemática...');
    await supabase.rpc('exec', { 
      sql: `DROP TRIGGER IF EXISTS trg_so_assign_doc_no ON sd_sales_order;` 
    });
    
    await supabase.rpc('exec', { 
      sql: `DROP FUNCTION IF EXISTS so_assign_doc_no();` 
    });
    
    await supabase.rpc('exec', { 
      sql: `DROP FUNCTION IF EXISTS next_doc_number(TEXT, TEXT);` 
    });
    
    // 2) Recriar tabela doc_numbering
    console.log('2. Recriando tabela doc_numbering...');
    await supabase.rpc('exec', { 
      sql: `DROP TABLE IF EXISTS doc_numbering CASCADE;` 
    });
    
    await supabase.rpc('exec', { 
      sql: `
        CREATE TABLE doc_numbering (
            tenant_id TEXT NOT NULL,
            doc_type TEXT NOT NULL,
            prefix TEXT NOT NULL,
            format TEXT NOT NULL,
            next_seq INTEGER DEFAULT 1,
            is_active BOOLEAN DEFAULT TRUE,
            PRIMARY KEY (tenant_id, doc_type)
        );
      ` 
    });
    
    // 3) Inserir dados iniciais
    console.log('3. Inserindo dados iniciais...');
    await supabase.rpc('exec', { 
      sql: `
        INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
        VALUES 
            ('LaplataLunaria', 'SO', 'SO', 'YYYY-SEQ3', 0, TRUE),
            ('LaplataLunaria', 'PO', 'PO', 'YYYY-SEQ3', 0, TRUE),
            ('LaplataLunaria', 'INV', 'INV', 'YYYY-SEQ3', 0, TRUE);
      ` 
    });
    
    // 4) Recriar função next_doc_number
    console.log('4. Recriando função next_doc_number...');
    await supabase.rpc('exec', { 
      sql: `
        CREATE OR REPLACE FUNCTION next_doc_number(tenant_id_param TEXT, doc_type TEXT)
        RETURNS TEXT AS $$
        DECLARE
            v_next_seq INTEGER;
            v_prefix TEXT;
            v_format TEXT;
            v_doc_number TEXT;
        BEGIN
            -- Get the next sequence number atomically
            UPDATE doc_numbering 
            SET next_seq = next_seq + 1
            WHERE tenant_id = tenant_id_param 
              AND doc_type = doc_type 
              AND is_active = TRUE
            RETURNING next_seq, prefix, format INTO v_next_seq, v_prefix, v_format;
            
            -- If no row was updated, create a new one
            IF NOT FOUND THEN
                INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
                VALUES (tenant_id_param, doc_type, doc_type, 'YYYY-SEQ3', 1, TRUE)
                ON CONFLICT (tenant_id, doc_type) DO UPDATE SET
                    next_seq = doc_numbering.next_seq + 1,
                    is_active = TRUE
                RETURNING next_seq, prefix, format INTO v_next_seq, v_prefix, v_format;
            END IF;
            
            -- Format the document number based on format
            CASE v_format
                WHEN 'YYYY-SEQ3' THEN
                    v_doc_number := v_prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(v_next_seq::TEXT, 3, '0');
                WHEN 'YYYYMM-SEQ6' THEN
                    v_doc_number := v_prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(v_next_seq::TEXT, 6, '0');
                ELSE
                    v_doc_number := v_prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(v_next_seq::TEXT, 3, '0');
            END CASE;
            
            RETURN v_doc_number;
        END;
        $$ LANGUAGE plpgsql;
      ` 
    });
    
    // 5) Recriar trigger
    console.log('5. Recriando trigger...');
    await supabase.rpc('exec', { 
      sql: `
        CREATE OR REPLACE FUNCTION so_assign_doc_no()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.so_id IS NULL OR NEW.so_id = '' THEN
                NEW.so_id := next_doc_number(NEW.tenant_id, 'SO');
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      ` 
    });
    
    await supabase.rpc('exec', { 
      sql: `
        CREATE TRIGGER trg_so_assign_doc_no
            BEFORE INSERT ON sd_sales_order
            FOR EACH ROW EXECUTE FUNCTION so_assign_doc_no();
      ` 
    });
    
    // 6) Teste da função
    console.log('6. Testando função...');
    const testResult = await supabase.rpc('exec', { 
      sql: `SELECT next_doc_number('LaplataLunaria', 'SO') as test_number;` 
    });
    
    console.log('✅ Correção aplicada com sucesso!');
    console.log('Teste:', testResult);
    
    return NextResponse.json({
      success: true,
      message: 'Trigger de numeração corrigido com estrutura original robusta',
      testResult: testResult
    });
    
  } catch (error) {
    console.error('❌ Erro ao aplicar correção:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

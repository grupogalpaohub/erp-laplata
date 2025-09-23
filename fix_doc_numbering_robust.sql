-- =========================================
-- FIX: Aplicar estrutura original robusta
-- =========================================

-- 1) Dropar trigger e função problemática
DROP TRIGGER IF EXISTS trg_so_assign_doc_no ON sd_sales_order;
DROP FUNCTION IF EXISTS so_assign_doc_no();
DROP FUNCTION IF EXISTS next_doc_number(TEXT, TEXT);

-- 2) Recriar tabela doc_numbering com estrutura original
DROP TABLE IF EXISTS doc_numbering CASCADE;
CREATE TABLE doc_numbering (
    tenant_id TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    prefix TEXT NOT NULL,
    format TEXT NOT NULL,
    next_seq INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, doc_type)
);

-- 3) Inserir dados iniciais
INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
VALUES 
    ('LaplataLunaria', 'SO', 'SO', 'YYYY-SEQ3', 0, TRUE),
    ('LaplataLunaria', 'PO', 'PO', 'YYYY-SEQ3', 0, TRUE),
    ('LaplataLunaria', 'INV', 'INV', 'YYYY-SEQ3', 0, TRUE);

-- 4) Recriar função next_doc_number robusta
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

-- 5) Recriar trigger so_assign_doc_no
CREATE OR REPLACE FUNCTION so_assign_doc_no()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.so_id IS NULL OR NEW.so_id = '' THEN
        -- Usa doc_numbering do tenant para tipo 'SO'
        NEW.so_id := next_doc_number(NEW.tenant_id, 'SO');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6) Recriar trigger
CREATE TRIGGER trg_so_assign_doc_no
    BEFORE INSERT ON sd_sales_order
    FOR EACH ROW EXECUTE FUNCTION so_assign_doc_no();

-- 7) Comentários
COMMENT ON FUNCTION next_doc_number(TEXT, TEXT) IS 'Gera número sequencial de documento usando estrutura original robusta com controle atômico';
COMMENT ON TABLE doc_numbering IS 'Controle de numeração sequencial de documentos por tenant e tipo (estrutura original)';
COMMENT ON FUNCTION so_assign_doc_no() IS 'Trigger para atribuir número de documento automaticamente em pedidos de venda';

-- 8) Teste da função
SELECT next_doc_number('LaplataLunaria', 'SO') as test_so_number;
SELECT next_doc_number('LaplataLunaria', 'PO') as test_po_number;

-- Remover trigger que está causando problema
DROP TRIGGER IF EXISTS trg_so_assign_doc_no ON sd_sales_order;
DROP FUNCTION IF EXISTS so_assign_doc_no();

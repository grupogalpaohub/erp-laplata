-- Inserir dados de formas de pagamento
INSERT INTO fi_payment_terms_def (tenant_id, terms_code, description, days, is_active, created_at) VALUES
('default', 'A_VISTA', 'À Vista', 0, true, NOW()),
('default', '30_DIAS', '30 Dias', 30, true, NOW()),
('default', '60_DIAS', '60 Dias', 60, true, NOW()),
('default', '90_DIAS', '90 Dias', 90, true, NOW()),
('default', 'BOLETO', 'Boleto Bancário', 0, true, NOW()),
('default', 'CARTAO_CREDITO', 'Cartão de Crédito', 0, true, NOW()),
('default', 'CARTAO_DEBITO', 'Cartão de Débito', 0, true, NOW()),
('default', 'PIX', 'PIX', 0, true, NOW()),
('default', 'TRANSFERENCIA', 'Transferência Bancária', 0, true, NOW()),
('default', 'DINHEIRO', 'Dinheiro', 0, true, NOW())
ON CONFLICT (tenant_id, terms_code) DO NOTHING;

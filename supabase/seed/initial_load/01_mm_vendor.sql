-- 01_mm_vendor.sql - Load vendor data for LaplataLunaria
INSERT INTO mm_vendor (
    vendor_id, tenant_id, name, contact_person, email, phone, address, 
    city, state, zip_code, country, tax_id, payment_terms, rating, 
    status, created_at, updated_at
) VALUES 
('VENDOR001', 'LaplataLunaria', 'Joias do Brasil Ltda', 'João Silva', 'joao@joiasdobrasil.com.br', '(11) 99999-9999', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', 'Brasil', '12.345.678/0001-90', 30, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR002', 'LaplataLunaria', 'Materiais Preciosos SA', 'Maria Santos', 'maria@materiaispreciosos.com.br', '(21) 88888-8888', 'Av. Central, 456', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', '98.765.432/0001-10', 15, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR003', 'LaplataLunaria', 'Fornecedor Ouro', 'Pedro Costa', 'pedro@fornecedorouro.com.br', '(31) 77777-7777', 'Rua do Ouro, 789', 'Belo Horizonte', 'MG', '30000-000', 'Brasil', '11.222.333/0001-44', 45, 'B', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR004', 'LaplataLunaria', 'Prata & Cia', 'Ana Lima', 'ana@prataecia.com.br', '(41) 66666-6666', 'Rua da Prata, 321', 'Curitiba', 'PR', '80000-000', 'Brasil', '44.555.666/0001-77', 30, 'A', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('VENDOR005', 'LaplataLunaria', 'Acabamentos Finos', 'Carlos Oliveira', 'carlos@acabamentosfinos.com.br', '(51) 55555-5555', 'Av. Industrial, 654', 'Porto Alegre', 'RS', '90000-000', 'Brasil', '77.888.999/0001-00', 15, 'B', 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (vendor_id, tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    contact_person = EXCLUDED.contact_person,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    tax_id = EXCLUDED.tax_id,
    payment_terms = EXCLUDED.payment_terms,
    rating = EXCLUDED.rating,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
-- 06_wh_warehouse.sql - Load warehouse data for LaplataLunaria
INSERT INTO wh_warehouse (
    warehouse_id, tenant_id, name, address, city, state, zip_code, 
    country, contact_person, phone, email, is_default, status, 
    created_at, updated_at
) VALUES 
('WH001', 'LaplataLunaria', 'Depósito Principal', 'Rua Industrial, 1000', 'São Paulo', 'SP', '01234-567', 'Brasil', 'João Silva', '(11) 99999-9999', 'joao@laplatalunaria.com.br', true, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
('WH002', 'LaplataLunaria', 'Depósito Secundário', 'Av. Comercial, 2000', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', 'Maria Santos', '(21) 88888-8888', 'maria@laplatalunaria.com.br', false, 'active', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (warehouse_id, tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    contact_person = EXCLUDED.contact_person,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    is_default = EXCLUDED.is_default,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
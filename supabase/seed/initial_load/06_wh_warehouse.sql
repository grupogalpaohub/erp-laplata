INSERT INTO wh_warehouse (
  tenant_id, plant_id, name, is_default, created_at, address, city, state, zip_code, country, contact_person, phone, email
) VALUES
('LaplataLunaria','WH-001','Depósito Principal',true,NOW(),'Rua Teste','Paranavaí','PR','00000-000','Brasil','Vinicius','(44)9184-4337','deposito@laplatalunaria.com')
ON CONFLICT (plant_id) DO NOTHING;

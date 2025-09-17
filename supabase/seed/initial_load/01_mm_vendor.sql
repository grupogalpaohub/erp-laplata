INSERT INTO mm_vendor (
  tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, status, created_at
) VALUES 
('LaplataLunaria','SUP_00001','Silvercrown','sac.silvercrown@gmail.com','(44)9184-4337','Paranavaí','PR','active',NOW())
ON CONFLICT (vendor_id) DO NOTHING;

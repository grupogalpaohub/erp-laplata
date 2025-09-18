-- ========================================
-- Initial Load v6.3 (Bulk) - Receiving without recv_id (identity/bigint)
-- ========================================

-- 1. Carregar Fornecedor (mm_vendor)
INSERT INTO mm_vendor (tenant_id,vendor_id,vendor_name,email,telefone,cidade,estado,vendor_rating,created_at)
VALUES ('LaplataLunaria','SUP_00001','Silvercrown','sac.silvercrown@gmail.com','(44) 9184-4337','Paranavai','PR','A', now())
ON CONFLICT (vendor_id) DO UPDATE SET vendor_name=EXCLUDED.vendor_name,email=EXCLUDED.email,telefone=EXCLUDED.telefone,cidade=EXCLUDED.cidade,estado=EXCLUDED.estado,vendor_rating=EXCLUDED.vendor_rating;

-- 2. Carregar Depósito (wh_warehouse)
INSERT INTO wh_warehouse (tenant_id,plant_id,name,is_default,created_at)
VALUES ('LaplataLunaria','WH-001','Depósito Principal',true, now())
ON CONFLICT (plant_id) DO UPDATE SET name=EXCLUDED.name,is_default=EXCLUDED.is_default;

-- 3. Carregar Materiais (mm_material)
INSERT INTO mm_material (tenant_id,mm_material,mm_comercial,mm_desc,mm_mat_type,mm_mat_class,mm_price_cents,status,created_at) VALUES
('LaplataLunaria','B_175','Símbolo','Brinco Argola Cravejado Trevo Resina Preto Misto','Brinco','Amuletos',24453,'active', now()),
('LaplataLunaria','B_176','Nauriah','Brinco Círculo Cravejado Olho Grego de Prata','Brinco','Amuletos',19653,'active', now()),
('LaplataLunaria','B_177','Nyra','Brinco Estrelas Liso de Prata','Brinco','Elementar',10853,'active', now()),
('LaplataLunaria','B_178','Senara','Brinco Infinito Cravejado com Borda de Prata','Brinco','Ciclos',24453,'active', now()),
('LaplataLunaria','B_179','Selune','Brinco Lua Cravejado Médio','Brinco','Elementar',20453,'active', now()),
('LaplataLunaria','B_180','Vigil','Brinco Olho Grego Azul Escuro Crav. Inglesa','Brinco','Amuletos',10853,'active', now()),
('LaplataLunaria','B_181','Eterna Sorte','Brinco Trevo Meio-Cravejado de Prata','Brinco','Amuletos',15173,'active', now()),
('LaplataLunaria','C_182','Orakai','Choker 9 Olho Grego Pendurado Mista','Choker','Amuletos',31253,'active', now()),
('LaplataLunaria','K_183','Raízes & Ramos','Conjunto Árvore da Vida de Prata','Kit','Ancestral',45093,'active', now()),
('LaplataLunaria','G_200','Vitalis','Gargantilha Árvore da Vida Zircônia Verde - P','Gargantilha','Ancestral',28453,'active', now()),
('LaplataLunaria','G_201','Vitalis','Gargantilha Árvore da Vida Zircônia Verde - M','Gargantilha','Ancestral',29173,'active', now()),
('LaplataLunaria','G_184','Aeternus','Gargantilha Infinito Cravejado de Prata - P','Gargantilha','Ciclos',22453,'active', now()),
('LaplataLunaria','G_185','Aeternus','Gargantilha Infinito Cravejado de Prata - M','Gargantilha','Ciclos',23253,'active', now()),
('LaplataLunaria','G_186','Mão de Luz','Gargantilha Mão de Fatima Cravejado Vazado - P','Gargantilha','Amuletos',31253,'active', now()),
('LaplataLunaria','G_187','Mão de Luz','Gargantilha Mão de Fatima Cravejado Vazado - M','Gargantilha','Amuletos',32453,'active', now()),
('LaplataLunaria','G_188','Mão de Luz','Gargantilha Mão de Fatima Cravejado Vazado - G','Gargantilha','Amuletos',34853,'active', now()),
('LaplataLunaria','G_189','Aura','Gargantilha Olho Grego Vazado Cravejado - P','Gargantilha','Amuletos',26853,'active', now()),
('LaplataLunaria','G_190','Aura','Gargantilha Olho Grego Vazado Cravejado - M','Gargantilha','Amuletos',27653,'active', now()),
('LaplataLunaria','G_191','Aura','Gargantilha Olho Grego Vazado Cravejado - G','Gargantilha','Amuletos',30053,'active', now()),
('LaplataLunaria','G_192','Ciclos','Gargantilha Retângulo Lua Vazado de Prata - P','Gargantilha','Ciclos',19253,'active', now()),
('LaplataLunaria','G_193','Ciclos','Gargantilha Retângulo Lua Vazado de Prata - M','Gargantilha','Ciclos',20053,'active', now()),
('LaplataLunaria','G_194','Ciclos','Gargantilha Retângulo Lua Vazado de Prata - G','Gargantilha','Ciclos',22853,'active', now()),
('LaplataLunaria','G_195','Helios','Gargantilha Retângulo Sol Vazado de Prata - P','Gargantilha','Elementar',19253,'active', now()),
('LaplataLunaria','G_196','Helios','Gargantilha Retângulo Sol Vazado de Prata - M','Gargantilha','Elementar',20053,'active', now()),
('LaplataLunaria','G_197','Helios','Gargantilha Retângulo Sol Vazado de Prata - G','Gargantilha','Elementar',22853,'active', now()),
('LaplataLunaria','G_198','Guardiã da Noite','Gargantilha Trevo Preto Borda Trabalhado de Prata - P','Gargantilha','Amuletos',22053,'active', now()),
('LaplataLunaria','G_199','Guardiã da Noite','Gargantilha Trevo Preto Borda Trabalhado de Prata - M','Gargantilha','Amuletos',22853,'active', now()),
('LaplataLunaria','P_202','Lunar','Pulseira 3 Lua Vazado Liso Pendurado de Prata','Pulseira','Elementar',18373,'active', now()),
('LaplataLunaria','P_203','Trevo','Pulseira 3 Pontos de Luz Trevo 5mm Turmalina de Prata','Pulseira','Elementar',21013,'active', now()),
('LaplataLunaria','P_204','Guardiãs','Pulseira 4 Olho Grego Pendurado Mista','Pulseira','Elementar',16853,'active', now()),
('LaplataLunaria','P_205','Renova','Pulseira 5 Infinito Seperado de Prata','Pulseira','Ciclos',27253,'active', now()),
('LaplataLunaria','P_209','Florescer','Pulseira Árvore da Vida de Prata','Pulseira','Amuletos',24853,'active', now()),
('LaplataLunaria','P_206','Vítreo','Pulseira Círculo Cravejado Olho Grego de Prata','Pulseira','Elementar',19653,'active', now()),
('LaplataLunaria','P_207','Orion','Pulseira Infinito Liso de Prata','Pulseira','Elementar',18853,'active', now()),
('LaplataLunaria','P_208','Luz','Pulseira Mão de Fátima Hamsá de Prata','Pulseira','Amuletos',22053,'active', now())
ON CONFLICT (mm_material) DO UPDATE SET mm_comercial=EXCLUDED.mm_comercial, mm_desc=EXCLUDED.mm_desc, mm_mat_type=EXCLUDED.mm_mat_type, mm_mat_class=EXCLUDED.mm_mat_class, mm_price_cents=EXCLUDED.mm_price_cents, status=EXCLUDED.status;

-- 4. Carregar Pedido de Compra (mm_purchase_order)
INSERT INTO mm_purchase_order (tenant_id,mm_order,vendor_id,status,po_date,expected_delivery,notes)
VALUES ('LaplataLunaria','PO-2025-001','SUP_00001','received',CURRENT_DATE,CURRENT_DATE + interval '7 day','Carga inicial')
ON CONFLICT (mm_order) DO NOTHING;

-- 5. Carregar Itens do Pedido de Compra (mm_purchase_order_item)
INSERT INTO mm_purchase_order_item (tenant_id,mm_order,plant_id,mm_material,mm_qtt,unit_cost_cents,line_total_cents) VALUES
('LaplataLunaria','PO-2025-001','WH-001','B_175',14,4800,67200),
('LaplataLunaria','PO-2025-001','WH-001','B_176',14,3600,50400),
('LaplataLunaria','PO-2025-001','WH-001','B_177',14,1400,19600),
('LaplataLunaria','PO-2025-001','WH-001','B_178',14,4800,67200),
('LaplataLunaria','PO-2025-001','WH-001','B_179',14,3800,53200),
('LaplataLunaria','PO-2025-001','WH-001','B_180',14,1400,19600),
('LaplataLunaria','PO-2025-001','WH-001','B_181',14,2480,34720),
('LaplataLunaria','PO-2025-001','WH-001','C_182',9,6500,58500),
('LaplataLunaria','PO-2025-001','WH-001','K_183',5,9960,49800),
('LaplataLunaria','PO-2025-001','WH-001','G_200',4,5800,23200),
('LaplataLunaria','PO-2025-001','WH-001','G_201',5,5980,29900),
('LaplataLunaria','PO-2025-001','WH-001','G_184',5,4300,21500),
('LaplataLunaria','PO-2025-001','WH-001','G_185',5,4500,22500),
('LaplataLunaria','PO-2025-001','WH-001','G_186',4,6500,26000),
('LaplataLunaria','PO-2025-001','WH-001','G_187',4,6800,27200),
('LaplataLunaria','PO-2025-001','WH-001','G_188',2,7400,14800),
('LaplataLunaria','PO-2025-001','WH-001','G_189',4,5400,21600),
('LaplataLunaria','PO-2025-001','WH-001','G_190',4,5600,22400),
('LaplataLunaria','PO-2025-001','WH-001','G_191',2,6200,12400),
('LaplataLunaria','PO-2025-001','WH-001','G_192',1,3500,3500),
('LaplataLunaria','PO-2025-001','WH-001','G_193',5,3700,18500),
('LaplataLunaria','PO-2025-001','WH-001','G_194',4,4400,17600),
('LaplataLunaria','PO-2025-001','WH-001','G_195',1,3500,3500),
('LaplataLunaria','PO-2025-001','WH-001','G_196',5,3700,18500),
('LaplataLunaria','PO-2025-001','WH-001','G_197',3,4400,13200),
('LaplataLunaria','PO-2025-001','WH-001','G_198',5,4200,21000),
('LaplataLunaria','PO-2025-001','WH-001','G_199',5,4400,22000),
('LaplataLunaria','PO-2025-001','WH-001','P_202',10,3280,32800),
('LaplataLunaria','PO-2025-001','WH-001','P_203',10,3940,39400),
('LaplataLunaria','PO-2025-001','WH-001','P_204',9,2900,26100),
('LaplataLunaria','PO-2025-001','WH-001','P_205',10,5500,55000),
('LaplataLunaria','PO-2025-001','WH-001','P_209',9,4900,44100),
('LaplataLunaria','PO-2025-001','WH-001','P_206',10,3600,36000),
('LaplataLunaria','PO-2025-001','WH-001','P_207',10,3400,34000),
('LaplataLunaria','PO-2025-001','WH-001','P_208',10,4200,42000);

-- 6. Carregar Recebimentos (mm_receiving)
INSERT INTO mm_receiving (tenant_id,mm_order,plant_id,mm_material,qty_received,received_at) VALUES
('LaplataLunaria','PO-2025-001','WH-001','B_175',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','B_176',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','B_177',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','B_178',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','B_179',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','B_180',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','B_181',14, now()),
('LaplataLunaria','PO-2025-001','WH-001','C_182',9, now()),
('LaplataLunaria','PO-2025-001','WH-001','K_183',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_200',4, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_201',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_184',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_185',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_186',4, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_187',4, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_188',2, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_189',4, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_190',4, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_191',2, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_192',1, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_193',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_194',4, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_195',1, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_196',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_197',3, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_198',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','G_199',5, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_202',10, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_203',10, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_204',9, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_205',10, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_209',9, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_206',10, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_207',10, now()),
('LaplataLunaria','PO-2025-001','WH-001','P_208',10, now());

-- 7. Carregar Saldos de Estoque (wh_inventory_balance)
INSERT INTO wh_inventory_balance (tenant_id,plant_id,mm_material,on_hand_qty,reserved_qty,last_count_date,status) VALUES
('LaplataLunaria','WH-001','B_175',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','B_176',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','B_177',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','B_178',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','B_179',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','B_180',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','B_181',14,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','C_182',9,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','K_183',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_200',4,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_201',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_184',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_185',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_186',4,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_187',4,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_188',2,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_189',4,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_190',4,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_191',2,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_192',1,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_193',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_194',4,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_195',1,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_196',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_197',3,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_198',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','G_199',5,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_202',10,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_203',10,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_204',9,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_205',10,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_209',9,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_206',10,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_207',10,0,CURRENT_DATE,'active'),
('LaplataLunaria','WH-001','P_208',10,0,CURRENT_DATE,'active')
ON CONFLICT (plant_id,mm_material,tenant_id) DO UPDATE SET on_hand_qty=EXCLUDED.on_hand_qty,reserved_qty=EXCLUDED.reserved_qty,last_count_date=EXCLUDED.last_count_date,status=EXCLUDED.status;
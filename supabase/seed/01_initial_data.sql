-- ===========================================================
-- ERP La Plata - Initial Load (ALINHADO AO SCHEMA ATUAL)
-- ===========================================================
-- Este script usa EXATAMENTE os nomes/colunas do schema enviado.
-- Ordem: limpeza -> tenant -> fornecedor -> materiais -> warehouse -> saldos -> PO -> itens -> recebimento -> checks

begin;

-- 0) LIMPEZA SÓ DO TENANT
delete from mm_receiving where tenant_id = 'LaplataLunaria';
delete from mm_purchase_order_item where tenant_id = 'LaplataLunaria';
delete from mm_purchase_order where tenant_id = 'LaplataLunaria';
delete from wh_inventory_balance where tenant_id = 'LaplataLunaria';
delete from wh_warehouse where tenant_id = 'LaplataLunaria';
delete from mm_material where tenant_id = 'LaplataLunaria';
delete from mm_vendor where tenant_id = 'LaplataLunaria';
-- opcional: manter outros módulos intocados

-- 1) TENANT (garantia de existência)
insert into tenant (tenant_id, display_name)
values ('LaplataLunaria', 'La Plata Lunaria')
on conflict (tenant_id) do update
set display_name = excluded.display_name;

-- 2) FORNECEDOR (mm_vendor) - usa colunas existentes no schema
insert into mm_vendor (
  tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating,
  contact_person, address, city, state, zip_code, country, tax_id, payment_terms, rating, status
) values (
  'LaplataLunaria','SUP_00001','Silvercrown','sac.silvercrown@gmail.com','(44) 9184-4337','Paranavai','PR','A',
  'Silvercrown','Paranavai','Paranavai','PR','00000-000','Brasil','00000000000000',30,'A','active'
)
on conflict (vendor_id) do update
set tenant_id = excluded.tenant_id,
    vendor_name = excluded.vendor_name,
    email = excluded.email,
    telefone = excluded.telefone,
    cidade = excluded.cidade,
    estado = excluded.estado,
    vendor_rating = excluded.vendor_rating,
    contact_person = excluded.contact_person,
    address = excluded.address,
    city = excluded.city,
    state = excluded.state,
    zip_code = excluded.zip_code,
    country = excluded.country,
    tax_id = excluded.tax_id,
    payment_terms = excluded.payment_terms,
    rating = excluded.rating,
    status = excluded.status;

-- 3) MATERIAIS (mm_material)
-- IMPORTANTE: PK = mm_material (vamos usar o código como 'sku')
-- Campos adicionais (commercial_name, unit_of_measure etc.) existem no schema e serão preenchidos.
insert into mm_material (
  tenant_id, mm_material, mm_comercial, commercial_name, mm_desc, mm_mat_type, mm_mat_class,
  mm_price_cents, barcode, weight_grams, status, mm_pur_link, mm_vendor_id,
  unit_of_measure, dimensions, purity, color, finish, min_stock, max_stock, lead_time_days
) values
('LaplataLunaria','B_175','Símbolo','Símbolo','Brinco Argola Cravejado Trevo Resina Preto Misto','brinco',null,24453,null,null,'active',null,'SUP_00001','unidade',null,null,'preto','cravejado',10,100,7),
('LaplataLunaria','B_176','Nauriah','Nauriah','Brinco Círculo Cravejado Olho Grego de Prata','brinco',null,19653,null,null,'active',null,'SUP_00001','unidade',null,'925','prata','cravejado',10,100,7),
('LaplataLunaria','B_177','Nyra','Nyra','Brinco Estrelas Liso de Prata','brinco',null,10853,null,null,'active',null,'SUP_00001','unidade',null,'925','prata','liso',10,100,7),
('LaplataLunaria','B_178','Senara','Senara','Brinco Infinito Cravejado com Borda de Prata','brinco',null,24453,null,null,'active',null,'SUP_00001','unidade',null,'925','prata','cravejado',10,100,7),
('LaplataLunaria','B_179','Selune','Selune','Brinco Lua Cravejado Médio de Prata','brinco',null,19653,null,null,'active',null,'SUP_00001','unidade',null,'925','prata','cravejado',10,100,7),
('LaplataLunaria','B_180','Sorcha','Sorcha','Brinco Fios Polidos com Bolinhas de Prata','brinco',null,19653,null,null,'active',null,'SUP_00001','unidade',null,'925','prata','polido',10,100,7),
('LaplataLunaria','B_181','Alaya','Alaya','Brinco Triângulo Arabescos','brinco',null,12453,null,null,'active',null,'SUP_00001','unidade',null,null,null,'arabescos',10,100,7),
('LaplataLunaria','B_182','Aliena','Aliena','Brinco Argola Fio Quadrado','brinco',null,19653,null,null,'active',null,'SUP_00001','unidade',null,null,null,'quadrado',10,100,7),
('LaplataLunaria','B_183','Alita','Alita','Brinco Argola Tarracha','brinco',null,19653,null,null,'active',null,'SUP_00001','unidade',null,null,null,'tarracha',10,100,7),
('LaplataLunaria','B_184','Amyra','Amyra','Brinco Argola Torcida','brinco',null,19653,null,null,'active',null,'SUP_00001','unidade',null,null,null,'torcida',10,100,7),
('LaplataLunaria','B_185','Amaranth','Amaranth','Brinco Argola Lisa Fina Mini','brinco',null,12990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'lisa',10,100,7),
('LaplataLunaria','B_186','Anabeth','Anabeth','Brinco Argola Lisa Grossa','brinco',null,28990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'lisa',10,100,7),
('LaplataLunaria','B_187','Anahi','Anahi','Brinco Argola Lisa Média','brinco',null,18990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'lisa',10,100,7),
('LaplataLunaria','B_188','Anisa','Anisa','Brinco Argola Lisa Pequena','brinco',null,15990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'lisa',10,100,7),
('LaplataLunaria','B_189','Asha','Asha','Brinco Argola Lisa Super Fina','brinco',null,14990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'lisa',10,100,7),
('LaplataLunaria','B_190','Ayra','Ayra','Brinco Argola Lisa Torcida','brinco',null,18990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'lisa',10,100,7),
('LaplataLunaria','B_191','Calyssa','Calyssa','Brinco Argola com Pingente Coração','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_192','Danika','Danika','Brinco Argola com Pingente Estrela','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_193','Elara','Elara','Brinco Argola com Pingente Lua','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_194','Elis','Elis','Brinco Argola com Pingente Raio','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_195','Elodie','Elodie','Brinco Argola Bolinhas','brinco',null,18990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'bolinhas',10,100,7),
('LaplataLunaria','B_196','Elys','Elys','Brinco Argola Esferas Torcidas','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'esferas',10,100,7),
('LaplataLunaria','B_197','Freya','Freya','Brinco Argola Fio Quadrado Pequena','brinco',null,19990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'quadrado',10,100,7),
('LaplataLunaria','B_198','Gaea','Gaea','Brinco Argola Fio Quadrado Média','brinco',null,22990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'quadrado',10,100,7),
('LaplataLunaria','B_199','Gaia','Gaia','Brinco Argola Fio Quadrado Grossa','brinco',null,25990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'quadrado',10,100,7),
('LaplataLunaria','B_200','Helena','Helena','Brinco Argola Quadrada','brinco',null,22990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'quadrada',10,100,7),
('LaplataLunaria','B_201','Ilara','Ilara','Brinco Argola Quadrada Texturizada','brinco',null,24990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'texturizada',10,100,7),
('LaplataLunaria','B_202','Inaya','Inaya','Brinco Argola Torcida Média','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'torcida',10,100,7),
('LaplataLunaria','B_203','Ione','Ione','Brinco Argola Torcida Fina','brinco',null,19990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'torcida',10,100,7),
('LaplataLunaria','B_204','Kaia','Kaia','Brinco Argola com Bolinha','brinco',null,17990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'bolinha',10,100,7),
('LaplataLunaria','B_205','Kaira','Kaira','Brinco Argola com Pingente Gotinha','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_206','Keira','Keira','Brinco Argola com Pingente Cruz','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_207','Lyra','Lyra','Brinco Argola com Pingente Estrela do Mar','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_208','Maia','Maia','Brinco Argola com Pingente Concha','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_209','Nyx','Nyx','Brinco Argola com Pingente Olho Grego','brinco',null,22990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7),
('LaplataLunaria','B_210','Orla','Orla','Brinco Argola com Pingente Trevo','brinco',null,21990,null,null,'active',null,'SUP_00001','unidade',null,null,null,'pingente',10,100,7)
on conflict (mm_material) do update
set tenant_id       = excluded.tenant_id,
    mm_comercial    = excluded.mm_comercial,
    commercial_name = excluded.commercial_name,
    mm_desc         = excluded.mm_desc,
    mm_mat_type     = excluded.mm_mat_type,
    mm_mat_class    = excluded.mm_mat_class,
    mm_price_cents  = excluded.mm_price_cents,
    barcode         = excluded.barcode,
    weight_grams    = excluded.weight_grams,
    status          = excluded.status,
    mm_pur_link     = excluded.mm_pur_link,
    mm_vendor_id    = excluded.mm_vendor_id,
    unit_of_measure = excluded.unit_of_measure,
    dimensions      = excluded.dimensions,
    purity          = excluded.purity,
    color           = excluded.color,
    finish          = excluded.finish,
    min_stock       = excluded.min_stock,
    max_stock       = excluded.max_stock,
    lead_time_days  = excluded.lead_time_days;

-- 4) WAREHOUSE (wh_warehouse)
insert into wh_warehouse (tenant_id, plant_id, name, is_default, address, city, state, zip_code, country, contact_person, phone, email)
values ('LaplataLunaria','WH-001','Depósito Principal', true, 'Endereço do Depósito', 'Paranavai', 'PR', '00000-000', 'Brasil', 'Responsável', '(00) 0000-0000', 'deposito@laplatalunaria.com.br')
on conflict (plant_id) do update
set tenant_id    = excluded.tenant_id,
    name         = excluded.name,
    is_default   = excluded.is_default,
    address      = excluded.address,
    city         = excluded.city,
    state        = excluded.state,
    zip_code     = excluded.zip_code,
    country      = excluded.country,
    contact_person = excluded.contact_person,
    phone        = excluded.phone,
    email        = excluded.email;

-- 5) SALDOS INICIAIS (wh_inventory_balance)
-- PK: (plant_id, mm_material, tenant_id)
insert into wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status) values
('LaplataLunaria','WH-001','B_175',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_176',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_177',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_178',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_179',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_180',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_181',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_182',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_183',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_184',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_185',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_186',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_187',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_188',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_189',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_190',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_191',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_192',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_193',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_194',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_195',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_196',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_197',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_198',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_199',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_200',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_201',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_202',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_203',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_204',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_205',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_206',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_207',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_208',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_209',14,0,'2025-07-21','active'),
('LaplataLunaria','WH-001','B_210',14,0,'2025-07-21','active')
on conflict (plant_id, mm_material, tenant_id) do update
set on_hand_qty     = excluded.on_hand_qty,
    reserved_qty    = excluded.reserved_qty,
    last_count_date = excluded.last_count_date,
    status          = excluded.status;

-- 6) PURCHASE ORDER (mm_purchase_order) - status é USER-DEFINED: usar valor seguro 'draft'
insert into mm_purchase_order (
  tenant_id, mm_order, vendor_id, status, po_date, expected_delivery, notes, total_amount, currency
) values (
  'LaplataLunaria', 'PO-2025-001', 'SUP_00001', 'draft', '2025-07-01', '2025-07-21', 'Pedido de brincos', 0, 'BRL'
)
on conflict (mm_order) do update
set tenant_id         = excluded.tenant_id,
    vendor_id         = excluded.vendor_id,
    status            = excluded.status,
    po_date           = excluded.po_date,
    expected_delivery = excluded.expected_delivery,
    notes             = excluded.notes,
    total_amount      = excluded.total_amount,
    currency          = excluded.currency;

-- 7) ITENS DO PO (mm_purchase_order_item) - PK serial; inserir simples
insert into mm_purchase_order_item (
  tenant_id, mm_order, plant_id, mm_material, mm_qtt, unit_cost_cents, line_total_cents, notes, currency
) values
('LaplataLunaria','PO-2025-001','WH-001','B_175',14,4800,  14*4800,  'B_175','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_176',14,3600,  14*3600,  'B_176','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_177',14,1400,  14*1400,  'B_177','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_178',14,3800,  14*3800,  'B_178','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_179',14,2400,  14*2400,  'B_179','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_180',14,3000,  14*3000,  'B_180','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_181',14,1600,  14*1600,  'B_181','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_182',14,2600,  14*2600,  'B_182','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_183',14,2600,  14*2600,  'B_183','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_184',14,2600,  14*2600,  'B_184','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_185',14,1800,  14*1800,  'B_185','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_186',14,3800,  14*3800,  'B_186','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_187',14,2400,  14*2400,  'B_187','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_188',14,2100,  14*2100,  'B_188','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_189',14,2000,  14*2000,  'B_189','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_190',14,2400,  14*2400,  'B_190','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_191',14,2800,  14*2800,  'B_191','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_192',14,2800,  14*2800,  'B_192','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_193',14,2800,  14*2800,  'B_193','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_194',14,2800,  14*2800,  'B_194','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_195',14,2400,  14*2400,  'B_195','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_196',14,2800,  14*2800,  'B_196','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_197',14,2500,  14*2500,  'B_197','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_198',14,2600,  14*2600,  'B_198','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_199',14,2700,  14*2700,  'B_199','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_200',14,2600,  14*2600,  'B_200','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_201',14,2700,  14*2700,  'B_201','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_202',14,2800,  14*2800,  'B_202','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_203',14,2200,  14*2200,  'B_203','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_204',14,2300,  14*2300,  'B_204','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_205',14,2400,  14*2400,  'B_205','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_206',14,2500,  14*2500,  'B_206','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_207',14,2600,  14*2600,  'B_207','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_208',14,2700,  14*2700,  'B_208','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_209',14,2800,  14*2800,  'B_209','BRL'),
('LaplataLunaria','PO-2025-001','WH-001','B_210',14,2900,  14*2900,  'B_210','BRL');

-- 8) RECEBIMENTO (mm_receiving) - PK serial; received_at é timestamptz; status default 'received'
insert into mm_receiving (
  tenant_id, mm_order, plant_id, mm_material, qty_received, received_at, received_by, status, notes
)
select 'LaplataLunaria', 'PO-2025-001', 'WH-001', m.mm_material, 14, '2025-07-21T00:00:00Z'::timestamptz, 'Vinicius', default, null
from mm_material m
where m.tenant_id = 'LaplataLunaria'
  and m.mm_material between 'B_175' and 'B_210';

-- 9) CHECKS

-- 9.1 exatamente 1 depósito default por tenant
select tenant_id,
       count(*)                                   as total_warehouses,
       count(case when is_default then 1 end)     as default_warehouses
from wh_warehouse
where tenant_id = 'LaplataLunaria'
group by tenant_id;

-- 9.2 SKUs (mm_material) referenciados nos itens de PO existem
select 'SKUs inexistentes em itens de PO' as check_type, count(*) as count_missing
from mm_purchase_order_item i
left join mm_material m
  on m.tenant_id = i.tenant_id and m.mm_material = i.mm_material
where i.tenant_id = 'LaplataLunaria' and m.mm_material is null;

-- 9.3 Vendor referenciado no PO existe
select 'Vendors inexistentes em PO' as check_type, count(*) as count_missing
from mm_purchase_order po
left join mm_vendor v
  on v.vendor_id = po.vendor_id
where po.tenant_id = 'LaplataLunaria' and v.vendor_id is null;

-- 9.4 Plantas referenciadas em itens/recebimentos existem
select 'Plantas inexistentes em itens de PO' as check_type, count(*) as count_missing
from mm_purchase_order_item i
left join wh_warehouse w on w.plant_id = i.plant_id
where i.tenant_id = 'LaplataLunaria' and w.plant_id is null;

select 'Plantas inexistentes em recebimentos' as check_type, count(*) as count_missing
from mm_receiving r
left join wh_warehouse w on w.plant_id = r.plant_id
where r.tenant_id = 'LaplataLunaria' and w.plant_id is null;

commit;

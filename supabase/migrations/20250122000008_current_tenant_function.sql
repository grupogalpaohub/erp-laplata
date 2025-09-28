-- Função para obter tenant_id do JWT
create or replace function public.current_tenant()
returns text as $$
  select current_setting('request.jwt.claims.tenant_id', true);
$$ language sql stable;

-- Ajustar defaults das tabelas multi-tenant para usar current_tenant()
-- Tabelas principais do sistema

-- CRM
alter table crm_customer
  alter column tenant_id set default public.current_tenant();

alter table crm_customer_category
  alter column tenant_id set default public.current_tenant();

alter table crm_payment_preferences
  alter column tenant_id set default public.current_tenant();

-- MM
alter table mm_material
  alter column tenant_id set default public.current_tenant();

alter table mm_material_class
  alter column tenant_id set default public.current_tenant();

alter table mm_material_type
  alter column tenant_id set default public.current_tenant();

alter table mm_vendor
  alter column tenant_id set default public.current_tenant();

alter table mm_purchase_order
  alter column tenant_id set default public.current_tenant();

alter table mm_purchase_order_item
  alter column tenant_id set default public.current_tenant();

-- SD
alter table sd_sales_order
  alter column tenant_id set default public.current_tenant();

alter table sd_sales_order_item
  alter column tenant_id set default public.current_tenant();

-- WH
alter table wh_warehouse
  alter column tenant_id set default public.current_tenant();

alter table wh_inventory
  alter column tenant_id set default public.current_tenant();

-- FI
alter table fi_account
  alter column tenant_id set default public.current_tenant();

alter table fi_account_type
  alter column tenant_id set default public.current_tenant();

-- CO
alter table co_cost_center
  alter column tenant_id set default public.current_tenant();

-- User profiles
alter table user_profile
  alter column tenant_id set default public.current_tenant();

-- Ajustar RLS policies para usar current_tenant()
-- Remover policies antigas e recriar com current_tenant()

-- CRM Policies
drop policy if exists "crm_customer_select_policy" on crm_customer;
drop policy if exists "crm_customer_insert_policy" on crm_customer;
drop policy if exists "crm_customer_update_policy" on crm_customer;
drop policy if exists "crm_customer_delete_policy" on crm_customer;

create policy "crm_customer_select_policy" on crm_customer
  for select using (tenant_id = public.current_tenant());

create policy "crm_customer_insert_policy" on crm_customer
  for insert with check (tenant_id = public.current_tenant());

create policy "crm_customer_update_policy" on crm_customer
  for update using (tenant_id = public.current_tenant());

create policy "crm_customer_delete_policy" on crm_customer
  for delete using (tenant_id = public.current_tenant());

-- MM Policies
drop policy if exists "mm_material_select_policy" on mm_material;
drop policy if exists "mm_material_insert_policy" on mm_material;
drop policy if exists "mm_material_update_policy" on mm_material;
drop policy if exists "mm_material_delete_policy" on mm_material;

create policy "mm_material_select_policy" on mm_material
  for select using (tenant_id = public.current_tenant());

create policy "mm_material_insert_policy" on mm_material
  for insert with check (tenant_id = public.current_tenant());

create policy "mm_material_update_policy" on mm_material
  for update using (tenant_id = public.current_tenant());

create policy "mm_material_delete_policy" on mm_material
  for delete using (tenant_id = public.current_tenant());

-- SD Policies
drop policy if exists "sd_sales_order_select_policy" on sd_sales_order;
drop policy if exists "sd_sales_order_insert_policy" on sd_sales_order;
drop policy if exists "sd_sales_order_update_policy" on sd_sales_order;
drop policy if exists "sd_sales_order_delete_policy" on sd_sales_order;

create policy "sd_sales_order_select_policy" on sd_sales_order
  for select using (tenant_id = public.current_tenant());

create policy "sd_sales_order_insert_policy" on sd_sales_order
  for insert with check (tenant_id = public.current_tenant());

create policy "sd_sales_order_update_policy" on sd_sales_order
  for update using (tenant_id = public.current_tenant());

create policy "sd_sales_order_delete_policy" on sd_sales_order
  for delete using (tenant_id = public.current_tenant());

-- User Profile Policies
drop policy if exists "user_profile_select_policy" on user_profile;
drop policy if exists "user_profile_insert_policy" on user_profile;
drop policy if exists "user_profile_update_policy" on user_profile;
drop policy if exists "user_profile_delete_policy" on user_profile;

create policy "user_profile_select_policy" on user_profile
  for select using (tenant_id = public.current_tenant());

create policy "user_profile_insert_policy" on user_profile
  for insert with check (tenant_id = public.current_tenant());

create policy "user_profile_update_policy" on user_profile
  for update using (tenant_id = public.current_tenant());

create policy "user_profile_delete_policy" on user_profile
  for delete using (tenant_id = public.current_tenant());

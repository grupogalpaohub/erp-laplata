-- moved by cleanup-repo.ts from sql/erp_mm_po_patch.sql
-- =========================================
-- PATCH: ERP MM + Purchase Orders Enhancements (PARTE 1)
-- - Campos em mm_purchase_order
-- - Congelamento de preço nos itens
-- - Totalização no header
-- - Tabelas de log base (preço e mudanças)
-- =========================================

-- 1) Campos adicionais em mm_purchase_order
alter table if exists public.mm_purchase_order
  add column if not exists status text not null default 'rascunho'
    check (status in ('rascunho','aprovado','em_andamento','recebido','cancelado')),
  add column if not exists order_date date not null default current_date,
  add column if not exists total_cents bigint not null default 0;

-- 2) Campos adicionais em mm_purchase_order_item (preço congelado e total da linha)
alter table if exists public.mm_purchase_order_item
  add column if not exists unit_cost_cents bigint,
  add column if not exists line_total_cents bigint;

-- 3) Tabelas de logs (se ainda não existirem)
create table if not exists public.mm_price_log (
  id uuid primary key default gen_random_uuid(),
  mm_material text not null references public.mm_material(mm_material) on delete cascade,
  old_price bigint,
  new_price bigint not null,
  changed_at timestamptz not null default now(),
  changed_by uuid
);
create table if not exists public.mm_change_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null,
  field_name text not null,
  old_value text,
  new_value text,
  changed_at timestamptz not null default now(),
  changed_by uuid
);

-- 4) Freeze price ao inserir item (snapshot do preço atual do material)
create or replace function public.freeze_item_price()
returns trigger as $$
declare
  v_price bigint;
begin
  select mm_price_cents into v_price
  from public.mm_material
  where mm_material = new.mm_material;

  if v_price is null then
    raise exception 'Material % sem preço cadastrado', new.mm_material;
  end if;

  new.unit_cost_cents := v_price;
  -- aceita mm_qtt ou quantity, conforme schema
  new.line_total_cents := coalesce(new.mm_qtt, new.quantity, 0) * v_price;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_freeze_item_price on public.mm_purchase_order_item;
create trigger trg_freeze_item_price
before insert on public.mm_purchase_order_item
for each row execute function public.freeze_item_price();

-- 5) Atualiza total do pedido no header em ins/upd/del de item
create or replace function public.update_po_total()
returns trigger as $$
declare
  v_po uuid;
begin
  v_po := coalesce(new.po_id, old.po_id);
  update public.mm_purchase_order
  set total_cents = (
    select coalesce(sum(line_total_cents),0)
    from public.mm_purchase_order_item
    where po_id = v_po
  )
  where po_id = v_po;
  return coalesce(new, old);
end;
$$ language plpgsql;

drop trigger if exists trg_update_po_total_ins on public.mm_purchase_order_item;
drop trigger if exists trg_update_po_total_upd on public.mm_purchase_order_item;
drop trigger if exists trg_update_po_total_del on public.mm_purchase_order_item;

create trigger trg_update_po_total_ins
after insert on public.mm_purchase_order_item
for each row execute function public.update_po_total();

create trigger trg_update_po_total_upd
after update on public.mm_purchase_order_item
for each row execute function public.update_po_total();

create trigger trg_update_po_total_del
after delete on public.mm_purchase_order_item
for each row execute function public.update_po_total();

-- 6) Impede mudar material/preço do item após criação; quantidade só em 'rascunho'
create or replace function public.prevent_item_price_update()
returns trigger as $$
declare
  v_status text;
begin
  if new.unit_cost_cents is distinct from old.unit_cost_cents then
    raise exception 'Preço unitário do item não pode ser alterado após criação';
  end if;

  if new.mm_material is distinct from old.mm_material then
    raise exception 'Material do item não pode ser alterado após criação';
  end if;

  if (coalesce(new.mm_qtt, new.quantity) is distinct from coalesce(old.mm_qtt, old.quantity)) then
    select status into v_status from public.mm_purchase_order where po_id = old.po_id;
    if v_status is distinct from 'rascunho' then
      raise exception 'Quantidade só pode ser alterada quando o pedido está em status rascunho';
    end if;
    new.line_total_cents := coalesce(new.mm_qtt, new.quantity, 0) * old.unit_cost_cents;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_prevent_item_price_update on public.mm_purchase_order_item;
create trigger trg_prevent_item_price_update
before update on public.mm_purchase_order_item
for each row execute function public.prevent_item_price_update();

-- 7) Índices úteis
do $$
begin
  if not exists (select 1 from pg_indexes where schemaname='public' and tablename='mm_purchase_order' and indexname='idx_mm_po_status') then
    create index idx_mm_po_status on public.mm_purchase_order(status);
  end if;

  if not exists (select 1 from pg_indexes where schemaname='public' and tablename='mm_purchase_order' and indexname='idx_mm_po_vendor') then
    create index idx_mm_po_vendor on public.mm_purchase_order(mm_vendor_id);
  end if;

  if not exists (select 1 from pg_indexes where schemaname='public' and tablename='mm_purchase_order' and indexname='idx_mm_po_date') then
    create index idx_mm_po_date on public.mm_purchase_order(order_date);
  end if;

  if not exists (select 1 from pg_indexes where schemaname='public' and tablename='mm_purchase_order_item' and indexname='idx_mm_poi_po') then
    create index idx_mm_poi_po on public.mm_purchase_order_item(po_id);
  end if;
end $$;


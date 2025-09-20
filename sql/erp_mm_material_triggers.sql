-- =========================================
-- PATCH: MM Material Logs (PARTE 2)
-- - Coluna price_last_updated_at
-- - Log de preço (trigger BEFORE UPDATE OF mm_price_cents)
-- - Log de campos não-preço (trigger AFTER UPDATE)
-- =========================================

-- Coluna de data da última atualização de preço
alter table if exists public.mm_material
  add column if not exists price_last_updated_at timestamptz default now();

-- Função: log de preço + atualizar price_last_updated_at
create or replace function public.log_material_price_change()
returns trigger as $$
begin
  if tg_op = 'UPDATE' and new.mm_price_cents is distinct from old.mm_price_cents then
    insert into public.mm_price_log (mm_material, old_price, new_price, changed_by)
    values (new.mm_material, old.mm_price_cents, new.mm_price_cents, auth.uid());
    new.price_last_updated_at := now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_log_material_price_change on public.mm_material;
create trigger trg_log_material_price_change
before update of mm_price_cents on public.mm_material
for each row execute function public.log_material_price_change();

-- Função: log de alterações não-preço selecionadas
create or replace function public.log_material_nonprice_changes()
returns trigger as $$
begin
  if new.mm_comercial is distinct from old.mm_comercial then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'mm_comercial', old.mm_comercial::text, new.mm_comercial::text, auth.uid());
  end if;

  if new.mm_desc is distinct from old.mm_desc then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'mm_desc', old.mm_desc::text, new.mm_desc::text, auth.uid());
  end if;

  if new.mm_mat_type is distinct from old.mm_mat_type then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'mm_mat_type', old.mm_mat_type::text, new.mm_mat_type::text, auth.uid());
  end if;

  if new.mm_mat_class is distinct from old.mm_mat_class then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'mm_mat_class', old.mm_mat_class::text, new.mm_mat_class::text, auth.uid());
  end if;

  if new.lead_time_days is distinct from old.lead_time_days then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'lead_time_days', old.lead_time_days::text, new.lead_time_days::text, auth.uid());
  end if;

  if new.status is distinct from old.status then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'status', old.status::text, new.status::text, auth.uid());
  end if;

  if new.mm_vendor_id is distinct from old.mm_vendor_id then
    insert into public.mm_change_log(table_name, record_id, field_name, old_value, new_value, changed_by)
    values ('mm_material', new.mm_material, 'mm_vendor_id', old.mm_vendor_id::text, new.mm_vendor_id::text, auth.uid());
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_log_material_nonprice_changes on public.mm_material;
create trigger trg_log_material_nonprice_changes
after update on public.mm_material
for each row
when (
  (new.mm_comercial  is distinct from old.mm_comercial)  or
  (new.mm_desc       is distinct from old.mm_desc)       or
  (new.mm_mat_type   is distinct from old.mm_mat_type)   or
  (new.mm_mat_class  is distinct from old.mm_mat_class)  or
  (new.lead_time_days is distinct from old.lead_time_days) or
  (new.status        is distinct from old.status)        or
  (new.mm_vendor_id  is distinct from old.mm_vendor_id)
)
execute function public.log_material_nonprice_changes();

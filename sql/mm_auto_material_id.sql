-- =========================================
-- PATCH: Geração Automática de Material ID
-- - Função para gerar ID baseado no tipo
-- - Tabela de mapeamento de prefixos
-- - Trigger para geração automática
-- =========================================

-- 1) Tabela de mapeamento de prefixos (fonte única)
create table if not exists public.mm_material_type_prefix (
  type text primary key,
  prefix text not null,
  created_at timestamptz default now()
);

-- 2) Inserir mapeamentos iniciais
insert into public.mm_material_type_prefix (type, prefix) values
  ('brinco', 'B_'),
  ('gargantilha', 'G_'),
  ('choker', 'C_'),
  ('pulseira', 'P_'),
  ('kit', 'K_')
on conflict (type) do nothing;

-- 3) Função para gerar próximo ID do tipo
create or replace function public.generate_material_id(material_type text)
returns text
language plpgsql
as $$
declare
  v_prefix text;
  v_next_seq bigint;
  v_material_id text;
begin
  -- Buscar prefixo do tipo
  select prefix into v_prefix
  from public.mm_material_type_prefix
  where type = material_type;
  
  if v_prefix is null then
    raise exception 'Tipo de material inválido: %', material_type;
  end if;
  
  -- Buscar próximo número da sequência
  select coalesce(max(
    cast(substring(mm_material from length(v_prefix) + 1) as bigint)
  ), 0) + 1
  into v_next_seq
  from public.mm_material
  where mm_material like v_prefix || '%';
  
  -- Formatar ID com zero-padding (6 dígitos)
  v_material_id := v_prefix || lpad(v_next_seq::text, 6, '0');
  
  return v_material_id;
end;
$$;

-- 4) Função para validar se ID corresponde ao tipo
create or replace function public.validate_material_id_type(material_id text, material_type text)
returns boolean
language plpgsql
as $$
declare
  v_expected_prefix text;
begin
  select prefix into v_expected_prefix
  from public.mm_material_type_prefix
  where type = material_type;
  
  if v_expected_prefix is null then
    return false;
  end if;
  
  return material_id like v_expected_prefix || '%';
end;
$$;

-- 5) Trigger para geração automática (se mm_material estiver vazio)
create or replace function public.auto_generate_material_id()
returns trigger
language plpgsql
as $$
begin
  -- Se mm_material estiver vazio ou null, gerar automaticamente
  if new.mm_material is null or new.mm_material = '' then
    new.mm_material := public.generate_material_id(new.mm_mat_type);
  else
    -- Se mm_material foi fornecido, validar se corresponde ao tipo
    if not public.validate_material_id_type(new.mm_material, new.mm_mat_type) then
      raise exception 'Material ID % não corresponde ao tipo %', new.mm_material, new.mm_mat_type;
    end if;
  end if;
  
  return new;
end;
$$;

-- 6) Aplicar trigger
drop trigger if exists trg_auto_generate_material_id on public.mm_material;
create trigger trg_auto_generate_material_id
  before insert on public.mm_material
  for each row execute function public.auto_generate_material_id();

-- 7) Índice para performance na busca por prefixo
create index if not exists idx_mm_material_prefix 
on public.mm_material (mm_material) 
where mm_material ~ '^[A-Z]_[0-9]{6}$';

-- 8) Função para bulk validation (dry-run)
create or replace function public.validate_bulk_materials(
  materials jsonb
)
returns table(
  row_index int,
  is_valid boolean,
  error_message text,
  generated_id text
)
language plpgsql
as $$
declare
  material jsonb;
  i int := 0;
  v_material_type text;
  v_material_id text;
  v_is_valid boolean;
  v_error_message text;
  v_generated_id text;
begin
  for material in select * from jsonb_array_elements(materials)
  loop
    i := i + 1;
    v_is_valid := true;
    v_error_message := null;
    v_generated_id := null;
    
    v_material_type := material->>'mm_mat_type';
    v_material_id := material->>'mm_material';
    
    -- Validar tipo
    if v_material_type is null or v_material_type = '' then
      v_is_valid := false;
      v_error_message := 'Tipo de material é obrigatório';
    elsif not exists (select 1 from public.mm_material_type_prefix where type = v_material_type) then
      v_is_valid := false;
      v_error_message := 'Tipo de material inválido: ' || v_material_type;
    else
      -- Se ID foi fornecido, validar correspondência
      if v_material_id is not null and v_material_id != '' then
        if not public.validate_material_id_type(v_material_id, v_material_type) then
          v_is_valid := false;
          v_error_message := 'ID ' || v_material_id || ' não corresponde ao tipo ' || v_material_type;
        end if;
      else
        -- Gerar ID automático
        v_generated_id := public.generate_material_id(v_material_type);
      end if;
    end if;
    
    return query select i, v_is_valid, v_error_message, v_generated_id;
  end loop;
end;
$$;

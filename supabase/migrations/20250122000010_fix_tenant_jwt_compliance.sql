-- B) Garanta tenant_id dentro do JWT (user metadata)
-- Execute no SQL editor do Supabase (no schema auth):

-- 1) Confere o que há no metadata do usuário
-- select id, email, raw_user_meta_data
-- from auth.users
-- where email = 'admin@teste.com';

-- 2) Grava tenant_id no metadata do usuário (se ainda não estiver lá)
-- update auth.users
-- set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) ||
--                          jsonb_build_object('tenant_id', 'LaplataLunaria')
-- where email = 'admin@teste.com';

-- C) Corrija/robustez da função current_tenant()
create or replace function public.current_tenant()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
    auth.jwt() ->> 'tenant_id',
    auth.jwt() -> 'user_metadata' ->> 'tenant_id',
    auth.jwt() -> 'app_metadata' ->> 'tenant_id',
    (select tenant_id from public.user_profile where user_id = auth.uid())
  );
$$;

-- D) Policies (somente SELECT mostrado; mantenha as suas se já existem)
-- Exemplo para mm_material (ajuste para suas demais tabelas)
drop policy if exists select_mm_material on public.mm_material;
create policy select_mm_material
on public.mm_material
for select
using (tenant_id = public.current_tenant());

-- E) Teste rápido (ordem importante)
-- No navegador: abra http://localhost:3000/login, faça login (admin@teste.com / teste123).
-- Ainda logado, abra outra aba e acesse:
-- http://localhost:3000/api/auth/refresh → deve mostrar {"ok":true,"session":true}.
-- http://localhost:3000/api/health → deve mostrar {"ok":true,"unauth":false}.
-- http://localhost:3000/api/mm/materials → agora deve trazer itens (não []).

-- SQL editor (com a sessão do app não se aplica, mas só para ver a lógica):
-- select public.current_tenant();             -- deveria retornar 'LaplataLunaria' quando via app
-- select count(*) from mm_material
-- where tenant_id = public.current_tenant();  -- > 0 quando vindo via app


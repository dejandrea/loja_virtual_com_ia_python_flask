begin;

alter table public.produtos enable row level security;

-- Garante os privilegios SQL; as policies abaixo definem quais linhas podem ser usadas.
grant select on table public.produtos to anon, authenticated;
grant insert, update, delete on table public.produtos to authenticated;
revoke insert, update, delete on table public.produtos from anon, public;

-- Policies permissivas sao combinadas com OR. Remover as anteriores garante
-- que nenhuma policy antiga continue liberando escrita para usuarios anonimos.
do $policies$
declare
  policy_name text;
begin
  for policy_name in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'produtos'
  loop
    execute format(
      'drop policy %I on public.produtos',
      policy_name
    );
  end loop;
end
$policies$;

create policy "produtos_leitura_publica"
on public.produtos
for select
to anon, authenticated
using (true);

create policy "produtos_insercao_autenticada"
on public.produtos
for insert
to authenticated
with check (true);

create policy "produtos_atualizacao_autenticada"
on public.produtos
for update
to authenticated
using (true)
with check (true);

create policy "produtos_exclusao_autenticada"
on public.produtos
for delete
to authenticated
using (true);

commit;

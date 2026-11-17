-- VIVVA: tabela usada pela tela "Rotina" (CRUD de lembretes).
-- Rode no Supabase: SQL Editor > New query > Run.

create table if not exists public.lembretes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  horario text,
  categoria text not null default 'Pessoal',
  concluido boolean not null default false,
  concluido_em timestamptz,
  criado_em timestamptz not null default now()
);

alter table public.lembretes enable row level security;

-- Politicas abertas ao papel "anon": adequado a projeto academico/demonstracao.
-- Em producao, adicione autenticacao e vincule cada lembrete a um usuario.
create policy "anon le lembretes" on public.lembretes
  for select to anon using (true);

create policy "anon cria lembretes" on public.lembretes
  for insert to anon with check (true);

create policy "anon atualiza lembretes" on public.lembretes
  for update to anon using (true) with check (true);

create policy "anon exclui lembretes" on public.lembretes
  for delete to anon using (true);

-- Atualiza o cache do schema da API REST.
notify pgrst, 'reload schema';

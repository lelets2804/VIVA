# VIVVA

> Plataforma web de apoio à autonomia e ao bem-estar no dia a dia, com rotina, segurança e mobilidade em um só lugar.

**Global Solution FIAP 2026.2 · CitizenTech · Engenharia de Software 1º ano · Lins · Paulista**

## Ficha da CitizenTech

| Campo | Resposta |
|---|---|
| **Nome da CitizenTech** | VIVVA |
| **Cidade e bairro** | São Paulo, [PREENCHER: bairro] |
| **Cidadão beneficiado** | [PREENCHER: a pessoa real que o grupo entrevistou. Ex.: idosos e pessoas que dependem de apoio para manter a autonomia em São Paulo] |
| **Problema, em uma frase** | [PREENCHER: o problema que ela enfrenta. Ex.: organizar a rotina, ter apoio à mão e saber como o clima e a cidade afetam o deslocamento] |
| **Como funciona** | Aplicação web em React: lembretes salvos em banco online (Supabase), contatos de apoio e SOS demonstrativo, clima e alertas de São Paulo via Open-Meteo, mapa de trânsito (Waze) e painel de alagamentos (CGE), além de insights e um assistente local. |
| **O que cada parte faz** | Ver [Arquitetura](#arquitetura): `pages` são as telas, `components` são a camada visual, `hooks` guardam a lógica e o estado, `services` acessam as APIs. |
| **Link do repositório** | [PREENCHER: link do GitHub] |
| **Link do deploy** | https://vivva-one.vercel.app |
| **Indicador de impacto** | [PREENCHER: Ex.: % de lembretes concluídos por usuário (já exibido na tela Insights)] |
| **ODS conectados** | 3, 11 e 13 (detalhes abaixo) |

### Integrantes

| Nome completo | RM |
|---|---|
| [PREENCHER] | [PREENCHER] |
| [PREENCHER] | [PREENCHER] |

## Funcionalidades

- **Início:** resumo do dia, saudação, módulos em destaque e fundo 3D da cidade (com alternativa quando o navegador não suporta WebGL).
- **Rotina:** CRUD completo de lembretes (criar, listar, editar, concluir e excluir), com filtros, barra de progresso e dados salvos no **Supabase**.
- **Segurança:** cadastro de contatos de apoio e botão **SOS demonstrativo**, que apenas registra um alerta no histórico. Ele **não** liga nem envia mensagens.
- **Mobilidade:** clima atual e previsão de 4 dias, qualidade do ar, avisos ambientais, busca de cidade, mapa de trânsito (Waze) e painel de alagamentos da CGE.
- **Insights:** padrões calculados a partir dos lembretes concluídos (por hora, dia da semana e categoria).
- **Assistente:** assistente local por palavras-chave que responde sobre o app, a rotina e o clima. Não usa IA externa.
- **Tema claro/escuro**, navegação responsiva (menu lateral no desktop, barra inferior no celular) e respeito à preferência de movimento reduzido.

## Tecnologias

- **React 19** + **Vite** · **Tailwind CSS 4** · **React Router**
- **Framer Motion** (animações) · **Lucide** (ícones) · **Three.js / React Three Fiber** (fundo 3D)
- **Supabase** (API REST/PostgREST) para o CRUD de lembretes
- **Open-Meteo** (geocodificação, previsão e qualidade do ar), sem chave de API

## Arquitetura

```
src/
├── pages/        # telas (Dashboard, Rotina, Seguranca, Mobilidade, Insights, Assistente)
├── components/   # camada visual reutilizável (cartões, modais, layout, navegação...)
├── hooks/        # custom hooks: lógica de negócio e estado (useLembretes, useClima, useContatos...)
├── services/     # acesso a dados e APIs (lembretesService, climaService, ...)
├── context/      # estado compartilhado da cena (CenaProvider)
└── utils/        # funções puras (clima, geo, padrões, assistente)
```

Fluxo: **page → custom hook → service → API**. Páginas e componentes não fazem `fetch` nem acessam o armazenamento diretamente.

### Requisitos da disciplina

| Requisito | Onde está |
|---|---|
| React com Vite | `package.json`, `vite.config.js` |
| Tailwind CSS | `src/index.css`, plugin `@tailwindcss/vite` |
| 8 componentes ou mais | `src/components/` (26 componentes) |
| `useState` e `useEffect` | Hooks e componentes em geral |
| 2 custom hooks ou mais | `src/hooks/` (10 hooks) |
| Separação de responsabilidades | `pages` → `hooks` → `services` |
| API externa com CRUD | `src/services/lembretesService.js` (Supabase: GET, POST, PATCH, DELETE) |
| Funcionalidades ligadas ao tema | Rotina, Segurança, Mobilidade, Insights |
| Documentação de IA | [`AI.md`](./AI.md) |

## ODS conectados

- **ODS 3, Saúde e bem-estar:** lembretes de rotina (como medicamentos e compromissos) e contatos de apoio ajudam a manter o cuidado diário e a autonomia.
- **ODS 11, Cidades e comunidades sustentáveis:** informações de trânsito, alagamentos e clima de São Paulo apoiam o planejamento do deslocamento.
- **ODS 13, Ação contra a mudança global do clima:** avisos de chuva, calor e qualidade do ar ajudam as pessoas a se adaptarem a eventos climáticos.

[PREENCHER: revisem com o grupo se esses ODS e as explicações representam o projeto.]

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (com npm)
- Uma conta gratuita no [Supabase](https://supabase.com/)

## Instalação e execução

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Crie o banco de lembretes no Supabase**

   No painel do projeto, abra **SQL Editor**, cole o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite o `.env` com a **Project URL** e a chave pública (**anon** ou **publishable**) do Supabase (Project Settings → API). Use `https://seu-projeto.supabase.co`, sem barra no final e sem aspas.

4. **Rode o projeto**

   ```bash
   npm run dev
   ```

   Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção localmente |
| `npm run lint` | Verifica o código com ESLint |

### Deploy (Vercel)

Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Settings → Environment Variables** e faça um novo deploy, pois o Vite embute as variáveis no build.

## Dados e privacidade

- Nenhum dado pessoal real é usado. Os lembretes e contatos são de demonstração.
- Contatos de apoio e histórico de alertas ficam apenas no navegador (`localStorage`).
- A chave `anon` do Supabase é pública por natureza. As políticas do banco estão abertas por se tratar de projeto acadêmico.
- O SOS é demonstrativo. Em emergência real, ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia).

## Documentação de IA

O uso de ferramentas de IA no desenvolvimento está descrito em [`AI.md`](./AI.md).
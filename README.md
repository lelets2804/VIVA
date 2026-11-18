# VIVVA

> Plataforma web de apoio à autonomia e ao bem-estar no dia a dia, que reúne rotina, segurança e mobilidade em um só lugar.

**Global Solution FIAP 2026.2 · CitizenTech · Engenharia de Software 1º ano · Lins · Paulista**

**Repositório:** https://github.com/lelets2804/VIVA · **Deploy:** https://vivva-one.vercel.app

---

## Conceito: O Futuro da Autonomia

Entre os conceitos propostos no material *Ideias de CitizenTech*, o VIVVA parte do **5. O Futuro da Autonomia: tecnologia que amplia capacidades humanas**.

- **Ponto de partida:** muitos serviços e ambientes são pensados para um padrão limitado de usuário. Pessoas idosas, ou que dependem de apoio, encontram barreiras para organizar a rotina, ter ajuda por perto e se deslocar com segurança pela cidade.
- **O salto conceitual:** em vez de a pessoa se adaptar a vários aplicativos e fontes de informação espalhados, a tecnologia se adapta a ela. Num só lugar, com texto maior, linguagem simples e menos animação para quem precisa, ela reúne o que importa para o dia: os compromissos, quem chamar e como está a cidade lá fora.
- **Por que não é "só mais um app":** o VIVVA cruza as informações. O clima e a qualidade do ar viram recomendações para o horário dos lembretes da pessoa, e os lembretes concluídos viram padrões que ajudam a entender a própria rotina.

O projeto também conversa com o conceito **1. Cidade Viva**: a tela inicial representa São Paulo como uma cidade 3D que reage à hora do dia e ao uso de cada módulo, e os avisos de chuva, calor e alagamento ajudam a pessoa a reagir ao que acontece no território.

### Recorte do protótipo

Seguindo a orientação de **escolher uma barreira específica e não prometer uma solução assistiva universal**, o protótipo demonstra três funções centrais:

1. **Rotina:** lembretes de remédios, consultas e compromissos, salvos em banco online, com progresso do dia.
2. **Segurança:** contatos de apoio e um botão SOS **demonstrativo**, que registra o alerta sem ligar nem enviar mensagens.
3. **Mobilidade:** clima, previsão, qualidade do ar e avisos para o deslocamento em São Paulo, com o mapa de trânsito e o painel de alagamentos.

---

## Ficha da CitizenTech

| Campo | Resposta |
|---|---|
| **Nome da CitizenTech** | VIVVA |
| **Conceito de origem** | 5. O Futuro da Autonomia (com elementos de 1. Cidade Viva) |
| **Cidade** | São Paulo (SP) |
| **Cidadão beneficiado** | Idosos e pessoas que dependem de apoio para manter a autonomia no dia a dia em São Paulo, além dos familiares e cuidadores que acompanham essa rotina |
| **Problema, em uma frase** | Pessoas idosas ou que dependem de apoio têm dificuldade para manter a rotina de cuidados, ter ajuda à mão e saber como o clima e a cidade afetam o deslocamento, porque essas informações estão espalhadas em vários lugares e raramente são pensadas para elas. |
| **Como funciona** | Aplicação web em React: lembretes salvos em banco online (Supabase), contatos de apoio e SOS demonstrativo, clima e alertas de São Paulo via Open-Meteo, mapa de trânsito (Waze) e painel de alagamentos (CGE), além de insights e um assistente local. |
| **O que cada parte faz** | Ver [Arquitetura](#arquitetura): `pages` são as telas, `components` são a camada visual, `hooks` guardam a lógica e o estado, `services` acessam as APIs. |
| **Link do repositório** | https://github.com/lelets2804/VIVA |
| **Link do deploy** | https://vivva-one.vercel.app |
| **Indicador de impacto** | % de lembretes concluídos por dia (exibido na tela Rotina e na tela Insights) |
| **ODS conectados** | 3, 11 e 13 (detalhes abaixo) |

### Integrantes
| Letícia Moreira | RM569909 |
| Danielle Freitas | RM569396 |
| Ingrid Ramalho | RM569532 |

---

## Como levamos o conceito para a Global Solution
Seguimos os passos sugeridos no material da FIAP:

| Passo | No VIVVA |
|---|---|
| 1. Escolher um território e um público real | Território: cidade de São Paulo, que tem chuvas fortes, alagamentos e ondas de calor frequentes. Público: idosos e pessoas que dependem de apoio no dia a dia. |
| 2. Investigar antes de decidir | Levantamos as dificuldades mais comuns desse público: esquecer horários de remédios e consultas, não ter os contatos de apoio organizados e sair de casa sem saber se vai chover, fazer calor ou haver alagamento no caminho. |
| 3. Encontrar um problema específico | Reunir num só lugar, de forma simples e acessível, a rotina de cuidados, os contatos de apoio e as condições da cidade. |
| 4. Definir o que será demonstrado | Rotina, Segurança e Mobilidade, integrados num resumo diário. |
| 5. Integrar as disciplinas | **Front-end:** React e Tailwind. **Experiência do usuário:** texto maior, alvos de toque de 44px, tema claro e escuro e menos animação para quem precisa. **Modelagem matemática:** cálculo dos padrões de conclusão por hora, dia da semana e categoria, e da taxa de conclusão diária. **Dados e APIs:** CRUD no Supabase e dados climáticos do Open-Meteo. **Storytelling:** a cidade 3D da tela inicial, que conta o dia da pessoa pela hora e pelos faróis de cada módulo. |
| 6. Medir o resultado | % de lembretes concluídos por dia, calculado a partir dos dados reais de uso. |

---

## Funcionalidades
- **Início:** saudação conforme o horário, resumo do dia (clima, progresso da rotina, próximo lembrete e recomendações) e uma cidade 3D que muda com a hora do dia e acompanha a rolagem. Se o navegador não suporta WebGL, o app funciona normalmente sem o fundo 3D.
- **Rotina:** CRUD completo de lembretes (criar, listar, editar, concluir e excluir), com filtros, anel de progresso e dados salvos no **Supabase**.
- **Segurança:** cadastro de contatos de apoio e botão **SOS demonstrativo**, que apenas registra um alerta no histórico. Ele **não** liga nem envia mensagens.
- **Mobilidade:** clima atual e previsão de 4 dias, qualidade do ar, avisos para o deslocamento, busca de outras cidades, mapa de trânsito (Waze) e painel de alagamentos da CGE.
- **Insights:** padrões calculados a partir dos lembretes concluídos (por hora do dia, dia da semana e categoria).
- **Assistente:** assistente local que responde dúvidas sobre o app a partir de uma base de perguntas e respostas. Não usa IA externa.

### Acessibilidade e experiência do usuário

Pensado para o público do projeto:

- Texto base maior e fontes de leitura fácil (Funnel Display e Funnel Sans).
- Botões e links com pelo menos 44px de altura, fáceis de tocar.
- Foco sempre visível, link "Pular para o conteúdo" e navegação completa pelo teclado.
- Rótulos visíveis nos campos e mensagens de erro abaixo de cada campo.
- Tema claro e escuro, e respeito à preferência do sistema por menos movimento.
- Menu lateral no computador e barra de navegação inferior no celular.

---

## Tecnologias
- **React 19** + **Vite** · **Tailwind CSS 4** · **React Router**
- **Framer Motion** (animações) · **Lucide** (ícones) · **Three.js / React Three Fiber** (cidade 3D)
- **Supabase** (API REST/PostgREST) para o CRUD de lembretes
- **Open-Meteo** (geocodificação, previsão e qualidade do ar), sem chave de API

---

## Arquitetura
```
src/
├── pages/        # telas (Dashboard, Rotina, Seguranca, Mobilidade, Insights, Assistente)
├── components/   # camada visual reutilizável (cartões, modais, layout, navegação...)
├── hooks/        # custom hooks: lógica de negócio e estado (useLembretes, useClima, useContatos...)
├── services/     # acesso a dados e APIs (lembretesService, climaService, ...)
├── context/      # estado compartilhado da cena 3D (CenaProvider)
└── utils/        # funções puras (clima, geo, padrões, saudação)
```

Fluxo: **página → custom hook → service → API**. Páginas e componentes não fazem `fetch` nem acessam o armazenamento diretamente.

O visual segue um pequeno sistema de componentes definido em `src/index.css` (`.btn`, `.cartao`, `.campo`, `.chip`, `.etiqueta`, `.nota`, `.modal`), para que todas as telas tenham a mesma aparência.

### Requisitos da disciplina
| Requisito | Onde está |
|---|---|
| React com Vite | `package.json`, `vite.config.js` |
| Tailwind CSS | `src/index.css`, plugin `@tailwindcss/vite` |
| 8 componentes ou mais | `src/components/` (27 componentes) |
| `useState` e `useEffect` | Hooks e componentes em geral |
| 2 custom hooks ou mais | `src/hooks/` (10 hooks) |
| Separação de responsabilidades | `pages` → `hooks` → `services` |
| API externa com CRUD | `src/services/lembretesService.js` (Supabase: GET, POST, PATCH, DELETE) |
| Funcionalidades ligadas ao tema | Rotina, Segurança, Mobilidade, Insights |
| Documentação de IA | [`AI.md`](./AI.md) |

---

## ODS conectados
- **ODS 3, Saúde e bem-estar:** lembretes de rotina (como medicamentos e consultas) e contatos de apoio ajudam a manter o cuidado diário e a autonomia.
- **ODS 11, Cidades e comunidades sustentáveis:** informações de trânsito, alagamentos e clima de São Paulo apoiam o planejamento do deslocamento.
- **ODS 13, Ação contra a mudança global do clima:** avisos de chuva, calor e qualidade do ar ajudam as pessoas a se adaptarem a eventos climáticos.

---

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

Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Settings → Environment Variables** e faça um novo deploy, porque o Vite embute as variáveis no build.

---

## Limites do protótipo
Como orienta o material da FIAP, deixamos explícito o que o VIVVA **não** faz:

- O **SOS é demonstrativo**: não liga para emergência, não envia SMS e não avisa os contatos. Em uma emergência real, ligue **192** (SAMU), **193** (Bombeiros) ou **190** (Polícia).
- Os **avisos de clima** ajudam a se preparar, mas não garantem a segurança de um trajeto.
- Os **insights** são calculados no navegador e não substituem orientação médica ou profissional.
- O **assistente** responde só a partir de uma base local de perguntas e não é uma IA generativa.

## Dados e privacidade
- Nenhum dado pessoal real é usado. Os lembretes e contatos são de demonstração.
- Contatos de apoio e histórico de alertas ficam apenas no navegador (`localStorage`).
- A chave `anon` do Supabase é pública por natureza. As políticas do banco estão abertas por se tratar de um projeto acadêmico.

---

## Documentação de IA
O uso de ferramentas de IA no desenvolvimento está descrito em [`AI.md`](./AI.md).
````
# Uso de Inteligência Artificial no VIVVA
> Usamos **apenas o Claude** (Anthropic) durante todo o projeto. O tema já tinha sido definido pelo grupo, e o Claude nos ajudou a partir do enunciado da Global Solution até os ajustes finais. Na seção 2.1, registramos o processo de criação do site e, na seção 2.2, a conversa sobre o redesign visual. As respostas estão escritas na voz do Claude, de forma resumida.

---

## 1. Ferramentas utilizadas

| Ferramenta | Finalidade |
|---|---|
| **Claude (Anthropic)** | Usamos o Claude desde o começo para entender o enunciado, organizar o projeto, criar e ajustar telas, integrar o Supabase e o Open-Meteo, desenvolver a cidade 3D e o assistente local, além de preparar o README e fazer o redesign. Também pedimos ajuda com o nome do commit e com a organização deste arquivo. |
| **taste-skill** (`design-taste-frontend`), uma skill para o Claude Code | Usamos essa skill como referência para o redesign. Ela sugeriu uma paleta sem violeta, as fontes Funnel Display e Funnel Sans, padrões para botões e cartões, animações mais discretas e botões com área de toque de pelo menos 44px. |

---

## 2. Interações realizadas
#### Fase 1: ideia e planejamento

**Prompt 1**
> [enviamos o PDF do enunciado da Global Solution - CitizenTech] Esse é o enunciado do nosso projeto

*Resposta:* Resumi os requisitos: aplicação em React com Vite e Tailwind CSS, pelo menos 8 componentes, uso de `useState` e `useEffect`, pelo menos 2 custom hooks, separação de responsabilidades, integração com uma API externa com CRUD completo, ficha da CitizenTech, ODS relacionados, README, arquivo `AI.md` e deploy.

**Prompt 2**
> Nosso tema já está definido: uma plataforma para ajudar idosos e pessoas que dependem de apoio a manter a autonomia no dia a dia em São Paulo. Com base no enunciado, quais funcionalidades fazem sentido para esse público?

*Resposta:* Sugeri organizar a plataforma em três módulos: Rotina (lembretes de remédios e compromissos), Segurança (contatos de confiança e um botão de emergência) e Mobilidade (clima e alertas antes de sair de casa), além de um resumo do dia na tela inicial.

**Prompt 3**
> O nome do projeto vai ser VIVVA. Quais ODS da ONU combinam com o nosso tema e com esses módulos?

*Resposta:* Relacionei o ODS 3 (saúde e bem-estar) à Rotina e à Segurança, o ODS 11 (cidades e comunidades sustentáveis) à Mobilidade e o ODS 13 (ação contra a mudança do clima) aos avisos de chuva, calor e qualidade do ar.

**Prompt 4**
> Oq você acha do botão de emergência poder ligar de verdade para o SAMU?

*Resposta:* Um site não deve prometer acionar serviços de emergência sem integração oficial, porque isso pode colocar alguém em risco. Recomendo um **SOS demonstrativo**, que só registra o alerta e mostra os números 192, 193 e 190.

**Prompt 5**
> Como eu organizo o projeto para cumprir todos os requisitos do enunciado?

*Resposta:* Propus as pastas `pages`, `components`, `hooks`, `services` e `utils`, com o fluxo página → hook → service → API. Sugeri o Supabase para o CRUD e o Open-Meteo para o clima, que não precisa de chave.

#### Fase 2: criando o projeto

**Prompt 6**
> Já criei o projeto com Vite e instalei o Tailwind. Agora quero que o site tenha as páginas Início, Rotina, Segurança, Mobilidade, Insights e Assistente. Configura o React Router.

*Resposta:* Configurei o `BrowserRouter` no `main.jsx` e as rotas no `App.jsx`, todas dentro de um componente `Layout`.

**Prompt 7**
> Cria o layout com um menu lateral no computador que dá para recolher, e no celular uma barra embaixo com ícones.

*Resposta:* Criei o `Layout`, a `Sidebar` (com animação de largura pelo Framer Motion) e a `BottomNav`, usando ícones do Lucide.

**Prompt 8**
> Quero tema claro e escuro, e que o site lembre a escolha da pessoa.

*Resposta:* Criei o hook `useTheme`, que salva o tema no `localStorage` e aplica a classe `dark` no `<html>`, e coloquei o botão de alternar nos dois menus.

**Prompt 9**
> Define as cores do site. Quero algo em tons de verde, calmo, que passe confiança.

*Resposta:* Criei as cores `moss`, `forest`, `sage`, `pearl` e `pearl-light` no `@theme` do Tailwind, com um violeta como cor de destaque.

#### Fase 3: Rotina com Supabase

**Prompt 10**
> Como eu uso o Supabase para salvar os lembretes? Nunca usei.

*Resposta:* Expliquei como criar a conta e o projeto e onde encontrar a URL e a chave pública. Também mostrei como guardar esses dados num arquivo `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

**Prompt 11**
> Escreve o SQL da tabela de lembretes com título, horário, categoria e se foi concluído.

*Resposta:* Escrevi o `supabase/schema.sql` com a tabela `lembretes` e as políticas de acesso. Avisei que deixá-las abertas só é aceitável num projeto de demonstração.

**Prompt 12**
> Agora cria o service que faz o CRUD completo no Supabase, sem usar biblioteca, só fetch.

*Resposta:* Criei o `lembretesService.js` com `listarLembretes` (GET), `criarLembrete` (POST), `atualizarLembrete` (PATCH) e `excluirLembrete` (DELETE).

**Prompt 13**
> Cria o hook useLembretes e a página Rotina com a lista, um botão de novo lembrete, editar, concluir e excluir.

*Resposta:* Criei o `useLembretes`, a página Rotina, o `LembreteCard` e o `LembreteModal`.

**Prompt 14**
> Apareceu um erro e a lista não carrega.

*Resposta:* Identifiquei que o `.env` não estava configurado ou que o servidor não tinha sido reiniciado. Também acrescentei ao service a mensagem "Configure as variáveis do Supabase no arquivo .env." para o erro ficar claro na tela.

**Prompt 15**
> Coloca validação no formulário: título obrigatório, com limite de caracteres, e horário válido.

*Resposta:* Adicionei as validações (3 a 80 caracteres, categoria válida e formato de horário), com a mensagem de erro abaixo do campo e um contador de caracteres.

**Prompt 16**
> Quero filtros de todos, pendentes e concluídos, e um gráfico de progresso do dia.

*Resposta:* Criei os filtros e o `ProgressRing`, um anel em SVG que se preenche com animação conforme os lembretes são concluídos.

**Prompt 17**
> Dá para ter uma animaçãozinha quando a pessoa conclui um lembrete?

*Resposta:* Criei o `useRajadas` e o `RajadaParticulas`, uma pequena explosão de partículas no lugar do clique. Ela fica desligada para quem prefere menos movimento, graças ao hook `useReducedMotion`, que criei junto.

#### Fase 4: Segurança

**Prompt 18**
> Agora a página Segurança: cadastro de contatos de confiança com nome, telefone e relação.

*Resposta:* Criei o `segurancaService.js` (salvando no `localStorage`), o hook `useContatos`, o `ContatoCard` e o `ContatoModal`, com validação do telefone com DDD.

**Prompt 19**
> Faz o botão SOS demonstrativo que a gente combinou, com confirmação antes e um histórico.

*Resposta:* Criei o `BotaoSOS` com diálogo de confirmação, o `useAlertas` e o `HistoricoAlertas`, além de um aviso fixo de "função demonstrativa" com os números de emergência.

#### Fase 5: Mobilidade

**Prompt 20**
> Puxa o clima de São Paulo pela API do Open-Meteo: temperatura agora, previsão dos próximos dias e qualidade do ar.

*Resposta:* Criei o `climaService.js` (`buscarClima` e `buscarQualidadeAr`), o hook `useClima`, o `CartaoClima` e o `PrevisaoDias`.

**Prompt 21**
> Quero poder buscar outra cidade.

*Resposta:* Acrescentei o `buscarCidades`, usando a geocodificação do Open-Meteo, o hook `useBuscaCidade` e o componente `BuscaCidade`.

**Prompt 22**
> A partir do clima, gera avisos para quem vai sair de casa, tipo levar guarda-chuva ou se hidratar.

*Resposta:* Criei o `gerarAvisos` e o `gerarRecomendacoes` em `utils/clima.js` (chuva, calor, frio, vento, UV e ar seco) e o componente `AvisoAmbiental`.

**Prompt 23**
> Dá para registrar o trajeto da pessoa pelo GPS do celular?

*Resposta:* Criei o `useTrajeto`, o `trajetosService`, as funções de distância em `utils/geo.js`, o `RastreadorTrajeto` e o `TrajetoMapa`, que desenha o percurso gravado.

**Prompt 24**
> O rastreamento ficou complicado de testar e não mostra o trânsito. Troca por um mapa de trânsito de verdade e mostra os alagamentos de São Paulo.

*Resposta:* Incorporei o mapa do Waze centralizado em São Paulo e o painel de alagamentos do CGE na página Mobilidade. Os componentes de trajeto continuaram no projeto, mas saíram da tela.

**Prompt 25**
> O painel do CGE às vezes fica em branco.

*Resposta:* Expliquei que o site do CGE pode bloquear a exibição dentro de outro site e acrescentei um botão para o painel oficial, com uma explicação para o usuário.

#### Fase 6: Início com a cidade 3D

**Prompt 26**
> A tela de Início está muito simples. Quero algo que impressione, tipo uma cidade 3D no fundo.

*Resposta:* Instalei o Three.js e o React Three Fiber e criei o `FundoCidade`, com prédios, um chão em grade, rotas animadas e um farol para cada módulo.

**Prompt 27**
> Faz o céu mudar com a hora do dia e coloca um controle para a pessoa mexer na hora.

*Resposta:* Escrevi shaders para o céu (sol, lua, estrelas e pôr do sol) e para as janelas acesas à noite. Também criei o `CenaContext`, que compartilha a hora, o foco e a rolagem, e o controle "Hora do dia" com o botão "Agora".

**Prompt 28**
> Quero que a câmera ande pela cidade quando a pessoa rola a página, parando em cada módulo.

*Resposta:* Dividi o Início em seções (Início, Resumo e um bloco para cada módulo). A câmera passou a seguir a rolagem e a acender o farol do módulo em foco, e coloquei pontinhos de navegação na lateral.

**Prompt 29**
> Num computador mais antigo a tela ficou toda branca.

*Resposta:* Acrescentei uma verificação de WebGL e um `ErrorBoundary`, para o site funcionar normalmente sem o fundo 3D quando o navegador não aguenta.

**Prompt 30**
> Coloca um resumo do dia na tela de Início com o clima, o progresso da rotina e o próximo lembrete.

*Resposta:* Criei o `ResumoDiario` e as funções de saudação e de data por extenso em `utils/saudacao.js`.

#### Fase 7: Insights e Assistente

**Prompt 31**
> Cria a página Insights, mostrando padrões de quando a pessoa conclui as tarefas.

*Resposta:* Criei o `analisarPadroes` em `utils/padroes.js` (por hora, dia da semana e categoria) e a página Insights, com números, gráficos de barras e progresso por categoria.

**Prompt 32**
> Quero um assistente que converse com a pessoa sobre a rotina e o clima, mas sem usar IA paga.

*Resposta:* Criei o `utils/assistente.js`, um assistente por palavras-chave que responde sobre clima, tarefas, semana e trajetos. Ele também reconhece mensagens de crise ou perigo e indica o CVV (188), o SAMU (192) e a Polícia (190).

**Prompt 33**
> O assistente está respondendo coisa errada às vezes. Faz uma versão mais simples, focada em tirar dúvidas sobre o site.

*Resposta:* Reescrevi a página Assistente com uma base de perguntas e respostas por assunto, perguntas sugeridas e um aviso de que ele não é uma IA generativa.

#### Fase 8: acabamento e entrega

**Prompt 34**
> Revisa o site inteiro para acessibilidade: leitor de tela, teclado e quem prefere menos animação.

*Resposta:* Adicionei `aria-label` aos botões que só têm ícone, `aria-live` nas mensagens, fechamento dos modais com Esc e respeito ao movimento reduzido nas animações.

**Prompt 35**
> Quando eu publicar o site na Vercel o Supabase continua funcionando lá?

*Resposta:* Expliquei como cadastrar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente, fazendo um novo deploy em seguida.

**Prompt 36**
> Escreve o README com a ficha da CitizenTech, as funcionalidades, a arquitetura, a tabela de requisitos e como rodar o projeto.

*Resposta:* Escrevi o `README.md` com todas essas seções e deixei campos para o grupo completar (bairro, integrantes e links).

### 2.2 Redesign visual 

**Prompt 37: instalar a skill**
> Vc tem o taste skill disponivel?

*Resposta:* Avisei que a skill não estava disponível na sessão na nuvem, porque ela tinha sido instalada só no computador da integrante (`~/.claude/skills`). Quando recebi o link do repositório público (`Leonxlnx/taste-skill`), baixei e instalei a skill na sessão. Antes de usar, revisei os scripts por causa do alerta de risco do instalador e expliquei que eles abrem um Chrome invisível para checar a página, apagam só os próprios arquivos temporários e acessam a internet apenas para buscar fontes, ícones e fotos.

**Prompt 38: o pedido principal**
> [enviamos o projeto em .zip] Quero melhorar o design front desse projeto

*Resposta:* Identifiquei que o VIVVA é um **app** (React + Vite + Tailwind), e não uma landing page, por isso apliquei só a parte da skill que faz sentido para um app. Antes de mudar qualquer coisa, tirei screenshots de todas as telas. Os problemas que encontrei foram:
- violeta espalhado pelo app (botão SOS, avisos, etiquetas, cidade 3D);
- títulos com efeito "prata metálico", difíceis de ler;
- cada componente com um estilo próprio de botão e de borda;
- animações que voltavam a cada rolagem e efeito parallax nos números grandes;
- botões de ícone com menos de 44px;
- um `App.css` que sobrou do template do Vite e não era usado.

Depois reescrevi o `src/index.css` com um sistema de classes e apliquei essas classes em todas as telas, sem mexer em hooks, services ou na lógica.

**Prompt 39: receber o código**
> Me manda por escrito as páginas alteradas, para eu colocar no vscode

*Resposta:* Enviei o código completo dos 33 arquivos alterados, dividido em quatro partes (base e Início; Rotina e Segurança; Mobilidade, Insights e Assistente; trocas de cor). Nos arquivos em que só algumas linhas mudaram, como a cidade 3D, mandei uma tabela "procure / troque por".

**Prompt 40: commit**
> Me da um nome para commit

*Resposta:* Sugeri `feat: redesign visual com novo sistema de cores, tipografia e componentes`, com uma descrição em tópicos.

---

## 3. Aplicação no projeto

### Desenvolvido ou modificado com auxílio da IA (redesign)

| Área | Arquivos | O que mudou |
|---|---|---|
| Sistema visual | `src/index.css`, `index.html` | Paleta da marca mantida e violeta trocado por âmbar (atenção) e coral (SOS). Fontes Funnel Display e Funnel Sans, texto base maior. Classes `.btn`, `.cartao`, `.campo`, `.chip`, `.etiqueta`, `.nota`, `.modal`. Descrição e tags de compartilhamento no `index.html` e tema aplicado antes da tela abrir. |
| Navegação | `Sidebar.jsx`, `BottomNav.jsx`, `Layout.jsx`, `Marca.jsx` (novo) | Novo ícone da marca, item ativo destacado, link "Pular para o conteúdo" e nomes das abas cabendo inteiros no celular. |
| Títulos e animações | `TituloPagina.jsx`, `RevelarTexto.jsx`, `SecaoModulo.jsx` | Título entra uma vez ao abrir a tela. Parallax e efeito metálico removidos. |
| Início | `Dashboard.jsx`, `ResumoDiario.jsx` | Painéis reorganizados sobre a cidade 3D e atalhos dos módulos com seta. |
| Rotina | `Rotina.jsx`, `LembreteCard.jsx`, `LembreteModal.jsx`, `ProgressRing.jsx` | Cartões, filtros e formulário no novo padrão. Anel de progresso sem violeta e adaptado ao celular. |
| Segurança | `Seguranca.jsx`, `BotaoSOS.jsx`, `ContatoCard.jsx`, `ContatoModal.jsx`, `HistoricoAlertas.jsx` | Botão SOS em vermelho (antes violeta) e aviso de "função demonstrativa" em âmbar. |
| Mobilidade | `Mobilidade.jsx`, `CartaoClima.jsx`, `AvisoAmbiental.jsx`, `PrevisaoDias.jsx`, `BuscaCidade.jsx` | Cartões, avisos e previsão no novo padrão. Cor de tempestade sem violeta. |
| Insights e Assistente | `Insights.jsx`, `Assistente.jsx` | Números grandes, gráficos em verde e balões da conversa nas cores da marca. |
| Cidade 3D | `FundoCidade.jsx` | Céu da noite verde-azulado, pôr do sol alaranjado, janelas com luz quente e farol da Segurança em coral. |

### Papel do grupo

A IA ajudou a gerar o código durante todo o desenvolvimento. Nós definimos o tema, o problema e as funcionalidades, fomos fazendo os pedidos, conferimos o que era entregue, testamos o projeto, configuramos o Supabase e realizamos o deploy. Todas as sugestões geradas foram aproveitadas, mas o resultado foi conferido pelo grupo.

---

## 4. Validação das respostas

**Testes e verificações relatados pelo Claude durante o redesign:**
- **Comparação visual:** screenshots de todas as telas antes e depois da mudança, em computador (1440px) e celular (390px), nos temas claro e escuro. Isso mostrou que, no celular, os nomes das abas apareciam cortados ("Segur…", "Mobili…"), e a IA corrigiu.
- **Build:** `npm run build` concluiu sem erros depois das mudanças.`Dashboard.jsx`,
- **Busca por sobras:** a IA procurou `violet` no projeto para garantir que nenhuma cor antiga ficou para trás.
- **Lógica preservada:** segundo a IA, hooks e services não foram alterados, só classes, cores e marcação.

**O que nós testamos:**
- Aplicamos os arquivos do redesign no VS Code e executamos o projeto com `npm run dev`. Conferimos as telas e tudo funcionou.
- Não precisamos fazer ajustes adicionais no código entregue nessa etapa.

---

## 5. Análise crítica

**Benefícios**
- A IA ajudou a identificar problemas visuais que estavam espalhados pelo projeto, como vários estilos de botão e o uso de violeta em diferentes telas.
- Com as classes CSS, ficou mais fácil manter o padrão visual e fazer mudanças, porque não precisamos ajustar cada botão individualmente.
- Comparar as capturas de tela antes e depois ajudou a visualizar as mudanças e perceber o problema dos nomes das abas no celular.

**Limitações**
- A skill é voltada principalmente para landing pages, e o VIVVA é um aplicativo. Então, nem todas as recomendações serviam para o nosso caso, e tivemos que selecionar o que realmente fazia sentido.
- A IA não conseguia acessar o Waze, o painel do CGE ou o Supabase pelo ambiente usado. Por isso, essas integrações não foram testadas por ela e precisaram ser verificadas por nós.
- A IA não corrigiu os erros de lint que já existiam, porque estavam fora do escopo do redesign.
- Mesmo com a ajuda da IA, o código pode apresentar erros. Precisamos revisar, testar e entender o que foi feito, porque a responsabilidade pelo projeto final é nossa.

**Dificuldades**
- A skill estava instalada só no computador e não aparecia na sessão na nuvem. Foi preciso passar o link do repositório para ela ser instalada lá.
- Como foram 33 arquivos alterados, recebemos o código em quatro partes para aplicar no VS Code.

**Reflexão do grupo**
- Como usamos o Claude em praticamente todas as etapas, é importante que a gente entenda o código que foi gerado, tanto para explicar o projeto quanto para conseguir fazer alterações depois. Por isso, revisar e testar o que recebemos também fez parte do desenvolvimento.

---

## Observações
- Nenhum dado pessoal real foi enviado às ferramentas de IA.
- O assistente que aparece dentro do app **não** usa IA generativa: ele responde só a partir de uma base local de perguntas e respostas.
- O SOS é apenas demonstrativo. Em uma emergência real, ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia).
````
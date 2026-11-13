
import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, UserRound, RotateCcw, ChevronRight } from "lucide-react";

const BASE_CONHECIMENTO = [
  { categoria: "Sobre o VIVVA", pergunta: "O que é o VIVVA?", palavras: ["vivva", "projeto", "plataforma", "aplicativo", "o que e"], resposta: "O VIVVA é uma plataforma de apoio à autonomia e ao bem-estar. Ele reúne recursos de rotina, segurança e mobilidade em um só lugar, com informações que ajudam no planejamento do dia a dia." },
  { categoria: "Sobre o VIVVA", pergunta: "Quais funcionalidades estão disponíveis?", palavras: ["funcionalidades", "recursos", "modulos", "o que posso fazer"], resposta: "Atualmente, você encontra quatro áreas principais: Início, para acompanhar um resumo; Rotina, para organizar lembretes; Segurança, para manter contatos de apoio e acessar o SOS demonstrativo; e Mobilidade, para consultar clima, avisos e planejar trajetos." },
  { categoria: "Sobre o VIVVA", pergunta: "Como começo a usar a plataforma?", palavras: ["comecar", "comeco", "primeiro passo", "usar", "comecar usar"], resposta: "Comece pela página Início para conhecer os módulos. Depois, cadastre seus lembretes em Rotina, adicione pessoas de confiança em Segurança e consulte as condições do tempo e os trajetos em Mobilidade." },
  { categoria: "Rotina", pergunta: "Como criar um lembrete?", palavras: ["criar lembrete", "novo lembrete", "adicionar lembrete", "lembrete"], resposta: "Acesse Rotina e use a opção de adicionar lembrete. Informe o título e os dados solicitados e salve. O lembrete ficará disponível na sua lista para você acompanhar e marcar quando for concluído." },
  { categoria: "Rotina", pergunta: "Posso acompanhar tarefas concluídas?", palavras: ["tarefas concluidas", "concluir", "progresso", "acompanhar tarefas"], resposta: "Sim. Na área Rotina, você pode marcar os lembretes como concluídos. O progresso é atualizado conforme os itens são finalizados e também aparece no resumo da página Início." },
  { categoria: "Rotina", pergunta: "Posso editar ou excluir um lembrete?", palavras: ["editar lembrete", "alterar lembrete", "excluir lembrete", "apagar lembrete"], resposta: "Sim. Na lista de Rotina, utilize as ações disponíveis no cartão do lembrete para editar as informações ou removê-lo." },
  { categoria: "Rotina", pergunta: "O VIVVA envia notificações de lembretes?", palavras: ["notificacao", "notificacoes", "aviso de lembrete", "alarme"], resposta: "Nesta versão, os lembretes ficam organizados dentro da plataforma. Notificações automáticas do navegador ou do celular ainda não fazem parte das funcionalidades implementadas." },
  { categoria: "Segurança", pergunta: "Como cadastrar um contato de confiança?", palavras: ["cadastrar contato", "adicionar contato", "contato de confianca", "contato apoio"], resposta: "Entre em Segurança e escolha a opção para adicionar um contato. Preencha os dados solicitados e salve. A lista ajuda a manter as informações de pessoas de apoio acessíveis." },
  { categoria: "Segurança", pergunta: "O botão SOS chama a emergência?", palavras: ["sos", "emergencia", "chama policia", "liga", "socorro"], resposta: "Não nesta versão. O botão SOS é demonstrativo: ele registra uma ação na interface, mas não realiza ligações, não envia mensagens e não aciona serviços públicos. Em uma emergência real, procure diretamente os serviços oficiais da sua região." },
  { categoria: "Segurança", pergunta: "Meus contatos recebem alertas automaticamente?", palavras: ["contatos recebem", "envia alerta", "alerta automatico", "mensagem automatica"], resposta: "Ainda não. O cadastro mantém os contatos organizados, mas o envio automático de mensagens ou alertas não está implementado nesta versão." },
  { categoria: "Mobilidade", pergunta: "Como consultar o clima?", palavras: ["consultar clima", "previsao do tempo", "temperatura", "clima"], resposta: "Acesse Mobilidade. A página permite consultar as condições atuais e a previsão dos próximos dias para a cidade selecionada, além de exibir avisos relacionados ao clima." },
  { categoria: "Mobilidade", pergunta: "Como planejar um trajeto?", palavras: ["planejar trajeto", "trajeto", "rota", "caminho", "destino"], resposta: "Na área Mobilidade, informe o ponto de partida e o destino. Você poderá abrir a rota no Google Maps ou iniciar a navegação pelo Waze. Confira as condições do percurso diretamente no aplicativo de mapas antes de sair." },
  { categoria: "Mobilidade", pergunta: "O VIVVA calcula o trânsito em tempo real?", palavras: ["transito", "trafego", "tempo real", "engarrafamento"], resposta: "O VIVVA direciona a consulta de rotas para serviços de navegação. Informações de trânsito em tempo real, incidentes e recálculo de rota são fornecidos pelo Google Maps ou Waze, não pelo VIVVA." },
  { categoria: "Mobilidade", pergunta: "Os avisos climáticos garantem que o trajeto é seguro?", palavras: ["trajeto seguro", "seguranca trajeto", "garante seguranca", "risco"], resposta: "Não. Os avisos são informativos e ajudam no planejamento, mas não garantem a segurança do percurso. Consulte fontes oficiais, observe as condições locais e siga as orientações das autoridades." },
  { categoria: "Acessibilidade", pergunta: "O VIVVA foi pensado para acessibilidade?", palavras: ["acessibilidade", "acessivel", "deficiencia", "inclusao"], resposta: "A proposta do VIVVA é facilitar o acesso a informações e ferramentas do cotidiano. A interface deve ser utilizada com recursos como navegação por teclado, contraste adequado, textos claros e identificação acessível dos controles. A revisão de acessibilidade continua sendo parte importante da evolução do projeto." },
  { categoria: "Privacidade", pergunta: "Meus dados ficam protegidos?", palavras: ["privacidade", "dados", "protegidos", "seguranca dos dados", "informacoes pessoais"], resposta: "Evite inserir informações sensíveis desnecessárias. A proteção efetiva dos dados depende da implementação, do armazenamento e das permissões configuradas no projeto. Consulte a equipe responsável para conhecer a política de dados desta versão." },
];

const SUGESTOES = [
  "O que é o VIVVA?",
  "Como criar um lembrete?",
  "O botão SOS chama a emergência?",
  "Como planejar um trajeto?",
  "Como consultar o clima?",
  "Quais funcionalidades estão disponíveis?",
];

const normalizar = (valor) =>
  valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

function encontrarResposta(texto) {
  const consulta = normalizar(texto);
  if (!consulta) return null;

  const termos = consulta.split(" ").filter((termo) => termo.length > 2);
  let melhor = null;
  let maiorPontuacao = 0;

  BASE_CONHECIMENTO.forEach((item) => {
    const campos = [item.pergunta, ...item.palavras].map(normalizar);
    let pontos = 0;

    campos.forEach((campo) => {
      if (consulta.includes(campo) || campo.includes(consulta)) pontos += 4;
      pontos += termos.filter((termo) => campo.includes(termo)).length;
    });

    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      melhor = item;
    }
  });

  return maiorPontuacao >= 2 ? melhor : null;
}

export default function Assistente() {
  const [mensagem, setMensagem] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [conversa, setConversa] = useState([
    {
      tipo: "assistente",
      texto: "Olá! Sou a assistente virtual do VIVVA. Posso ajudar você a entender os recursos da plataforma, organizar sua rotina, conhecer as funções de segurança e planejar deslocamentos. O que você gostaria de saber?",
    },
  ]);

  const areaMensagensRef = useRef(null);

  const categorias = ["Todas", ...new Set(BASE_CONHECIMENTO.map((item) => item.categoria))];

  const perguntas = useMemo(
    () => BASE_CONHECIMENTO.filter((item) => categoria === "Todas" || item.categoria === categoria),
    [categoria]
  );

  useEffect(() => {
    const area = areaMensagensRef.current;
    if (area) area.scrollTo({ top: area.scrollHeight, behavior: "smooth" });
  }, [conversa]);

  const enviar = (texto = mensagem) => {
    const pergunta = texto.trim();
    if (!pergunta) return;

    const resultado = encontrarResposta(pergunta);

    const resposta = resultado
      ? resultado.resposta
      : "Ainda não encontrei uma resposta segura para essa pergunta na minha base de conhecimento. Você pode tentar usar termos como rotina, lembrete, SOS, contato, clima ou trajeto. Também estamos ampliando continuamente os assuntos disponíveis.";

    setConversa((atual) => [
      ...atual,
      { tipo: "usuario", texto: pergunta },
      { tipo: "assistente", texto: resposta },
    ]);

    setMensagem("");
  };

  const reiniciar = () => {
    setConversa([
      {
        tipo: "assistente",
        texto: "Conversa reiniciada! Como posso ajudar você?",
      },
    ]);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-auto mx-auto max-w-6xl">
      <header className="mb-6">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-forest dark:text-sage">
          <Sparkles size={16} /> Central de ajuda
        </p>
        <h1 className="text-4xl font-bold text-silver-metal md:text-5xl">Assistente virtual</h1>
        <p className="mt-2 max-w-2xl opacity-75">Tire dúvidas sobre os recursos do VIVVA e encontre orientações para usar cada módulo.</p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
        <div className="flex h-[min(680px,calc(100dvh-220px))] min-h-105 flex-col overflow-hidden rounded-3xl border border-silver/40 bg-white/70 shadow-xl backdrop-blur dark:bg-forest/65">
          <div className="flex shrink-0 items-center justify-between border-b border-silver/30 p-4">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-sage/30 p-3 text-forest dark:text-sage"><Bot size={23} /></span>
              <div>
                <h2 className="font-semibold">VIVVA Assist</h2>
                <p className="text-xs opacity-65">Assistente de informações</p>
              </div>
            </div>
            <button type="button" onClick={reiniciar} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm opacity-70 transition hover:bg-sage/20 hover:opacity-100">
              <RotateCcw size={16} /> Reiniciar
            </button>
          </div>

          <div ref={areaMensagensRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 md:p-6" aria-live="polite">
            {conversa.map((item, indice) => (
              <div key={`${indice}-${item.tipo}`} className={`flex gap-3 ${item.tipo === "usuario" ? "flex-row-reverse" : ""}`}>
                <span className={`h-fit shrink-0 rounded-xl p-2 ${item.tipo === "usuario" ? "bg-violet-500/15 text-violet-700 dark:text-violet-200" : "bg-sage/30 text-forest dark:text-sage"}`}>
                  {item.tipo === "usuario" ? <UserRound size={18} /> : <Bot size={18} />}
                </span>
                <div className={`max-w-[85%] wrap-break-word rounded-2xl px-4 py-3 text-sm leading-relaxed ${item.tipo === "usuario" ? "bg-violet-600 text-white" : "bg-black/5 dark:bg-white/10"}`}>
                  {item.texto} 
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); enviar(); }} className="flex shrink-0 gap-2 border-t border-silver/30 bg-white/50 p-4 dark:bg-forest/80">
            <input value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Escreva sua dúvida..." aria-label="Digite sua pergunta" className="min-w-0 flex-1 rounded-xl border border-silver/50 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-violet-500 dark:bg-moss/60" />
            <button type="submit" disabled={!mensagem.trim()} aria-label="Enviar pergunta" className="rounded-xl bg-forest px-4 text-white transition hover:bg-forest/85 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sage dark:text-moss">
              <Send size={19} />
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-silver/40 bg-white/70 p-5 backdrop-blur dark:bg-forest/65">
            <h2 className="mb-3 text-lg font-semibold">Perguntas sugeridas</h2>
            <div className="flex flex-col gap-2">
              {SUGESTOES.map((item) => (
                <button key={item} type="button" onClick={() => enviar(item)} className="flex items-center justify-between gap-2 rounded-xl border border-silver/30 p-3 text-left text-sm transition hover:border-sage hover:bg-sage/15">
                  {item}<ChevronRight size={16} className="shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-silver/40 bg-white/70 p-5 backdrop-blur dark:bg-forest/65">
            <h2 className="mb-3 text-lg font-semibold">Explorar por assunto</h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {categorias.map((item) => (
                <button key={item} type="button" onClick={() => setCategoria(item)} className={`rounded-full border px-3 py-1.5 text-xs transition ${categoria === item ? "border-forest bg-forest text-white dark:border-sage dark:bg-sage dark:text-moss" : "border-silver/50 hover:bg-sage/20"}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {perguntas.map((item) => (
                <button key={item.pergunta} type="button" onClick={() => enviar(item.pergunta)} className="block w-full rounded-xl bg-black/5 p-3 text-left text-sm transition hover:bg-sage/20 dark:bg-white/5">
                  {item.pergunta}
                </button>
              ))}
            </div>
          </div>

          <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed opacity-80">
            Esta versão utiliza uma base local de perguntas e respostas. Ela não é uma IA generativa e não substitui orientações de emergência ou informações oficiais.
          </p>
        </aside>
      </div>
    </motion.section>
  );
}

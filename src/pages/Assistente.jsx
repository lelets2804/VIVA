
import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TituloPagina from "../components/TituloPagina";
import { Bot, Send, UserRound, RotateCcw, ChevronRight } from "lucide-react";

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
      <header className="mb-10">
        <TituloPagina sobre="Central de ajuda" sub="Tire dúvidas sobre os recursos do VIVVA e veja como usar cada módulo.">Assistente</TituloPagina>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
        <div className="cartao flex h-[min(680px,calc(100dvh-220px))] min-h-105 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-silver/30 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-pearl-light dark:bg-sage dark:text-moss"><Bot size={22} /></span>
              <div>
                <h2 className="text-xl">VIVVA Assist</h2>
                <p className="text-sm opacity-70">Respostas sobre o app, sem IA externa</p>
              </div>
            </div>
            <button type="button" onClick={reiniciar} className="btn min-h-11 px-3 text-sm font-medium opacity-80 hover:bg-sage/20 hover:opacity-100">
              <RotateCcw size={16} /> Reiniciar
            </button>
          </div>

          <div ref={areaMensagensRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 md:p-6" aria-live="polite">
            {conversa.map((item, indice) => (
              <div key={`${indice}-${item.tipo}`} className={`flex gap-3 ${item.tipo === "usuario" ? "flex-row-reverse" : ""}`}>
                <span className={`h-fit shrink-0 rounded-xl p-2 ${item.tipo === "usuario" ? "bg-ambar/25 text-ambar-deep dark:text-ambar" : "bg-sage/25 text-forest dark:text-sage"}`}>
                  {item.tipo === "usuario" ? <UserRound size={18} /> : <Bot size={18} />}
                </span>
                <div className={`max-w-[85%] wrap-break-word rounded-2xl px-4 py-3 leading-relaxed ${item.tipo === "usuario" ? "rounded-tr-md bg-forest text-pearl-light dark:bg-sage dark:text-moss" : "rounded-tl-md bg-moss/6 dark:bg-white/8"}`}>
                  {item.texto}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); enviar(); }} className="flex shrink-0 gap-2 border-t border-moss/10 p-3 md:p-4 dark:border-white/10">
            <input value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Escreva sua dúvida..." aria-label="Digite sua pergunta" className="campo min-w-0 flex-1" />
            <button type="submit" disabled={!mensagem.trim()} aria-label="Enviar pergunta" className="btn btn-primario min-h-12 w-12 shrink-0 px-0">
              <Send size={19} />
            </button>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="cartao p-5">
            <h2 className="mb-4 text-xl">Perguntas sugeridas</h2>
            <div className="flex flex-col gap-2">
              {SUGESTOES.map((item) => (
                <button key={item} type="button" onClick={() => enviar(item)} className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-moss/10 p-3 text-left text-[0.9375rem] transition hover:border-sage hover:bg-sage/15 dark:border-white/10">
                  {item}<ChevronRight size={16} className="shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          <div className="cartao p-5">
            <h2 className="mb-4 text-xl">Explorar por assunto</h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {categorias.map((item) => (
                <button key={item} type="button" onClick={() => setCategoria(item)} aria-pressed={categoria === item} className="chip min-h-9 px-3 py-1 text-sm">
                  {item}
                </button>
              ))}
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {perguntas.map((item) => (
                <button key={item.pergunta} type="button" onClick={() => enviar(item.pergunta)} className="block min-h-11 w-full rounded-xl bg-moss/5 p-3 text-left text-[0.9375rem] transition hover:bg-sage/20 dark:bg-white/5">
                  {item.pergunta}
                </button>
              ))}
            </div>
          </div>

          <p className="nota-atencao text-sm leading-relaxed">
            Esta versão utiliza uma base local de perguntas e respostas. Ela não é uma IA generativa e não substitui orientações de emergência ou informações oficiais.
          </p>
        </aside>
      </div>
    </motion.section>
  );
}

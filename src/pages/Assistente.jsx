import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import useCena from "../hooks/useCena";
import useClima from "../hooks/useClima";
import useContatos from "../hooks/useContatos";
import useTrajeto from "../hooks/useTrajeto";
import useReducedMotion from "../hooks/useReducedMotion";
import { analisarPadroes } from "../utils/padroes";
import { responder, SUGESTOES } from "../utils/assistente";
import TituloPagina from "../components/TituloPagina";

const BOAS_VINDAS = { id: "0", autor: "vivva", texto: "Olá! Sou a VIVVA. Posso falar do clima, listar suas tarefas, criar lembretes, resumir seu dia e mostrar seus padrões. Experimente uma das sugestões abaixo." };

export default function Assistente() {
  const { rotina, hora } = useCena();
  const { cidade, dados, ar } = useClima();
  const { contatos } = useContatos();
  const { historico } = useTrajeto();
  const calmo = useReducedMotion();
  const [mensagens, setMensagens] = useState([BOAS_VINDAS]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const fim = useRef(null);

  useEffect(() => { fim.current?.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "end" }); }, [mensagens, pensando, calmo]);

  const enviar = async (conteudo) => {
    const pergunta = conteudo.trim();
    if (!pergunta || pensando) return;
    setTexto("");
    setMensagens((m) => [...m, { id: crypto.randomUUID(), autor: "voce", texto: pergunta }]);
    setPensando(true);
    const ctx = { dados, ar, cidade, hora, lembretes: rotina.lembretes, contatos, trajetos: historico, analise: analisarPadroes(rotina.lembretes, historico) };
    const r = responder(pergunta, ctx);
    if (r.acao?.tipo === "criar-lembrete") await rotina.adicionar(r.acao.dados);
    else await new Promise((ok) => setTimeout(ok, 350));
    setMensagens((m) => [...m, { id: crypto.randomUUID(), autor: "vivva", texto: r.texto }]);
    setPensando(false);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex max-w-3xl flex-col">
      <header className="mb-4"><TituloPagina sub="Converse com a VIVVA sobre clima, rotina e seus hábitos.">Assistente</TituloPagina></header>
      <div role="log" aria-live="polite" aria-label="Conversa com a VIVVA" className="flex h-[55vh] flex-col gap-3 overflow-y-auto rounded-3xl border border-silver/40 bg-pearl-light/70 p-4 backdrop-blur dark:bg-forest/50">
        {mensagens.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-end gap-2 ${m.autor === "voce" ? "flex-row-reverse" : ""}`}>
            <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.autor === "voce" ? "bg-violet-glow text-white" : "bg-sage text-moss"}`}>{m.autor === "voce" ? <User size={16} /> : <Bot size={16} />}</span>
            <p className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm ${m.autor === "voce" ? "bg-violet-glow/25" : "bg-black/10 dark:bg-white/10"}`}>{m.texto}</p>
          </motion.div>
        ))}
        {pensando && <p className="text-sm opacity-70" aria-live="polite">VIVVA está digitando…</p>}
        <div ref={fim} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGESTOES.map((s) => <button key={s} onClick={() => enviar(s)} disabled={pensando} className="rounded-full border border-silver/40 px-3 py-1 text-sm hover:bg-sage/15 disabled:opacity-60">{s}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); enviar(texto); }} className="mt-3 flex gap-2">
        <label htmlFor="msg-assistente" className="sr-only">Mensagem para a VIVVA</label>
        <input id="msg-assistente" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva sua mensagem…" autoComplete="off" className="w-full rounded-xl border border-silver/60 bg-pearl-light px-4 py-3 outline-none focus:border-violet-glow focus:ring-2 focus:ring-violet-glow/40 dark:bg-moss" />
        <button type="submit" disabled={pensando || !texto.trim()} className="flex shrink-0 items-center gap-2 rounded-xl bg-sage px-5 py-3 font-semibold text-moss hover:brightness-110 disabled:opacity-60"><Send size={18} />Enviar</button>
      </form>
      <p className="mt-3 text-xs opacity-70">A VIVVA entende comandos simples e funciona no seu navegador, sem enviar suas conversas a nenhum servidor. Não substitui orientação médica; em emergências, ligue 192, 193 ou 190.</p>
    </motion.section>
  );
}
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Info } from "lucide-react";
import useContatos from "../hooks/useContatos";
import useAlertas from "../hooks/useAlertas";
import ContatoCard from "../components/ContatoCard";
import ContatoModal from "../components/ContatoModal";
import BotaoSOS from "../components/BotaoSOS";
import HistoricoAlertas from "../components/HistoricoAlertas";
import TituloPagina from "../components/TituloPagina";

export default function Seguranca() {
  const { contatos, carregando, erro, adicionar, editar, remover } = useContatos();
  const { alertas, carregando: carregandoAlertas, erro: erroAlertas, acionarSOS } = useAlertas();
  const [modal, setModal] = useState(null);

  const salvar = async (dados) => { if (modal?.id) await editar(modal.id, dados); else await adicionar(dados); setModal(null); };

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <header className="mb-6"><TituloPagina sub="Seus contatos de apoio e um alerta de demonstração.">Segurança</TituloPagina></header>
      <p role="note" className="mb-8 flex items-start gap-3 rounded-2xl border border-violet-glow/50 bg-violet-glow/10 p-4 text-sm"><Info size={20} className="mt-0.5 shrink-0" /><span><strong>Função demonstrativa.</strong> O botão SOS apenas registra um alerta neste site: ele não liga para emergência, não envia SMS e não avisa seus contatos. Em uma emergência real, ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia).</span></p>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center rounded-3xl border border-silver/40 bg-pearl-light/70 p-6 backdrop-blur dark:bg-forest/50"><BotaoSOS aoConfirmar={() => acionarSOS(contatos.length)} totalContatos={contatos.length} /></div>
          <div>
            <h2 className="mb-3 text-xl font-semibold">Histórico de alertas</h2>
            {erroAlertas && <p role="alert" className="mb-3 rounded-xl border border-red-400/60 bg-red-500/10 p-3 text-sm">{erroAlertas}</p>}
            <HistoricoAlertas alertas={alertas} carregando={carregandoAlertas} />
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Contatos de apoio</h2><button onClick={() => setModal({})} className="flex items-center gap-2 rounded-xl bg-sage px-4 py-2 font-semibold text-moss transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-violet-glow"><Plus size={18} />Novo contato</button></div>
          {erro && <p role="alert" className="mb-4 rounded-xl border border-red-400/60 bg-red-500/10 p-3 text-sm">{erro}</p>}
          {carregando ? <p className="opacity-70">Carregando…</p> : contatos.length === 0 ? <p className="rounded-2xl border border-dashed border-silver/50 p-8 text-center opacity-70">Nenhum contato ainda. Adicione alguém de confiança em “Novo contato”.</p> : (
            <ul className="flex flex-col gap-3"><AnimatePresence>{contatos.map((c) => <ContatoCard key={c.id} contato={c} aoEditar={setModal} aoExcluir={remover} />)}</AnimatePresence></ul>
          )}
          <p className="mt-4 text-xs opacity-70">Os contatos ficam salvos apenas neste navegador.</p>
        </div>
      </div>
      <AnimatePresence>{modal && <ContatoModal key={modal.id || "novo"} contato={modal.id ? modal : null} aoSalvar={salvar} aoFechar={() => setModal(null)} />}</AnimatePresence>
    </motion.section>
  );
}
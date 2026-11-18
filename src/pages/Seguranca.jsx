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
      <header className="mb-8"><TituloPagina sobre="Módulo 02" sub="Pessoas de confiança sempre à mão e um alerta de demonstração.">Segurança</TituloPagina></header>
      <p role="note" className="nota-atencao mb-8 leading-relaxed"><Info size={20} className="mt-0.5 shrink-0 text-ambar-deep dark:text-ambar" /><span><strong>Função demonstrativa.</strong> O botão SOS apenas registra um alerta neste site: ele não liga para emergência, não envia SMS e não avisa seus contatos. Em uma emergência real, ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia).</span></p>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="cartao flex flex-col items-center p-6"><BotaoSOS aoConfirmar={() => acionarSOS(contatos.length)} totalContatos={contatos.length} /></div>
          <div>
            <h2 className="mb-4 text-2xl">Histórico de alertas</h2>
            {erroAlertas && <p role="alert" className="nota-erro mb-3">{erroAlertas}</p>}
            <HistoricoAlertas alertas={alertas} carregando={carregandoAlertas} />
          </div>
        </div>
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl">Contatos de apoio</h2><button onClick={() => setModal({})} className="btn btn-primario"><Plus size={18} />Novo contato</button></div>
          {erro && <p role="alert" className="nota-erro mb-4">{erro}</p>}
          {carregando ? <p className="opacity-70">Carregando…</p> : contatos.length === 0 ? <p className="vazio">Nenhum contato ainda. Adicione alguém de confiança em “Novo contato”.</p> : (
            <ul className="flex flex-col gap-3"><AnimatePresence>{contatos.map((c) => <ContatoCard key={c.id} contato={c} aoEditar={setModal} aoExcluir={remover} />)}</AnimatePresence></ul>
          )}
          <p className="mt-4 text-sm opacity-70">Os contatos ficam salvos apenas neste navegador.</p>
        </div>
      </div>
      <AnimatePresence>{modal && <ContatoModal key={modal.id || "novo"} contato={modal.id ? modal : null} aoSalvar={salvar} aoFechar={() => setModal(null)} />}</AnimatePresence>
    </motion.section>
  );
}
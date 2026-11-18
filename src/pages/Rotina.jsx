import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import useCena from "../hooks/useCena";
import useRajadas from "../hooks/useRajadas";
import useReducedMotion from "../hooks/useReducedMotion";
import LembreteCard from "../components/LembreteCard";
import LembreteModal from "../components/LembreteModal";
import ProgressRing from "../components/ProgressRing";
import RajadaParticulas from "../components/RajadaParticulas";
import TituloPagina from "../components/TituloPagina";

const FILTROS = [{ id: "todos", nome: "Todos" }, { id: "pendentes", nome: "Pendentes" }, { id: "concluidos", nome: "Concluídos" }];

export default function Rotina() {
  const { lembretes, carregando, erro, adicionar, editar, alternar, remover, total, concluidos, progresso } = useCena().rotina;
  const { rajadas, disparar } = useRajadas();
  const calmo = useReducedMotion();
  const [filtro, setFiltro] = useState("todos");
  const [modal, setModal] = useState(null);

  const visiveis = lembretes.filter((l) => filtro === "todos" || (filtro === "pendentes" ? !l.concluido : l.concluido));
  const aoAlternar = (id, e) => { const l = lembretes.find((x) => x.id === id); if (l && !l.concluido && !calmo) { const r = e.currentTarget.getBoundingClientRect(); disparar(r.left + r.width / 2, r.top + r.height / 2); } alternar(id); };
  const salvar = async (dados) => { const sucesso = modal?.id ? await editar(modal.id, dados) : await adicionar(dados); if (sucesso) setModal(null);};

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <TituloPagina sobre="Módulo 01" sub="Seus lembretes e tarefas do dia, do remédio da manhã à consulta da tarde.">Rotina</TituloPagina>
        <button onClick={() => setModal({})} className="btn btn-primario"><Plus size={20} />Novo lembrete</button>
      </header>
      <div className="grid gap-6 md:grid-cols-[15rem_1fr] md:gap-8">
        <aside className="cartao flex flex-row items-center gap-5 self-start p-5 md:flex-col md:p-6">
          <ProgressRing valor={progresso} />
          <div className="md:text-center"><p className="font-semibold">Progresso de hoje</p><p className="text-sm opacity-75">{concluidos} de {total} concluídos</p></div>
        </aside>
        <div>
          <div role="group" aria-label="Filtrar lembretes" className="mb-4 flex flex-wrap gap-2">
            {FILTROS.map((f) => <button key={f.id} onClick={() => setFiltro(f.id)} aria-pressed={filtro === f.id} className="chip">{f.nome}</button>)}
          </div>
          {erro && <p role="alert" className="nota-erro mb-4">{erro}</p>}
          {carregando ? <p className="opacity-70">Carregando…</p> : visiveis.length === 0 ? <p className="vazio">{total === 0 ? "Nenhum lembrete ainda. Crie o primeiro em “Novo lembrete”." : "Nenhum lembrete neste filtro."}</p> : (
            <ul className="flex flex-col gap-3"><AnimatePresence>{visiveis.map((l) => <LembreteCard key={l.id} lembrete={l} aoAlternar={aoAlternar} aoEditar={setModal} aoExcluir={remover} />)}</AnimatePresence></ul>
          )}
        </div>
      </div>
      <AnimatePresence>{modal && <LembreteModal key={modal.id || "novo"} lembrete={modal.id ? modal : null} aoSalvar={salvar} aoFechar={() => setModal(null)} />}</AnimatePresence>
      <RajadaParticulas rajadas={rajadas} />
    </motion.section>
  );
}
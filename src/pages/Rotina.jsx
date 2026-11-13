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
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <TituloPagina sub="Seus lembretes e tarefas do dia.">Rotina</TituloPagina>
        <button onClick={() => setModal({})} className="flex items-center gap-2 rounded-xl bg-sage px-5 py-3 font-semibold text-moss transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-violet-glow"><Plus size={20} />Novo lembrete</button>
      </header>
      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <aside className="flex flex-col items-center gap-4 self-start rounded-3xl border border-silver/40 bg-pearl-light/70 p-6 backdrop-blur dark:bg-forest/50">
          <ProgressRing valor={progresso} />
          <p className="text-center text-sm opacity-80">{concluidos} de {total} concluídos</p>
        </aside>
        <div>
          <div role="group" aria-label="Filtrar lembretes" className="mb-4 flex flex-wrap gap-2">
            {FILTROS.map((f) => <button key={f.id} onClick={() => setFiltro(f.id)} aria-pressed={filtro === f.id} className={`rounded-full border px-4 py-2 text-sm transition ${filtro === f.id ? "border-sage bg-sage/30 font-semibold" : "border-silver/40 hover:bg-sage/15"}`}>{f.nome}</button>)}
          </div>
          {erro && <p role="alert" className="mb-4 rounded-xl border border-red-400/60 bg-red-500/10 p-3 text-sm">{erro}</p>}
          {carregando ? <p className="opacity-70">Carregando…</p> : visiveis.length === 0 ? <p className="rounded-2xl border border-dashed border-silver/50 p-8 text-center opacity-70">{total === 0 ? "Nenhum lembrete ainda. Crie o primeiro em “Novo lembrete”." : "Nenhum lembrete neste filtro."}</p> : (
            <ul className="flex flex-col gap-3"><AnimatePresence>{visiveis.map((l) => <LembreteCard key={l.id} lembrete={l} aoAlternar={aoAlternar} aoEditar={setModal} aoExcluir={remover} />)}</AnimatePresence></ul>
          )}
        </div>
      </div>
      <AnimatePresence>{modal && <LembreteModal key={modal.id || "novo"} lembrete={modal.id ? modal : null} aoSalvar={salvar} aoFechar={() => setModal(null)} />}</AnimatePresence>
      <RajadaParticulas rajadas={rajadas} />
    </motion.section>
  );
}
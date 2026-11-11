import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";

const formatar = (iso) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function HistoricoAlertas({ alertas, carregando }) {
  if (carregando) return <p className="opacity-70">Carregando…</p>;
  if (alertas.length === 0) return <p className="rounded-2xl border border-dashed border-silver/50 p-6 text-center opacity-70">Nenhum alerta registrado ainda.</p>;
  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence>
        {alertas.slice(0, 10).map((a) => (
          <motion.li key={a.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-xl border border-silver/40 bg-pearl-light/70 p-3 text-sm dark:bg-forest/50">
            <History size={18} className="shrink-0 text-violet-glow" />
            <span className="flex-1"><strong>{formatar(a.criadoEm)}</strong><br /><span className="opacity-80">Registrado só neste site. Nenhum contato foi acionado.</span></span>
            <span className="rounded-full border border-violet-glow/60 px-2 py-0.5 text-xs">Demonstração</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
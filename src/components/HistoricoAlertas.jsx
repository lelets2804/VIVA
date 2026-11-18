import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";

const formatar = (iso) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function HistoricoAlertas({ alertas, carregando }) {
  if (carregando) return <p className="opacity-70">Carregando…</p>;
  if (alertas.length === 0) return <p className="vazio">Nenhum alerta registrado ainda.</p>;
  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence>
        {alertas.slice(0, 10).map((a) => (
          <motion.li key={a.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="cartao flex items-center gap-3 rounded-2xl! p-3.5 text-sm">
            <History size={18} className="shrink-0 text-coral" />
            <span className="flex-1"><strong>{formatar(a.criadoEm)}</strong><br /><span className="opacity-80">Registrado só neste site. Nenhum contato foi acionado.</span></span>
            <span className="etiqueta">Demonstração</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
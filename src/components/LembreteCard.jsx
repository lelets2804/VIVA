import { motion } from "framer-motion";
import { Check, Pencil, Trash2, Clock } from "lucide-react";

export default function LembreteCard({ lembrete, aoAlternar, aoEditar, aoExcluir }) {
  const { id, titulo, horario, categoria, concluido } = lembrete;
  return (
    <motion.li layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} whileHover={{ y: -3 }} className={`flex items-center gap-4 rounded-2xl border p-4 backdrop-blur transition-colors ${concluido ? "border-sage/40 bg-sage/10" : "border-silver/40 bg-pearl-light/70 dark:bg-forest/50"}`}>
      <button onClick={(e) => aoAlternar(id, e)} aria-pressed={concluido} aria-label={concluido ? `Desmarcar ${titulo}` : `Concluir ${titulo}`} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${concluido ? "border-sage bg-sage text-moss" : "border-silver hover:border-sage"}`}>
        {concluido && <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}><Check size={20} /></motion.span>}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${concluido ? "line-through opacity-60" : ""}`}>{titulo}</p>
        <p className="flex items-center gap-2 text-sm opacity-70">{horario && <span className="flex items-center gap-1"><Clock size={14} />{horario}</span>}<span className="rounded-full bg-violet-glow/20 px-2 py-0.5 text-xs">{categoria}</span></p>
      </div>
      <button onClick={() => aoEditar(lembrete)} aria-label={`Editar ${titulo}`} className="rounded-lg p-2 hover:bg-sage/30"><Pencil size={18} /></button>
      <button onClick={() => aoExcluir(id)} aria-label={`Excluir ${titulo}`} className="rounded-lg p-2 hover:bg-red-500/20"><Trash2 size={18} /></button>
    </motion.li>
  );
}
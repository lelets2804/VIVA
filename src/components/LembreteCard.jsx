import { motion } from "framer-motion";
import { Check, Pencil, Trash2, Clock } from "lucide-react";

export default function LembreteCard({ lembrete, aoAlternar, aoEditar, aoExcluir }) {
  const { id, titulo, horario, categoria, concluido } = lembrete;
  return (
    <motion.li layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className={`cartao flex items-center gap-3 rounded-2xl! p-3 pl-4 transition-colors md:gap-4 ${concluido ? "opacity-80" : ""}`}>
      <button onClick={(e) => aoAlternar(id, e)} aria-pressed={concluido} aria-label={concluido ? `Desmarcar ${titulo}` : `Concluir ${titulo}`} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90 ${concluido ? "border-sage-deep bg-sage-deep text-white dark:border-sage dark:bg-sage dark:text-moss" : "border-moss/30 hover:border-sage-deep hover:bg-sage/15 dark:border-white/30 dark:hover:border-sage"}`}>
        {concluido && <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}><Check size={20} /></motion.span>}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[1.0625rem] font-semibold ${concluido ? "line-through decoration-2 opacity-60" : ""}`}>{titulo}</p>
        <p className="mt-0.5 flex items-center gap-2 text-sm">{horario && <span className="flex items-center gap-1 tabular-nums opacity-75"><Clock size={14} />{horario}</span>}<span className="etiqueta">{categoria}</span></p>
      </div>
      <button onClick={() => aoEditar(lembrete)} aria-label={`Editar ${titulo}`} className="btn-icone"><Pencil size={18} /></button>
      <button onClick={() => aoExcluir(id)} aria-label={`Excluir ${titulo}`} className="btn-icone perigo"><Trash2 size={18} /></button>
    </motion.li>
  );
}
import { motion } from "framer-motion";
import { Pencil, Trash2, Phone } from "lucide-react";

export default function ContatoCard({ contato, aoEditar, aoExcluir }) {
  const { id, nome, telefone, relacao } = contato;
  return (
    <motion.li layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="cartao flex items-center gap-3 rounded-2xl! p-3 pl-4 md:gap-4">
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest font-display text-xl text-pearl-light dark:bg-sage dark:text-moss">{nome.charAt(0).toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[1.0625rem] font-semibold">{nome}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm"><span className="flex items-center gap-1 tabular-nums opacity-75"><Phone size={14} />{telefone}</span><span className="etiqueta">{relacao}</span></p>
      </div>
      <button onClick={() => aoEditar(contato)} aria-label={`Editar ${nome}`} className="btn-icone"><Pencil size={18} /></button>
      <button onClick={() => aoExcluir(id)} aria-label={`Excluir ${nome}`} className="btn-icone perigo"><Trash2 size={18} /></button>
    </motion.li>
  );
}
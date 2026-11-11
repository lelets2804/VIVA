import { motion } from "framer-motion";
import { Pencil, Trash2, Phone } from "lucide-react";

export default function ContatoCard({ contato, aoEditar, aoExcluir }) {
  const { id, nome, telefone, relacao } = contato;
  return (
    <motion.li layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} whileHover={{ y: -3 }} className="flex items-center gap-4 rounded-2xl border border-silver/40 bg-pearl-light/70 p-4 backdrop-blur dark:bg-forest/50">
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-glow/25 text-lg font-bold">{nome.charAt(0).toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{nome}</p>
        <p className="flex flex-wrap items-center gap-2 text-sm opacity-80"><span className="flex items-center gap-1"><Phone size={14} />{telefone}</span><span className="rounded-full bg-violet-glow/20 px-2 py-0.5 text-xs">{relacao}</span></p>
      </div>
      <button onClick={() => aoEditar(contato)} aria-label={`Editar ${nome}`} className="rounded-lg p-2 hover:bg-sage/30"><Pencil size={18} /></button>
      <button onClick={() => aoExcluir(id)} aria-label={`Excluir ${nome}`} className="rounded-lg p-2 hover:bg-red-500/20"><Trash2 size={18} /></button>
    </motion.li>
  );
}
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const CATEGORIAS = ["Medicamento", "Consulta", "Compromisso", "Pessoal"];
const campo = "w-full rounded-xl border border-silver/60 bg-pearl-light px-4 py-3 outline-none focus:border-violet-glow focus:ring-2 focus:ring-violet-glow/40 dark:bg-moss";

export default function LembreteModal({ lembrete, aoSalvar, aoFechar }) {
  const [titulo, setTitulo] = useState(lembrete?.titulo || "");
  const [horario, setHorario] = useState(lembrete?.horario || "");
  const [categoria, setCategoria] = useState(lembrete?.categoria || "Pessoal");
  const [erro, setErro] = useState("");

  useEffect(() => { const tecla = (e) => e.key === "Escape" && aoFechar(); window.addEventListener("keydown", tecla); return () => window.removeEventListener("keydown", tecla); }, [aoFechar]);

  const enviar = (e) => { e.preventDefault(); if (titulo.trim().length < 3) { setErro("Escreva pelo menos 3 letras no título."); return; } aoSalvar({ titulo: titulo.trim(), horario, categoria }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.form role="dialog" aria-modal="true" aria-labelledby="titulo-modal" onClick={(e) => e.stopPropagation()} onSubmit={enviar} initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="w-full max-w-md rounded-3xl border border-silver/40 bg-pearl p-6 shadow-2xl dark:bg-forest">
        <div className="mb-5 flex items-center justify-between"><h2 id="titulo-modal" className="text-2xl font-bold">{lembrete ? "Editar lembrete" : "Novo lembrete"}</h2><button type="button" onClick={aoFechar} aria-label="Fechar" className="rounded-lg p-2 hover:bg-sage/30"><X size={20} /></button></div>
        <label className="mb-4 block"><span className="mb-1 block text-sm font-medium">Título</span><input autoFocus value={titulo} onChange={(e) => { setTitulo(e.target.value); setErro(""); }} placeholder="Ex.: Tomar o remédio da pressão" aria-invalid={Boolean(erro)} className={campo} /></label>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-sm font-medium">Horário</span><input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} className={campo} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium">Categoria</span><select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={campo}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>
        {erro && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{erro}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={aoFechar} className="rounded-xl border border-silver/60 px-5 py-3 hover:bg-sage/15">Cancelar</button><button type="submit" className="rounded-xl bg-sage px-5 py-3 font-semibold text-moss hover:brightness-110">Salvar</button></div>
      </motion.form>
    </motion.div>
  );
}
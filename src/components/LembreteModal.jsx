
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

  useEffect(() => {
    const tecla = (e) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aoFechar]);

  const enviar = (e) => {
    e.preventDefault();

    const tituloLimpo = titulo.trim();

    if (tituloLimpo.length < 3) {
      setErro("O título precisa ter pelo menos 3 caracteres.");
      return;
    }

    if (tituloLimpo.length > 80) {
      setErro("O título deve ter no máximo 80 caracteres.");
      return;
    }

    if (!CATEGORIAS.includes(categoria)) {
      setErro("Selecione uma categoria válida.");
      return;
    }

    if (horario && !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
      setErro("Informe um horário válido.");
      return;
    }

    setErro("");
    aoSalvar({ titulo: tituloLimpo, horario, categoria });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.form role="dialog" aria-modal="true" aria-labelledby="titulo-modal" noValidate onClick={(e) => e.stopPropagation()} onSubmit={enviar} initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="w-full max-w-md rounded-3xl border border-silver/40 bg-pearl p-6 shadow-2xl dark:bg-forest">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="titulo-modal" className="text-2xl font-bold">{lembrete ? "Editar lembrete" : "Novo lembrete"}</h2>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="rounded-lg p-2 hover:bg-sage/30"><X size={20} /></button>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Título</span>
          <input autoFocus required maxLength={80} value={titulo} onChange={(e) => { setTitulo(e.target.value); setErro(""); }} placeholder="Ex.: Tomar o remédio da pressão" aria-invalid={Boolean(erro)} aria-describedby={erro ? "erro-lembrete" : undefined} className={campo} />
          <span className="mt-1 block text-right text-xs opacity-60">{titulo.length}/80 caracteres</span>
        </label>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Horário</span>
            <input type="time" value={horario} onChange={(e) => { setHorario(e.target.value); setErro(""); }} className={campo} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Categoria</span>
            <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setErro(""); }} className={campo}>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        {erro && <p id="erro-lembrete" role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{erro}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={aoFechar} className="rounded-xl border border-silver/60 px-5 py-3 hover:bg-sage/15">Cancelar</button>
          <button type="submit" className="rounded-xl bg-sage px-5 py-3 font-semibold text-moss hover:brightness-110">Salvar</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

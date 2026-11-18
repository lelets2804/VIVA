import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const CATEGORIAS = ["Medicamento", "Consulta", "Compromisso", "Pessoal"];

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} className="fixed inset-0 z-60 flex items-end justify-center bg-moss/60 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.form role="dialog" aria-modal="true" aria-labelledby="titulo-modal" noValidate onClick={(e) => e.stopPropagation()} onSubmit={enviar} initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="modal">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="titulo-modal" className="font-display text-3xl tracking-tight">{lembrete ? "Editar lembrete" : "Novo lembrete"}</h2>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="btn-icone -mr-2"><X size={20} /></button>
        </div>

        <label className="mb-4 block">
          <span className="rotulo">Título</span>
          <input autoFocus required maxLength={80} value={titulo} onChange={(e) => { setTitulo(e.target.value); setErro(""); }} placeholder="Ex.: Tomar o remédio da pressão" aria-invalid={Boolean(erro)} aria-describedby={erro ? "erro-lembrete" : undefined} className="campo" />
          <span className="mt-1 block text-right text-xs opacity-60">{titulo.length}/80 caracteres</span>
        </label>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="rotulo">Horário</span>
            <input type="time" value={horario} onChange={(e) => { setHorario(e.target.value); setErro(""); }} className="campo" />
          </label>
          <label className="block">
            <span className="rotulo">Categoria</span>
            <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setErro(""); }} className="campo">
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        {erro && <p id="erro-lembrete" role="alert" className="erro-campo mb-4 mt-0!">{erro}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={aoFechar} className="btn btn-secundario">Cancelar</button>
          <button type="submit" className="btn btn-primario">Salvar</button>
        </div>
      </motion.form>
    </motion.div>
  );
}
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const RELACOES = ["Família", "Amigo(a)", "Vizinho(a)", "Cuidador(a)", "Médico(a)", "Outro"];
const campo = "w-full rounded-xl border border-silver/60 bg-pearl-light px-4 py-3 outline-none focus:border-violet-glow focus:ring-2 focus:ring-violet-glow/40 dark:bg-moss";

export default function ContatoModal({ contato, aoSalvar, aoFechar }) {
  const [nome, setNome] = useState(contato?.nome || "");
  const [telefone, setTelefone] = useState(contato?.telefone || "");
  const [relacao, setRelacao] = useState(contato?.relacao || "Família");
  const [erros, setErros] = useState({});

  useEffect(() => { const tecla = (e) => e.key === "Escape" && aoFechar(); window.addEventListener("keydown", tecla); return () => window.removeEventListener("keydown", tecla); }, [aoFechar]);

  const enviar = (e) => {
    e.preventDefault();
    const novos = {};
    if (nome.trim().length < 2) novos.nome = "Escreva o nome do contato.";
    const digitos = telefone.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 11) novos.telefone = "Digite o telefone com DDD, por exemplo (11) 91234-5678.";
    setErros(novos);
    if (Object.keys(novos).length === 0) aoSalvar({ nome: nome.trim(), telefone: telefone.trim(), relacao });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.form role="dialog" aria-modal="true" aria-labelledby="titulo-contato" onClick={(e) => e.stopPropagation()} onSubmit={enviar} noValidate initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="w-full max-w-md rounded-3xl border border-silver/40 bg-pearl p-6 shadow-2xl dark:bg-forest">
        <div className="mb-5 flex items-center justify-between"><h2 id="titulo-contato" className="text-2xl font-bold">{contato ? "Editar contato" : "Novo contato de apoio"}</h2><button type="button" onClick={aoFechar} aria-label="Fechar" className="rounded-lg p-2 hover:bg-sage/30"><X size={20} /></button></div>
        <label className="mb-4 block"><span className="mb-1 block text-sm font-medium">Nome</span><input autoFocus value={nome} onChange={(e) => { setNome(e.target.value); setErros((x) => ({ ...x, nome: "" })); }} aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? "erro-nome" : undefined} className={campo} />{erros.nome && <p id="erro-nome" role="alert" className="mt-1 text-sm text-red-700 dark:text-red-300">{erros.nome}</p>}</label>
        <label className="mb-4 block"><span className="mb-1 block text-sm font-medium">Telefone</span><input type="tel" inputMode="tel" autoComplete="off" value={telefone} onChange={(e) => { setTelefone(e.target.value); setErros((x) => ({ ...x, telefone: "" })); }} placeholder="(11) 91234-5678" aria-invalid={Boolean(erros.telefone)} aria-describedby={erros.telefone ? "erro-telefone" : undefined} className={campo} />{erros.telefone && <p id="erro-telefone" role="alert" className="mt-1 text-sm text-red-700 dark:text-red-300">{erros.telefone}</p>}</label>
        <label className="mb-6 block"><span className="mb-1 block text-sm font-medium">Relação</span><select value={relacao} onChange={(e) => setRelacao(e.target.value)} className={campo}>{RELACOES.map((r) => <option key={r}>{r}</option>)}</select></label>
        <div className="flex justify-end gap-3"><button type="button" onClick={aoFechar} className="rounded-xl border border-silver/60 px-5 py-3 hover:bg-sage/15">Cancelar</button><button type="submit" className="rounded-xl bg-sage px-5 py-3 font-semibold text-moss hover:brightness-110">Salvar</button></div>
      </motion.form>
    </motion.div>
  );
}
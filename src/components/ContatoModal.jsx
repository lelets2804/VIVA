import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const RELACOES = ["Família", "Amigo(a)", "Vizinho(a)", "Cuidador(a)", "Médico(a)", "Outro"];

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} className="fixed inset-0 z-60 flex items-end justify-center bg-moss/60 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.form role="dialog" aria-modal="true" aria-labelledby="titulo-contato" onClick={(e) => e.stopPropagation()} onSubmit={enviar} noValidate initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="modal">
        <div className="mb-5 flex items-center justify-between"><h2 id="titulo-contato" className="font-display text-3xl tracking-tight">{contato ? "Editar contato" : "Novo contato de apoio"}</h2><button type="button" onClick={aoFechar} aria-label="Fechar" className="btn-icone -mr-2"><X size={20} /></button></div>
        <label className="mb-4 block"><span className="rotulo">Nome</span><input autoFocus value={nome} onChange={(e) => { setNome(e.target.value); setErros((x) => ({ ...x, nome: "" })); }} aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? "erro-nome" : undefined} className="campo" />{erros.nome && <p id="erro-nome" role="alert" className="erro-campo">{erros.nome}</p>}</label>
        <label className="mb-4 block"><span className="rotulo">Telefone</span><input type="tel" inputMode="tel" autoComplete="off" value={telefone} onChange={(e) => { setTelefone(e.target.value); setErros((x) => ({ ...x, telefone: "" })); }} placeholder="(11) 91234-5678" aria-invalid={Boolean(erros.telefone)} aria-describedby={erros.telefone ? "erro-telefone" : undefined} className="campo" />{erros.telefone && <p id="erro-telefone" role="alert" className="erro-campo">{erros.telefone}</p>}</label>
        <label className="mb-6 block"><span className="rotulo">Relação</span><select value={relacao} onChange={(e) => setRelacao(e.target.value)} className="campo">{RELACOES.map((r) => <option key={r}>{r}</option>)}</select></label>
        <div className="flex justify-end gap-3"><button type="button" onClick={aoFechar} className="btn btn-secundario">Cancelar</button><button type="submit" className="btn btn-primario">Salvar</button></div>
      </motion.form>
    </motion.div>
  );
}
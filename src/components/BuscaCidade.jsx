import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import useBuscaCidade from "../hooks/useBuscaCidade";

export default function BuscaCidade({ aoEscolher }) {
  const [texto, setTexto] = useState("");
  const { resultados, buscando, mensagem, buscar, limpar } = useBuscaCidade();
  const enviar = (e) => { e.preventDefault(); buscar(texto); };
  const escolher = (cidade) => { aoEscolher(cidade); setTexto(""); limpar(); };
  return (
    <div className="w-full">
      <form onSubmit={enviar} role="search" className="flex gap-2">
        <label htmlFor="busca-cidade" className="sr-only">Buscar cidade</label>
        <input id="busca-cidade" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar outra cidade…" className="campo" />
        <button type="submit" disabled={buscando} className="btn btn-primario min-h-12"><Search size={18} />{buscando ? "Buscando…" : "Buscar"}</button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm opacity-80">{mensagem}</p>
      {resultados.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {resultados.map((c) => (
            <li key={c.id}><button onClick={() => escolher(c)} className="cartao cartao-interativo flex w-full items-center gap-3 rounded-xl! p-3 text-left"><MapPin size={18} className="shrink-0 text-sage-deep dark:text-sage" /><span>{c.nome}{c.estado ? `, ${c.estado}` : ""}<span className="block text-xs opacity-70">{c.pais}</span></span></button></li>
          ))}
        </ul>
      )}
    </div>
  );
}
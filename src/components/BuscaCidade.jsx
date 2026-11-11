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
        <input id="busca-cidade" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar outra cidade…" className="w-full rounded-xl border border-silver/60 bg-pearl-light px-4 py-3 outline-none focus:border-violet-glow focus:ring-2 focus:ring-violet-glow/40 dark:bg-moss" />
        <button type="submit" disabled={buscando} className="flex shrink-0 items-center gap-2 rounded-xl bg-sage px-4 py-3 font-semibold text-moss transition hover:brightness-110 disabled:opacity-60"><Search size={18} />{buscando ? "Buscando…" : "Buscar"}</button>
      </form>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm opacity-80">{mensagem}</p>
      {resultados.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {resultados.map((c) => (
            <li key={c.id}><button onClick={() => escolher(c)} className="flex w-full items-center gap-3 rounded-xl border border-silver/40 bg-pearl-light/70 p-3 text-left hover:border-sage hover:bg-sage/15 dark:bg-forest/50"><MapPin size={18} className="shrink-0 text-violet-glow" /><span>{c.nome}{c.estado ? `, ${c.estado}` : ""}<span className="block text-xs opacity-70">{c.pais}</span></span></button></li>
          ))}
        </ul>
      )}
    </div>
  );
}
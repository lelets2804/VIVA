import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SecaoModulo({ id, indice, titulo, descricao, estatistica, to, icon: Icon, aoFocar }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative flex min-h-screen items-center">
      <div className="painel pointer-events-auto relative w-full max-w-md p-6 md:p-9">
        <p className="mb-4 flex items-center gap-3 text-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/15 text-sage"><Icon size={19} /></span>
          <span className="font-display text-base tabular-nums opacity-60">{String(indice).padStart(2, "0")} / 03</span>
        </p>
        <h2 id={`${id}-titulo`} className="font-display text-5xl tracking-[-0.035em] md:text-6xl">{titulo}</h2>
        <p className="mt-3 text-lg leading-relaxed opacity-85">{descricao}</p>
        <p className="mt-6 flex items-center gap-2.5 border-t border-white/10 pt-5 text-base">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-sage" />
          {estatistica}
        </p>
        <Link to={to} onMouseEnter={() => aoFocar(id)} onMouseLeave={() => aoFocar(null)} onFocus={() => aoFocar(id)} onBlur={() => aoFocar(null)} className="btn mt-6 bg-sage text-moss hover:bg-[#a3e0b5]">
          Abrir {titulo}<ArrowRight size={18} className="seta" />
        </Link>
      </div>
    </section>
  );
}
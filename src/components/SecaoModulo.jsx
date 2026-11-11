import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import RevelarTexto from "./RevelarTexto";
import useReducedMotion from "../hooks/useReducedMotion";

export default function SecaoModulo({ id, indice, titulo, descricao, estatistica, to, icon: Icon, aoFocar }) {
  const ref = useRef(null);
  const calmo = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const numeroY = useTransform(scrollYProgress, [0, 1], calmo ? [0, 0] : [140, -140]);
  const painelY = useTransform(scrollYProgress, [0, 1], calmo ? [0, 0] : [50, -50]);
  const opacidade = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  return (
    <section ref={ref} id={id} className="relative flex min-h-screen items-center">
      <motion.span aria-hidden="true" style={{ y: numeroY, opacity: opacidade, WebkitTextStroke: "2px rgba(192,199,206,0.55)" }} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[14rem] font-black leading-none text-transparent md:text-[26rem]">{`0${indice}`}</motion.span>
      <motion.div style={{ y: painelY }} className="dark pointer-events-auto relative max-w-md rounded-3xl border border-white/15 bg-moss/75 p-6 text-pearl backdrop-blur-md md:p-10">
        <p className="mb-1 flex items-center gap-2 text-sm uppercase tracking-widest opacity-80"><Icon size={18} className="text-sage" />Módulo {indice}</p>
        <h2 className="text-5xl font-bold md:text-6xl"><RevelarTexto className="text-silver-metal">{titulo}</RevelarTexto></h2>
        <p className="mt-2 opacity-90"><RevelarTexto atraso={0.15}>{descricao}</RevelarTexto></p>
        <p className="mt-5 inline-block rounded-full border border-sage/60 bg-sage/15 px-4 py-1 text-sm">{estatistica}</p>
        <div><Link to={to} onMouseEnter={() => aoFocar(id)} onMouseLeave={() => aoFocar(null)} onFocus={() => aoFocar(id)} onBlur={() => aoFocar(null)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sage px-5 py-3 font-semibold text-moss transition-all hover:gap-4 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-glow">Abrir {titulo}<ArrowRight size={18} /></Link></div>
      </motion.div>
    </section>
  );
}
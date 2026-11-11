import { motion } from "framer-motion";
import RevelarTexto from "./RevelarTexto";
import useReducedMotion from "../hooks/useReducedMotion";

export default function TituloPagina({ children, sub }) {
  const calmo = useReducedMotion();
  return (
    <div>
      <h1 className="text-5xl font-black tracking-tight drop-shadow-[0_0_18px_rgba(143,214,164,0.35)] md:text-6xl">
        <RevelarTexto className="text-silver-metal">{children}</RevelarTexto>
      </h1>
      <motion.span aria-hidden="true" className="mt-1 block h-1 rounded-full bg-linear-to-r from-sage to-violet-glow" initial={{ width: calmo ? 96 : 0 }} animate={{ width: 96 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}/>
      {sub && <p className="mt-3 opacity-80">{sub}</p>}
    </div>
  );
}
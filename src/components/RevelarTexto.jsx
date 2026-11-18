import { motion } from "framer-motion";
import useReducedMotion from "../hooks/useReducedMotion";

// Entrada única do título quando a tela abre. Não reanima ao rolar a página.
export default function RevelarTexto({ children, atraso = 0, className = "" }) {
  const calmo = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span className={`block ${className}`} initial={calmo ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: atraso, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}
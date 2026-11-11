import { motion } from "framer-motion";
import useReducedMotion from "../hooks/useReducedMotion";

export default function RevelarTexto({ children, atraso = 0, className = "" }) {
  const calmo = useReducedMotion();
  return (
    <span className="block overflow-hidden py-1">
      <motion.span className={`block ${className}`} initial={{ y: calmo ? 0 : "115%" }} whileInView={{ y: 0 }} viewport={{ once: false, amount: 0.6 }} transition={{ duration: 0.9, delay: atraso, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.span>
    </span>
  );
}
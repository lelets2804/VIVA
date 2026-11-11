import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import useReducedMotion from "../hooks/useReducedMotion";

export default function RevelarTexto({ children, atraso = 0, className = "" }) {
  const calmo = useReducedMotion();
  const ref = useRef(null);
  const visivel = useInView(ref, { amount: 0.3 });
  return (
    <span ref={ref} className="block overflow-hidden py-1">
      <motion.span className={`block ${className}`} initial={false} animate={{ y: calmo || visivel ? 0 : "115%" }} transition={{ duration: 0.9, delay: atraso, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.span>
    </span>
  );
}
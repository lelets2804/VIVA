import { motion } from "framer-motion";
import useReducedMotion from "../hooks/useReducedMotion";

export default function OrbFallback() {
  const calmo = useReducedMotion();
  return (
    <div aria-hidden="true" className="flex h-full w-full items-center justify-center">
      <motion.div animate={calmo ? {} : { y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,#c0c7ce_28%,#7e868e_60%,#2b3238_100%)] shadow-[0_0_80px_rgba(124,108,255,0.45)] md:h-72 md:w-72" />
    </div>
  );
}
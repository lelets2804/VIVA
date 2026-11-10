import { motion } from "framer-motion";

export default function RajadaParticulas({ rajadas }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-60">
      {rajadas.map((r) => r.particulas.map((p, i) => (
        <motion.span key={`${r.id}-${i}`} initial={{ x: r.x, y: r.y, scale: 0, opacity: 1 }} animate={{ x: r.x + p.dx, y: r.y + p.dy + 60, scale: p.s, opacity: 0, rotate: p.rot }} transition={{ duration: p.dur, ease: [0.1, 0.8, 0.3, 1] }} className="absolute left-0 top-0 block h-2 w-2 rounded-sm" style={{ background: p.cor, boxShadow: `0 0 10px ${p.cor}` }} />
      )))}
    </div>
  );
}
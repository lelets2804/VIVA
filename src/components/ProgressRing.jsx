import { motion } from "framer-motion";

export default function ProgressRing({ valor, tamanho = 148, espessura = 12 }) {
  const raio = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * raio;
  return (
    <div role="img" aria-label={`Progresso do dia: ${valor}%`} className="relative w-24 shrink-0 md:w-auto" style={{ maxWidth: tamanho, aspectRatio: "1" }}>
      <svg viewBox={`0 0 ${tamanho} ${tamanho}`} className="h-full w-full -rotate-90 md:w-37">
        <defs><linearGradient id="anel-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8FD6A4" /><stop offset="100%" stopColor="#2F7A55" /></linearGradient></defs>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth={espessura} />
        <motion.circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" stroke="url(#anel-grad)" strokeWidth={espessura} strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - valor / 100) }} transition={{ type: "spring", stiffness: 60, damping: 15 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-2xl tracking-tight tabular-nums md:text-4xl">{valor}%</span><span className="hidden text-xs opacity-70 md:block">do dia</span></div>
    </div>
  );
}
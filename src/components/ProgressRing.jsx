import { motion } from "framer-motion";

export default function ProgressRing({ valor, tamanho = 160, espessura = 12 }) {
  const raio = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * raio;
  return (
    <div role="img" aria-label={`Progresso do dia: ${valor}%`} className="relative" style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        <defs><linearGradient id="anel-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8FD6A4" /><stop offset="100%" stopColor="#7C6CFF" /></linearGradient></defs>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth={espessura} />
        <motion.circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" stroke="url(#anel-grad)" strokeWidth={espessura} strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - valor / 100) }} transition={{ type: "spring", stiffness: 60, damping: 15 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold text-silver-metal">{valor}%</span><span className="text-xs opacity-70">do dia</span></div>
    </div>
  );
}
import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, ShieldAlert, CloudSun } from "lucide-react";
import { getSaudacao, getDataExtensa } from "../utils/saudacao";
import useLembretes from "../hooks/useLembretes";
import ErrorBoundary from "../components/ErrorBoundary";
import OrbFallback from "../components/OrbFallback";

const Orb3D = lazy(() => import("../components/Orb3D"));
const temWebGL = () => { try { const c = document.createElement("canvas"); return Boolean(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } };
const webgl = temWebGL();
const horaAgora = () => { const d = new Date(); return d.getHours() + d.getMinutes() / 60; };
const formatar = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
const MODULOS = [
  { id: "rotina", nome: "Rotina", desc: "Lembretes e tarefas do dia", to: "/rotina", icon: CalendarCheck },
  { id: "seguranca", nome: "Segurança", desc: "Contatos de apoio e SOS demonstrativo", to: "/seguranca", icon: ShieldAlert },
  { id: "mobilidade", nome: "Mobilidade", desc: "Clima e alertas para o seu trajeto", to: "/mobilidade", icon: CloudSun },
];

export default function Dashboard() {
  const [foco, setFoco] = useState(null);
  const [hora, setHora] = useState(horaAgora);
  const { progresso, total, concluidos } = useLembretes();
  const descricao = (m) => (m.id === "rotina" && total > 0 ? `${concluidos} de ${total} concluídos` : m.desc);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-[42rem] overflow-hidden rounded-3xl border border-silver/30 bg-moss">
      <div className="absolute inset-0">
        {webgl ? (
          <ErrorBoundary fallback={<OrbFallback />}>
            <Suspense fallback={null}><Orb3D foco={foco} aoFocar={setFoco} hora={hora} progresso={progresso} /></Suspense>
          </ErrorBoundary>
        ) : (
          <OrbFallback />
        )}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, rgba(15,26,23,0.88), rgba(15,26,23,0.35) 45%, rgba(15,26,23,0.55))" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to right, rgba(15,26,23,0.92), rgba(15,26,23,0.5) 38%, transparent 65%)" }} />
      <div className="dark pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 text-pearl md:max-w-md md:p-12">
        <div>
          <p className="text-sm capitalize opacity-70">{getDataExtensa()}</p>
          <h1 className="text-5xl font-bold text-silver-metal md:text-7xl">{getSaudacao()}!</h1>
          <p className="mt-3 opacity-80">Aqui está o resumo da sua rotina de hoje.</p>
          <div className="pointer-events-auto mt-4 flex flex-wrap items-center gap-3 text-sm">
            <label htmlFor="hora-dia" className="whitespace-nowrap">Hora do dia: <strong>{formatar(hora)}</strong></label>
            <input id="hora-dia" type="range" min="0" max="23.75" step="0.25" value={hora} onChange={(e) => setHora(Number(e.target.value))} className="w-32 accent-violet-glow" />
            <button onClick={() => setHora(horaAgora())} className="rounded-lg border border-silver/50 px-2 py-1 hover:bg-sage/20">Agora</button>
          </div>
        </div>
        <nav aria-label="Módulos do VIVVA" className="grid grid-cols-3 gap-2 md:grid-cols-1 md:gap-3">
          {MODULOS.map((m) => (
            <Link key={m.id} to={m.to} onMouseEnter={() => setFoco(m.id)} onMouseLeave={() => setFoco(null)} onFocus={() => setFoco(m.id)} onBlur={() => setFoco(null)} className={`pointer-events-auto flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center backdrop-blur transition focus-visible:outline-2 focus-visible:outline-violet-glow md:flex-row md:gap-3 md:px-4 md:text-left ${foco === m.id ? "border-sage bg-sage/25" : "border-silver/40 bg-forest/50"}`}>
              <m.icon size={22} className="shrink-0 text-sage" />
              <span className="flex flex-col"><span className="font-semibold">{m.nome}</span><span className="hidden text-sm opacity-70 md:block">{descricao(m)}</span></span>
            </Link>
          ))}
        </nav>
      </div>
    </motion.section>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { CalendarCheck, ShieldAlert, CloudSun, ChevronsDown } from "lucide-react";
import { getSaudacao, getDataExtensa } from "../utils/saudacao";
import useCena from "../hooks/useCena";
import useContatos from "../hooks/useContatos";
import useClima from "../hooks/useClima";
import useReducedMotion from "../hooks/useReducedMotion";
import RevelarTexto from "../components/RevelarTexto";
import SecaoModulo from "../components/SecaoModulo";

const formatar = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
const MODULOS = [
  { id: "rotina", nome: "Rotina", desc: "Lembretes e tarefas do dia", longa: "Sua rotina organizada em um só lugar. Acompanhe compromissos, lembretes e tarefas concluídas ao longo do dia.", to: "/rotina", icon: CalendarCheck },
  { id: "seguranca", nome: "Segurança", desc: "Contatos de apoio e SOS demonstrativo", longa: "Mantenha seus contatos de confiança acessíveis e consulte o histórico de alertas registrados no aplicativo.", to: "/seguranca", icon: ShieldAlert },
  { id: "mobilidade", nome: "Mobilidade", desc: "Clima e alertas para o seu trajeto", longa: "Consulte as condições meteorológicas e receba avisos informativos para se preparar antes de sair.", to: "/mobilidade", icon: CloudSun },
];
const PONTOS = [{ id: "inicio", rotulo: "Início" }, ...MODULOS.map((m) => ({ id: m.id, rotulo: m.nome }))];

export default function Dashboard() {
  const { foco, setFoco, hora, setHora, horaAgora, scroll, rotina } = useCena();
  const { contatos } = useContatos();
  const clima = useClima();
  const calmo = useReducedMotion();
  const [ativo, setAtivo] = useState(0);
  const ultimo = useRef(-1);
  const { scrollYProgress } = useScroll();
  const suave = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.6 });

  useEffect(() => { window.scrollTo(0, 0); scroll.current = 0; return () => { scroll.current = 0; setFoco(null); }; }, [scroll, setFoco]);
  useMotionValueEvent(suave, "change", (v) => {
    scroll.current = v;
    const i = Math.min(3, Math.round(v * 3));
    if (i !== ultimo.current) { ultimo.current = i; setAtivo(i); setFoco(i === 0 ? null : MODULOS[i - 1].id); }
  });

  const dados = { rotina, contatos, clima };

  return (
    <div>
      <nav aria-label="Seções do Dashboard" className="pointer-events-auto fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {PONTOS.map((p, i) => <button key={p.id} onClick={() => document.getElementById(p.id)?.scrollIntoView({ behavior: calmo ? "auto" : "smooth" })} aria-label={`Ir para ${p.rotulo}`} aria-current={ativo === i ? "true" : undefined} className="group flex items-center justify-end gap-3"><span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-pearl opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">{p.rotulo}</span><span className={`block rounded-full border border-silver transition-all ${ativo === i ? "h-6 w-3 bg-sage" : "h-3 w-3 bg-black/30"}`} /></button>)}
      </nav>
      <section id="inicio" className="flex min-h-screen items-center">
        <div className="dark pointer-events-auto max-w-md rounded-3xl border border-white/15 bg-moss/75 p-6 text-pearl backdrop-blur-md md:p-10">
          <p className="text-sm capitalize opacity-70">{getDataExtensa()}</p>
          <h1 className="text-5xl font-bold md:text-7xl"><RevelarTexto className="text-silver-metal">{`${getSaudacao()}!`}</RevelarTexto></h1>
          <p className="mt-3 opacity-85">Aqui está o resumo da sua rotina de hoje.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <label htmlFor="hora-dia" className="whitespace-nowrap">Hora do dia: <strong>{formatar(hora)}</strong></label>
            <input id="hora-dia" type="range" min="0" max="23.75" step="0.25" value={Math.min(hora, 23.75)} onChange={(e) => setHora(Number(e.target.value))} className="w-32 accent-violet-glow" />
            <button onClick={() => setHora(horaAgora())} className="rounded-lg border border-silver/50 px-2 py-1 hover:bg-sage/20">Agora</button>
          </div>
          <nav aria-label="Módulos do VIVVA" className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-1">
            {MODULOS.map((m) => <Link key={m.id} to={m.to} onMouseEnter={() => setFoco(m.id)} onMouseLeave={() => setFoco(null)} onFocus={() => setFoco(m.id)} onBlur={() => setFoco(null)} className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition focus-visible:outline-2 focus-visible:outline-violet-glow md:flex-row md:gap-3 md:px-4 md:text-left ${foco === m.id ? "border-sage bg-sage/25" : "border-white/20 bg-white/5"}`}><m.icon size={22} className="shrink-0 text-sage" /><span className="flex flex-col"><span className="font-semibold">{m.nome}</span><span className="hidden text-sm opacity-70 md:block">{m.desc}</span></span></Link>)}
          </nav>
          <p className="mt-6 flex items-center gap-2 text-sm opacity-80"><motion.span aria-hidden="true" animate={calmo ? {} : { y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}><ChevronsDown size={20} /></motion.span>Role para explorar a cidade</p>
        </div>
      </section>
      {MODULOS.map((m, i) => <SecaoModulo key={m.id} id={m.id} indice={i + 1} titulo={m.nome} descricao={m.longa} to={m.to} icon={m.icon} aoFocar={setFoco} dados={dados} tipo={m.id} />)}
    </div>
  );
}

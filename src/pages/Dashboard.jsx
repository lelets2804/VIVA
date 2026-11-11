import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { CalendarCheck, ShieldAlert, CloudSun, ChevronsDown } from "lucide-react";
import { getSaudacao, getDataExtensa } from "../utils/saudacao";
import useCena from "../hooks/useCena";
import useContatos from "../hooks/useContatos";
import useClima from "../hooks/useClima";
import useTrajeto from "../hooks/useTrajeto";
import useReducedMotion from "../hooks/useReducedMotion";
import { analisarPadroes } from "../utils/padroes";
import RevelarTexto from "../components/RevelarTexto";
import SecaoModulo from "../components/SecaoModulo";
import ResumoDiario from "../components/ResumoDiario";

const formatar = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
const MODULOS = [
  { id: "rotina", nome: "Rotina", desc: "Lembretes e tarefas do dia", longa: "Organize lembretes, remédios e compromissos. Cada lembrete concluído faz o farol da Rotina brilhar mais na cidade.", to: "/rotina", icon: CalendarCheck },
  { id: "seguranca", nome: "Segurança", desc: "Contatos de apoio e SOS demonstrativo", longa: "Contatos de apoio sempre à mão e um botão SOS de demonstração, que registra o alerta sem ligar para ninguém.", to: "/seguranca", icon: ShieldAlert },
  { id: "mobilidade", nome: "Mobilidade", desc: "Clima e alertas para o seu trajeto", longa: "Clima de verdade e avisos informativos para planejar o deslocamento. Eles ajudam a se preparar, mas não garantem a segurança de um trajeto.", to: "/mobilidade", icon: CloudSun },
];
const PONTOS = [{ id: "inicio", rotulo: "Início" }, { id: "resumo", rotulo: "Resumo" }, ...MODULOS.map((m) => ({ id: m.id, rotulo: m.nome }))];

export default function Dashboard() {
  const { foco, setFoco, hora, setHora, horaAgora, scroll, rotina } = useCena();
  const { contatos } = useContatos();
  const { cidade, dados, ar, carregando, erro } = useClima();
  const { historico } = useTrajeto();
  const analise = analisarPadroes(rotina.lembretes, historico);
  const calmo = useReducedMotion();
  const [ativo, setAtivo] = useState(0);
  const ultimo = useRef(-1);
  const { scrollYProgress } = useScroll();
  const suave = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.6 });

  useEffect(() => { window.scrollTo(0, 0); scroll.current = 0; return () => { scroll.current = 0; setFoco(null); }; }, [scroll, setFoco]);
  useMotionValueEvent(suave, "change", (v) => {
    scroll.current = v;
    const i = Math.round(v * (PONTOS.length - 1));
    if (i !== ultimo.current) { ultimo.current = i; setAtivo(i); setFoco(i <= 1 ? null : MODULOS[i - 2].id); }
  });

  const estatistica = {
    rotina: rotina.total > 0 ? `${rotina.concluidos} de ${rotina.total} lembretes concluídos` : "Crie seu primeiro lembrete",
    seguranca: contatos.length > 0 ? `${contatos.length} ${contatos.length === 1 ? "contato de apoio" : "contatos de apoio"}` : "Cadastre um contato de apoio",
    mobilidade: "Clima e avisos do seu deslocamento",
  };

  return (
    <div>
      <nav aria-label="Seções do Dashboard" className="pointer-events-auto fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {PONTOS.map((p, i) => (
          <button key={p.id} onClick={() => document.getElementById(p.id)?.scrollIntoView({ behavior: calmo ? "auto" : "smooth" })} aria-label={`Ir para ${p.rotulo}`} aria-current={ativo === i ? "true" : undefined} className="group flex items-center justify-end gap-3">
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-pearl opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">{p.rotulo}</span>
            <span className={`block rounded-full border border-silver transition-all ${ativo === i ? "h-6 w-3 bg-sage" : "h-3 w-3 bg-black/30"}`} />
          </button>
        ))}
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
            {MODULOS.map((m) => (
              <Link key={m.id} to={m.to} onMouseEnter={() => setFoco(m.id)} onMouseLeave={() => setFoco(null)} onFocus={() => setFoco(m.id)} onBlur={() => setFoco(null)} className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition focus-visible:outline-2 focus-visible:outline-violet-glow md:flex-row md:gap-3 md:px-4 md:text-left ${foco === m.id ? "border-sage bg-sage/25" : "border-white/20 bg-white/5"}`}>
                <m.icon size={22} className="shrink-0 text-sage" />
                <span className="flex flex-col"><span className="font-semibold">{m.nome}</span><span className="hidden text-sm opacity-70 md:block">{m.desc}</span></span>
              </Link>
            ))}
          </nav>
          <p className="mt-6 flex items-center gap-2 text-sm opacity-80"><motion.span aria-hidden="true" animate={calmo ? {} : { y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}><ChevronsDown size={20} /></motion.span>Role para explorar a cidade</p>
        </div>
      </section>
      <ResumoDiario cidade={cidade} dados={dados} ar={ar} carregando={carregando} erro={erro} lembretes={rotina.lembretes} hora={hora} insight={analise.insights[0]} />
      {MODULOS.map((m, i) => <SecaoModulo key={m.id} id={m.id} indice={i + 1} titulo={m.nome} descricao={m.longa} estatistica={estatistica[m.id]} to={m.to} icon={m.icon} aoFocar={setFoco} />)}
    </div>
  );
}
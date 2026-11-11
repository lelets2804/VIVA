
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Circle, Clock3, Users, CloudRain, Thermometer, Wind, MapPin, AlertTriangle, ShieldCheck } from "lucide-react";
import { descreverClima, gerarAvisos } from "../utils/clima";
import RevelarTexto from "./RevelarTexto";
import useReducedMotion from "../hooks/useReducedMotion";

function ConteudoRotina({ rotina }) {
  const pendentes = rotina.lembretes.filter((l) => !l.concluido).sort((a, b) => (a.horario || "99:99").localeCompare(b.horario || "99:99"));
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-end justify-between gap-3"><div><p className="text-sm opacity-70">Progresso de hoje</p><p className="text-3xl font-bold">{rotina.progresso}%</p></div><p className="text-sm opacity-70">{rotina.concluidos} de {rotina.total} concluídos</p></div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: `${rotina.progresso}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-sage" /></div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Próximos lembretes</h3><Clock3 size={17} className="text-sage" /></div>
        {rotina.carregando ? <p className="text-sm opacity-70">Carregando lembretes...</p> : pendentes.length === 0 ? <p className="text-sm opacity-70">{rotina.total === 0 ? "Você ainda não cadastrou lembretes." : "Tudo concluído! Não há tarefas pendentes."}</p> : <ul className="space-y-3">{pendentes.slice(0, 3).map((l) => <li key={l.id} className="flex items-center gap-3 text-sm"><Circle size={15} className="shrink-0 text-sage" /><span className="min-w-0 flex-1 truncate">{l.titulo}</span>{l.horario && <span className="shrink-0 text-sage">{l.horario}</span>}</li>)}</ul>}
      </div>
      <p className="text-xs opacity-60">Seus lembretes ficam salvos neste navegador.</p>
    </div>
  );
}

function ConteudoSeguranca({ contatos }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Users size={20} className="mb-2 text-sage" /><p className="text-3xl font-bold">{contatos.length}</p><p className="text-xs opacity-70">Contatos cadastrados</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck size={20} className="mb-2 text-sage" /><p className="text-sm font-semibold">{contatos.length > 0 ? "Rede de apoio criada" : "Rede de apoio vazia"}</p><p className="mt-1 text-xs opacity-70">Seus contatos de confiança</p></div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 font-semibold">Pessoas de confiança</h3>
        {contatos.length === 0 ? <p className="text-sm opacity-70">Você ainda não adicionou contatos. Cadastre alguém de confiança para manter as informações acessíveis.</p> : <ul className="space-y-3">{contatos.slice(0, 3).map((c) => <li key={c.id} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/20 font-semibold text-sage">{c.nome.charAt(0).toUpperCase()}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{c.nome}</span><span className="block text-xs opacity-60">{c.relacao}</span></span></li>)}</ul>}
      </div>
      <p className="flex items-start gap-2 text-xs opacity-60"><AlertTriangle size={14} className="mt-0.5 shrink-0" />O botão SOS do projeto é demonstrativo: não realiza chamadas nem envia notificações.</p>
    </div>
  );
}

function ConteudoMobilidade({ clima }) {
  if (clima.carregando && !clima.dados) return <p className="mt-6 text-sm opacity-70">Consultando as condições meteorológicas...</p>;
  if (clima.erro && !clima.dados) return <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">{clima.erro}</p>;
  if (!clima.dados) return <p className="mt-6 text-sm opacity-70">As informações do clima estarão disponíveis quando a consulta for concluída.</p>;
  const atual = clima.dados.current;
  const { texto } = descreverClima(atual.weather_code);
  const avisos = gerarAvisos(atual, clima.dados.daily);
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-xs opacity-70"><MapPin size={14} />{clima.cidade.nome}{clima.cidade.estado ? `, ${clima.cidade.estado}` : ""}</div>
        <div className="mt-3 flex items-center justify-between gap-3"><div><p className="text-5xl font-bold">{Math.round(atual.temperature_2m)}°</p><p className="text-sm opacity-80">{texto}</p></div><div className="text-right"><p className="text-xs opacity-60">Sensação térmica</p><p className="text-xl font-semibold">{Math.round(atual.apparent_temperature)}°C</p></div></div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-black/10 p-2"><Thermometer size={15} className="mb-1 text-sage" /><p className="text-sm font-semibold">{atual.relative_humidity_2m}%</p><p className="text-[10px] opacity-60">Umidade</p></div>
          <div className="rounded-xl bg-black/10 p-2"><Wind size={15} className="mb-1 text-sage" /><p className="text-sm font-semibold">{Math.round(atual.wind_speed_10m)} km/h</p><p className="text-[10px] opacity-60">Vento</p></div>
          <div className="rounded-xl bg-black/10 p-2"><CloudRain size={15} className="mb-1 text-sage" /><p className="text-sm font-semibold">{atual.precipitation} mm</p><p className="text-[10px] opacity-60">Chuva</p></div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-3 font-semibold">Avisos para hoje</h3>
        <ul className="space-y-3">{avisos.slice(0, 2).map((a) => <li key={a.id} className="flex gap-3 text-sm"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-sage" /><span><strong className="block">{a.titulo}</strong><span className="mt-1 block text-xs leading-relaxed opacity-70">{a.texto}</span></span></li>)}</ul>
      </div>
      <p className="text-xs opacity-60">Dados meteorológicos da Open-Meteo. Avisos informativos, não uma garantia de segurança do trajeto.</p>
    </div>
  );
}

export default function SecaoModulo({ id, indice, titulo, descricao, to, icon: Icon, aoFocar, dados, tipo }) {
  const ref = useRef(null);
  const calmo = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const numeroY = useTransform(scrollYProgress, [0, 1], calmo ? [0, 0] : [140, -140]);
  const painelY = useTransform(scrollYProgress, [0, 1], calmo ? [0, 0] : [50, -50]);
  const opacidade = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} id={id} className="relative flex min-h-screen items-center py-16">
      <motion.span aria-hidden="true" style={{ y: numeroY, opacity: opacidade, WebkitTextStroke: "2px rgba(192,199,206,0.55)" }} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[14rem] font-black leading-none text-transparent md:text-[26rem]">{`0${indice}`}</motion.span>
      <motion.div style={{ y: painelY }} className="dark pointer-events-auto relative w-full max-w-xl rounded-3xl border border-white/15 bg-moss/85 p-6 text-pearl shadow-2xl backdrop-blur-xl md:p-9">
        <p className="mb-3 flex items-center gap-2 text-sm uppercase tracking-widest opacity-80"><Icon size={18} className="text-sage" />Módulo {indice}</p>
        <h2 className="text-5xl font-bold md:text-6xl"><RevelarTexto className="text-silver-metal">{titulo}</RevelarTexto></h2>
        <p className="mt-4 leading-relaxed opacity-90"><RevelarTexto atraso={0.15}>{descricao}</RevelarTexto></p>
        {tipo === "rotina" && <ConteudoRotina rotina={dados.rotina} />}
        {tipo === "seguranca" && <ConteudoSeguranca contatos={dados.contatos} />}
        {tipo === "mobilidade" && <ConteudoMobilidade clima={dados.clima} />}
        <Link to={to} onMouseEnter={() => aoFocar(id)} onMouseLeave={() => aoFocar(null)} onFocus={() => aoFocar(id)} onBlur={() => aoFocar(null)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sage px-5 py-3 font-semibold text-moss transition-all hover:gap-4 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-glow">Abrir {titulo}<ArrowRight size={18} /></Link>
      </motion.div>
    </section>
  );
}

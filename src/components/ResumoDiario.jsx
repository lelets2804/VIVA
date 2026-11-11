import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CloudRain, ListChecks, Lightbulb, MessageCircle, Clock } from "lucide-react";
import RevelarTexto from "./RevelarTexto";
import { descreverClima, gerarRecomendacoes } from "../utils/clima";

export default function ResumoDiario({ cidade, dados, ar, carregando, erro, lembretes, hora, insight }) {
  const pendentes = lembretes.filter((l) => !l.concluido);
  const progresso = lembretes.length ? Math.round(((lembretes.length - pendentes.length) / lembretes.length) * 100) : 0;
  const proximo = [...pendentes].filter((l) => l.horario).sort((a, b) => a.horario.localeCompare(b.horario)).find((l) => { const [h, m] = l.horario.split(":").map(Number); return h + m / 60 >= hora - 0.25; });
  const recs = gerarRecomendacoes({ dados, ar, hora, lembretes }).filter((r) => r.id !== "proximo").slice(0, 3);
  const a = dados?.current, d = dados?.daily;
  return (
    <section id="resumo" aria-labelledby="resumo-titulo" className="relative flex min-h-screen items-center">
      <div className="dark pointer-events-auto relative w-full max-w-xl rounded-3xl border border-white/15 bg-moss/75 p-6 text-pearl backdrop-blur-md md:p-10">
        <p className="mb-3 text-sm uppercase tracking-widest opacity-80">Resumo diário</p>
        <h2 id="resumo-titulo" className="text-4xl font-bold md:text-5xl"><RevelarTexto className="text-silver-metal">Seu dia em um olhar</RevelarTexto></h2>
        <p className="mt-1 opacity-90">O essencial do clima, da rotina e o que fazer a respeito.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="flex items-center gap-1 text-xs opacity-70"><MapPin size={14} />{cidade.nome}</p>
            {erro ? <p className="mt-2 text-sm">Clima indisponível agora.</p> : a ? (
              <>
                <p className="mt-1 text-4xl font-bold">{Math.round(a.temperature_2m)}°</p>
                <p className="text-sm">{descreverClima(a.weather_code).texto}</p>
                <p className="mt-1 text-xs opacity-80">Mín. {Math.round(d.temperature_2m_min[0])}° · máx. {Math.round(d.temperature_2m_max[0])}°</p>
                <p className="flex items-center gap-1 text-xs opacity-80"><CloudRain size={12} />Chuva: até {d.precipitation_probability_max?.[0] ?? "—"}%</p>
              </>
            ) : <p className="mt-2 text-sm opacity-70">{carregando ? "Consultando o clima…" : "—"}</p>}
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="flex items-center gap-1 text-xs opacity-70"><ListChecks size={14} />Rotina de hoje</p>
            <p className="mt-1 text-4xl font-bold">{progresso}%</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/15"><motion.div className="h-full rounded-full bg-sage" initial={{ width: 0 }} animate={{ width: `${progresso}%` }} transition={{ type: "spring", stiffness: 60, damping: 15 }} /></div>
            <p className="mt-2 text-xs opacity-80">{lembretes.length ? `${lembretes.length - pendentes.length} de ${lembretes.length} concluídos` : "Nenhum lembrete ainda"}</p>
            {proximo && <p className="mt-1 flex items-center gap-1 text-xs"><Clock size={12} />Próximo: {proximo.titulo} às {proximo.horario}</p>}
          </div>
        </div>

        {recs.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2" aria-label="Recomendações do dia">
            {recs.map((r) => <li key={r.id} className="rounded-xl border border-sage/40 bg-sage/10 px-4 py-2 text-sm"><strong>{r.titulo}.</strong> <span className="opacity-90">{r.texto}</span></li>)}
          </ul>
        )}
        {insight && <p className="mt-3 flex items-start gap-2 rounded-xl border border-violet-glow/50 bg-violet-glow/10 px-4 py-2 text-sm"><Lightbulb size={16} className="mt-0.5 shrink-0" /><span><strong>{insight.titulo}.</strong> {insight.texto}</span></p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/assistente" className="inline-flex items-center gap-2 rounded-xl bg-sage px-5 py-3 font-semibold text-moss hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-glow"><MessageCircle size={18} />Conversar com a VIVVA</Link>
          <Link to="/insights" className="inline-flex items-center gap-2 rounded-xl border border-silver/50 px-5 py-3 hover:bg-sage/20 focus-visible:outline-2 focus-visible:outline-violet-glow"><Lightbulb size={18} />Ver insights</Link>
        </div>
      </div>
    </section>
  );
}
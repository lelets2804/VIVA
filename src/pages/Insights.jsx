import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import useCena from "../hooks/useCena";
import useTrajeto from "../hooks/useTrajeto";
import { analisarPadroes } from "../utils/padroes";
import AvisoAmbiental from "../components/AvisoAmbiental";
import TituloPagina from "../components/TituloPagina";

function Barras({ titulo, valores, rotulos, destaqueAlto = true }) {
  const max = Math.max(1, ...valores);
  return (
    <div className="rounded-3xl border border-silver/40 bg-pearl-light/70 p-5 backdrop-blur dark:bg-forest/50">
      <h3 className="mb-3 font-semibold">{titulo}</h3>
      <div className="flex h-32 items-end gap-1" role="img" aria-label={`${titulo}: ${valores.join(", ")}`}>
        {valores.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.015, type: "spring", stiffness: 120, damping: 18 }} title={`${rotulos[i]}: ${v}`} className={`w-full rounded-t ${destaqueAlto && v === max && v > 0 ? "bg-sage" : "bg-violet-glow/60"}`} style={{ minHeight: v > 0 ? 4 : 1 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1 text-[10px] opacity-70">{rotulos.map((r, i) => <span key={i} className="flex-1 text-center">{rotulos.length > 12 ? (i % 4 === 0 ? r : "") : r}</span>)}</div>
    </div>
  );
}

export default function Insights() {
  const { rotina } = useCena();
  const { historico } = useTrajeto();
  const a = analisarPadroes(rotina.lembretes, historico);
  const dias = ["D", "S", "T", "Q", "Q", "S", "S"];
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <header className="mb-8"><TituloPagina sub="Padrões que a VIVVA percebe na sua rotina e nos seus trajetos.">Insights</TituloPagina></header>
      <div className="mb-8 grid grid-cols-3 gap-3 text-center">
        {[["Conclusão", `${a.taxa}%`], ["Tarefas feitas", a.totalConcluidos], ["Trajetos", historico.length]].map(([r, v]) => (
          <div key={r} className="rounded-2xl border border-silver/40 bg-pearl-light/70 p-4 dark:bg-forest/50"><p className="text-3xl font-bold text-silver-metal">{v}</p><p className="text-xs opacity-70">{r}</p></div>
        ))}
      </div>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><Lightbulb size={22} />O que notamos</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {a.insights.map((i, n) => <AvisoAmbiental key={i.id} indice={n} aviso={{ ...i, nivel: i.icone === "alerta" ? "atencao" : "info", rotulo: "Padrão" }} />)}
      </ul>
      {a.dadosSuficientes && (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Barras titulo="Tarefas concluídas por hora do dia" valores={a.porHora} rotulos={a.porHora.map((_, h) => `${h}h`)} />
          <Barras titulo="Tarefas concluídas por dia da semana" valores={a.porDia} rotulos={dias} />
        </div>
      )}
      {a.porCategoria.length > 0 && (
        <div className="mt-8 rounded-3xl border border-silver/40 bg-pearl-light/70 p-5 dark:bg-forest/50">
          <h3 className="mb-3 font-semibold">Conclusão por categoria</h3>
          <ul className="flex flex-col gap-3">
            {a.porCategoria.map((c) => (
              <li key={c.nome}>
                <div className="mb-1 flex justify-between text-sm"><span>{c.nome}</span><span className="opacity-80">{c.feitos}/{c.total} · {c.taxa}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-black/15"><motion.div className="h-full rounded-full bg-sage" initial={{ width: 0 }} animate={{ width: `${c.taxa}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-8 text-xs opacity-70">Os padrões são calculados no seu navegador a partir dos seus próprios dados e não substituem orientação médica ou profissional.</p>
    </motion.section>
  );
}
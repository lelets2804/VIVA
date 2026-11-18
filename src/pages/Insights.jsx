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
    <div className="cartao p-5 md:p-6">
      <h3 className="mb-4 text-xl">{titulo}</h3>
      <div className="flex h-32 items-end gap-1" role="img" aria-label={`${titulo}: ${valores.join(", ")}`}>
        {valores.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.015, type: "spring", stiffness: 120, damping: 18 }} title={`${rotulos[i]}: ${v}`} className={`w-full rounded-t-md ${destaqueAlto && v === max && v > 0 ? "bg-sage-deep dark:bg-sage" : "bg-moss/20 dark:bg-white/20"}`} style={{ minHeight: v > 0 ? 4 : 1 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 text-xs tabular-nums opacity-70">{rotulos.map((r, i) => <span key={i} className="flex-1 text-center">{rotulos.length > 12 ? (i % 4 === 0 ? r : "") : r}</span>)}</div>
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
      <header className="mb-10"><TituloPagina sobre="Seus padrões" sub="O que a VIVVA percebe na sua rotina e nos seus trajetos.">Insights</TituloPagina></header>
      <div className="mb-12 grid grid-cols-3 gap-3 md:gap-4">
        {[["Conclusão", `${a.taxa}%`], ["Tarefas feitas", a.totalConcluidos], ["Trajetos", historico.length]].map(([r, v]) => (
          <div key={r} className="cartao p-4 md:p-6"><p className="font-display text-4xl tracking-[-0.04em] tabular-nums md:text-6xl">{v}</p><p className="mt-1 text-sm opacity-75">{r}</p></div>
        ))}
      </div>
      <h2 className="mb-4 flex items-center gap-2.5 text-2xl"><Lightbulb size={22} className="text-ambar-deep dark:text-ambar" />O que notamos</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {a.insights.map((i, n) => <AvisoAmbiental key={i.id} indice={n} aviso={{ ...i, nivel: i.icone === "alerta" ? "atencao" : "info", rotulo: "Padrão" }} />)}
      </ul>
      {a.dadosSuficientes && (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Barras titulo="Tarefas concluídas por hora do dia" valores={a.porHora} rotulos={a.porHora.map((_, h) => `${h}h`)} />
          <Barras titulo="Tarefas concluídas por dia da semana" valores={a.porDia} rotulos={dias} />
        </div>
      )}
      {a.porCategoria.length > 0 && (
        <div className="cartao mt-6 p-5 md:p-6">
          <h3 className="mb-4 text-xl">Conclusão por categoria</h3>
          <ul className="flex flex-col gap-3">
            {a.porCategoria.map((c) => (
              <li key={c.nome}>
                <div className="mb-1 flex justify-between text-sm"><span>{c.nome}</span><span className="opacity-80">{c.feitos}/{c.total} · {c.taxa}%</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-moss/10 dark:bg-white/10"><motion.div className="h-full rounded-full bg-sage-deep dark:bg-sage" initial={{ width: 0 }} animate={{ width: `${c.taxa}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-10 text-sm opacity-70">Os padrões são calculados no seu navegador a partir dos seus próprios dados e não substituem orientação médica ou profissional.</p>
    </motion.section>
  );
}
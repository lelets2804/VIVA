import { Play, Square, Trash2, Route } from "lucide-react";
import TrajetoMapa from "./TrajetoMapa";
import { formatarDistancia, formatarDuracao } from "../utils/geo";

const quando = (ms) => new Date(ms).toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function RastreadorTrajeto({ trajeto }) {
  const { historico, gravando, pontos, distancia, duracaoS, velocidadeKmh, erro, iniciar, parar, remover } = trajeto;
  return (
    <section aria-label="Acompanhamento de trajetos">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold"><Route size={22} />Acompanhar trajeto</h2>
        {gravando
          ? <button onClick={parar} className="flex items-center gap-2 rounded-xl bg-violet-glow px-5 py-3 font-semibold text-white hover:brightness-110"><Square size={18} />Encerrar trajeto</button>
          : <button onClick={iniciar} className="flex items-center gap-2 rounded-xl bg-sage px-5 py-3 font-semibold text-moss hover:brightness-110"><Play size={18} />Iniciar trajeto</button>}
      </div>
      {erro && <p role="alert" className="mb-3 rounded-xl border border-red-400/60 bg-red-500/10 p-3 text-sm">{erro}</p>}
      {gravando && (
        <div aria-live="polite" className="mb-4 rounded-3xl border border-sage/60 bg-sage/10 p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs opacity-70">Distância</p><p className="text-xl font-bold">{formatarDistancia(distancia)}</p></div>
            <div><p className="text-xs opacity-70">Tempo</p><p className="text-xl font-bold">{formatarDuracao(duracaoS)}</p></div>
            <div><p className="text-xs opacity-70">Velocidade média</p><p className="text-xl font-bold">{velocidadeKmh.toFixed(1).replace(".", ",")} km/h</p></div>
          </div>
          <div className="mt-3"><TrajetoMapa pontos={pontos} /></div>
          <p className="mt-2 text-xs opacity-70">{pontos.length < 2 ? "Aguardando sinal de GPS… caminhe um pouco." : "Mantenha esta aba aberta: o navegador só registra a posição enquanto ela está ativa."}</p>
        </div>
      )}
      {historico.length === 0 && !gravando ? <p className="rounded-2xl border border-dashed border-silver/50 p-6 text-center text-sm opacity-70">Nenhum trajeto registrado ainda. A posição é usada só neste aparelho e nunca é enviada a servidores.</p> : (
        <ul className="grid gap-3 md:grid-cols-2">
          {historico.slice(0, 6).map((t) => (
            <li key={t.id} className="rounded-2xl border border-silver/40 bg-pearl-light/70 p-4 dark:bg-forest/50">
              <div className="mb-2 flex items-start justify-between gap-2"><div><p className="font-semibold capitalize">{quando(t.inicio)}</p><p className="text-sm opacity-80">{formatarDistancia(t.distanciaM)} · {formatarDuracao(t.duracaoS)}</p></div><button onClick={() => remover(t.id)} aria-label="Excluir trajeto" className="rounded-lg p-2 hover:bg-red-500/20"><Trash2 size={18} /></button></div>
              <TrajetoMapa pontos={t.pontos} altura={110} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
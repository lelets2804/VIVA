import { motion } from "framer-motion";
import { Sunrise, Sunset, Gauge, Cloud, Leaf, Sun, CloudRain, Droplets } from "lucide-react";
import { descreverClima, descreverAr, proximasHoras } from "../utils/clima";

const hhmm = (iso) => iso?.slice(11, 16) ?? "—";

function Item({ icone: Icone, rotulo, valor, detalhe, destaque }) {
  return (
    <div className={`rounded-2xl border p-4 ${destaque ? "border-violet-glow/70 bg-violet-glow/15" : "border-silver/40 bg-pearl-light/70 dark:bg-forest/50"}`}>
      <p className="flex items-center gap-2 text-sm opacity-80"><Icone size={16} />{rotulo}</p>
      <p className="mt-1 text-xl font-semibold">{valor}</p>
      {detalhe && <p className="text-xs opacity-70">{detalhe}</p>}
    </div>
  );
}

export default function ClimaAmpliado({ dados, ar }) {
  const { current: a, daily: d } = dados;
  const horas = proximasHoras(dados, 12);
  const qAr = descreverAr(ar?.us_aqi);
  const uv = Math.round(d.uv_index_max?.[0] ?? 0);
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Próximas horas</h2>
      <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3" aria-label="Previsão hora a hora">
        {horas.map((h, i) => (
          <motion.li key={h.hora} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex min-w-20 shrink-0 flex-col items-center gap-1 rounded-2xl border border-silver/40 bg-pearl-light/70 p-3 text-center dark:bg-forest/50">
            <span className="text-sm opacity-80">{i === 0 ? "Agora" : h.hora}</span>
            <span className="text-lg font-bold">{Math.round(h.temp)}°</span>
            <span className="flex items-center gap-1 text-xs"><CloudRain size={12} />{h.prob}%</span>
            <span className="text-[11px] leading-tight opacity-70">{descreverClima(h.codigo).texto}</span>
          </motion.li>
        ))}
      </ul>
      <h2 className="mb-3 mt-6 text-xl font-semibold">Detalhes do dia</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Item icone={Sunrise} rotulo="Nascer do sol" valor={hhmm(d.sunrise?.[0])} />
        <Item icone={Sunset} rotulo="Pôr do sol" valor={hhmm(d.sunset?.[0])} />
        <Item icone={Sun} rotulo="Índice UV máximo" valor={uv} detalhe={uv >= 8 ? "Muito alto" : uv >= 6 ? "Alto" : uv >= 3 ? "Moderado" : "Baixo"} destaque={uv >= 8} />
        <Item icone={Leaf} rotulo="Qualidade do ar" valor={ar?.us_aqi != null ? Math.round(ar.us_aqi) : "—"} detalhe={qAr.texto} destaque={qAr.nivel === "atencao"} />
        <Item icone={Gauge} rotulo="Pressão" valor={`${Math.round(a.surface_pressure)} hPa`} />
        <Item icone={Cloud} rotulo="Cobertura de nuvens" valor={`${a.cloud_cover}%`} />
        <Item icone={Droplets} rotulo="Chuva prevista hoje" valor={`${(d.precipitation_sum?.[0] ?? 0).toFixed(1).replace(".", ",")} mm`} />
      </div>
    </div>
  );
}
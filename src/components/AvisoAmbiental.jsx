import { motion } from "framer-motion";
import { CloudRain, CloudLightning, CloudFog, Thermometer, Snowflake, Wind, Sun, Droplets, Info, Clock, CalendarDays, TriangleAlert, CircleCheck, Route } from "lucide-react";

const ICONES = { tempestade: CloudLightning, chuva: CloudRain, calor: Thermometer, frio: Snowflake, vento: Wind, uv: Sun, seco: Droplets, neblina: CloudFog, info: Info, relogio: Clock, calendario: CalendarDays, alerta: TriangleAlert, ok: CircleCheck, rota: Route };

export default function AvisoAmbiental({ aviso, indice = 0 }) {
  const Icone = ICONES[aviso.icone] || Info;
  const atencao = aviso.nivel === "atencao";
  return (
    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: indice * 0.07, type: "spring", stiffness: 260, damping: 24 }} className={`flex items-start gap-3.5 rounded-2xl border p-4 ${atencao ? "border-ambar/70 bg-ambar/15" : "cartao rounded-2xl!"}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${atencao ? "bg-ambar/25 text-ambar-deep dark:text-ambar" : "bg-sage/20 text-sage-deep dark:text-sage"}`}><Icone size={20} /></span>
      <div className="min-w-0"><p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">{aviso.titulo}<span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${atencao ? "bg-ambar/30 text-ambar-deep dark:text-ambar" : "etiqueta"}`}>{aviso.rotulo ?? (atencao ? "Atenção" : "Informação")}</span></p><p className="mt-0.5 text-[0.9375rem] leading-relaxed opacity-85">{aviso.texto}</p></div>
    </motion.li>
  );
}
import { motion } from "framer-motion";
import { CloudRain, CloudLightning, CloudFog, Thermometer, Snowflake, Wind, Sun, Droplets, Info } from "lucide-react";

const ICONES = { tempestade: CloudLightning, chuva: CloudRain, calor: Thermometer, frio: Snowflake, vento: Wind, uv: Sun, seco: Droplets, neblina: CloudFog, info: Info };

export default function AvisoAmbiental({ aviso, indice = 0 }) {
  const Icone = ICONES[aviso.icone] || Info;
  const atencao = aviso.nivel === "atencao";
  return (
    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: indice * 0.07, type: "spring", stiffness: 260, damping: 24 }} className={`flex items-start gap-3 rounded-2xl border p-4 ${atencao ? "border-violet-glow/70 bg-violet-glow/15" : "border-silver/40 bg-pearl-light/70 dark:bg-forest/50"}`}>
      <Icone size={24} className="mt-0.5 shrink-0 text-violet-glow dark:text-sage" />
      <div><p className="font-semibold">{aviso.titulo}<span className="ml-2 rounded-full border border-current px-2 py-0.5 text-xs font-normal opacity-80">{atencao ? "Atenção" : "Informação"}</span></p><p className="text-sm opacity-90">{aviso.texto}</p></div>
    </motion.li>
  );
}
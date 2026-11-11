import { motion } from "framer-motion";
import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudRain, CloudLightning, Snowflake, Droplets, Wind, Thermometer, MapPin } from "lucide-react";
import { descreverClima } from "../utils/clima";
import useReducedMotion from "../hooks/useReducedMotion";

const ICONES = { sol: Sun, "nuvem-sol": CloudSun, nuvem: Cloud, neblina: CloudFog, chuva: CloudRain, tempestade: CloudLightning, neve: Snowflake };
const ICONES_NOITE = { sol: Moon, "nuvem-sol": CloudMoon };
const ESTILOS = {
  sol: "from-[#9AEAD5] via-[#8FD6A4] to-[#3f9d86] text-moss",
  "nuvem-sol": "from-[#bfeee0] via-[#a9d8c4] to-[#5aa593] text-moss",
  nuvem: "from-[#d3d9de] via-[#b4bec6] to-[#8a959e] text-moss",
  neblina: "from-[#e1e6ea] to-[#a7b1b9] text-moss",
  chuva: "from-[#4b5f8a] to-[#1d2a44] text-white",
  tempestade: "from-[#3b2fb8] to-[#10091f] text-white",
  neve: "from-[#eef5f8] to-[#a9bcc8] text-moss",
};
const ESTILO_NOITE = "from-[#1d3a33] to-[#07100d] text-white";

export default function CartaoClima({ cidade, atual }) {
  const calmo = useReducedMotion();
  const { texto, tipo } = descreverClima(atual.weather_code);
  const noite = atual.is_day === 0 && Boolean(ICONES_NOITE[tipo]);
  const Icone = noite ? ICONES_NOITE[tipo] : ICONES[tipo] || Cloud;
  const estilo = noite ? ESTILO_NOITE : ESTILOS[tipo] || ESTILOS.nuvem;
  return (
    <motion.section key={`${tipo}-${noite}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} aria-label={`Clima em ${cidade.nome}`} className={`rounded-3xl bg-linear-to-br p-6 shadow-xl md:p-8 ${estilo}`}>
      <p className="flex items-center gap-2 text-sm font-medium"><MapPin size={16} />{cidade.nome}{cidade.estado ? `, ${cidade.estado}` : ""}</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div><p className="text-7xl font-bold leading-none md:text-8xl">{Math.round(atual.temperature_2m)}°</p><p className="mt-2 text-lg">{texto}</p><p className="text-sm">Sensação de {Math.round(atual.apparent_temperature)}°C</p></div>
        <motion.div aria-hidden="true" animate={calmo ? {} : { y: [0, -10, 0], rotate: [0, 3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}><Icone size={110} strokeWidth={1.3} /></motion.div>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-black/15 p-3"><dt className="flex items-center gap-1"><Droplets size={14} />Umidade</dt><dd className="text-lg font-semibold">{atual.relative_humidity_2m}%</dd></div>
        <div className="rounded-2xl bg-black/15 p-3"><dt className="flex items-center gap-1"><Wind size={14} />Vento</dt><dd className="text-lg font-semibold">{Math.round(atual.wind_speed_10m)} km/h</dd></div>
        <div className="rounded-2xl bg-black/15 p-3"><dt className="flex items-center gap-1"><Thermometer size={14} />Chuva agora</dt><dd className="text-lg font-semibold">{atual.precipitation} mm</dd></div>
      </dl>
    </motion.section>
  );
}
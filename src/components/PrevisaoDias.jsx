import { motion } from "framer-motion";
import { descreverClima } from "../utils/clima";

const nomeDia = (iso, i) => (i === 0 ? "Hoje" : i === 1 ? "Amanhã" : new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long" }));

export default function PrevisaoDias({ diario }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {diario.time.map((dia, i) => (
        <motion.li key={dia} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className="rounded-2xl border border-silver/40 bg-pearl-light/70 p-4 dark:bg-forest/50">
          <p className="font-semibold capitalize">{nomeDia(dia, i)}</p>
          <p className="text-sm opacity-80">{descreverClima(diario.weather_code[i]).texto}</p>
          <p className="mt-2 text-lg"><span className="font-bold">{Math.round(diario.temperature_2m_max[i])}°</span> <span className="opacity-70">{Math.round(diario.temperature_2m_min[i])}°</span></p>
          <p className="text-sm opacity-80">Chance de chuva: {diario.precipitation_probability_max[i] ?? "—"}%</p>
        </motion.li>
      ))}
    </ul>
  );
}
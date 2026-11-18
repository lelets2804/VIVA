import { motion } from "framer-motion";
import { descreverClima } from "../utils/clima";

const nomeDia = (iso, i) => (i === 0 ? "Hoje" : i === 1 ? "Amanhã" : new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long" }));

export default function PrevisaoDias({ diario }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {diario.time.map((dia, i) => (
        <motion.li key={dia} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="cartao rounded-2xl! p-5">
          <p className="font-semibold capitalize">{nomeDia(dia, i)}</p>
          <p className="text-sm opacity-80">{descreverClima(diario.weather_code[i]).texto}</p>
          <p className="mt-3 font-display text-3xl tracking-tight tabular-nums"><span>{Math.round(diario.temperature_2m_max[i])}°</span> <span className="text-xl opacity-55">{Math.round(diario.temperature_2m_min[i])}°</span></p>
          <p className="mt-1 text-sm opacity-80">Chance de chuva: {diario.precipitation_probability_max[i] ?? "—"}%</p>
        </motion.li>
      ))}
    </ul>
  );
}
import { motion } from "framer-motion";
import { getSaudacao, getDataExtensa } from "../utils/saudacao";

export default function Dashboard() {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <p className="text-sm capitalize opacity-70">{getDataExtensa()}</p>
      <h1 className="text-4xl font-bold text-silver-metal md:text-5xl">{getSaudacao()}!</h1>
      <p className="mt-2 max-w-xl opacity-80">Aqui está o resumo da sua rotina de hoje.</p>
    </motion.section>
  );
}
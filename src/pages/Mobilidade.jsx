import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import useClima from "../hooks/useClima";
import { gerarAvisos } from "../utils/clima";
import BuscaCidade from "../components/BuscaCidade";
import CartaoClima from "../components/CartaoClima";
import AvisoAmbiental from "../components/AvisoAmbiental";
import PrevisaoDias from "../components/PrevisaoDias";

export default function Mobilidade() {
  const { cidade, dados, carregando, erro, trocarCidade, atualizar } = useClima();
  const avisos = dados ? gerarAvisos(dados.current, dados.daily) : [];
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-4xl font-bold text-silver-metal md:text-5xl">Mobilidade</h1><p className="mt-2 opacity-80">Condições do clima para planejar o seu deslocamento.</p></div>
        <button onClick={atualizar} disabled={carregando} className="flex items-center gap-2 rounded-xl border border-silver/60 px-4 py-2 hover:bg-sage/15 disabled:opacity-60"><RefreshCw size={18} className={carregando ? "animate-spin" : ""} />Atualizar</button>
      </header>
      <div className="mb-6 max-w-xl"><BuscaCidade aoEscolher={trocarCidade} /></div>
      {erro && <p role="alert" className="mb-6 rounded-xl border border-red-400/60 bg-red-500/10 p-4 text-sm">{erro}</p>}
      {carregando && !dados && <p aria-live="polite" className="opacity-70">Consultando o clima…</p>}
      {dados && (
        <>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <CartaoClima cidade={cidade} atual={dados.current} />
            <div><h2 className="mb-3 text-xl font-semibold">Avisos para o seu deslocamento</h2><ul className="flex flex-col gap-3">{avisos.map((a, i) => <AvisoAmbiental key={a.id} aviso={a} indice={i} />)}</ul></div>
          </div>
          <h2 className="mb-3 mt-10 text-xl font-semibold">Próximos dias</h2>
          <PrevisaoDias diario={dados.daily} />
        </>
      )}
      <p className="mt-10 text-xs opacity-70">Dados meteorológicos de <a href="https://open-meteo.com/" className="underline" target="_blank" rel="noreferrer">Open-Meteo.com</a>. Os avisos são apenas informativos e não garantem a segurança de um trajeto.</p>
    </motion.section>
  );
}
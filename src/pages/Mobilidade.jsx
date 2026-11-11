import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import useClima from "../hooks/useClima";
import useCena from "../hooks/useCena";
import useTrajeto from "../hooks/useTrajeto";
import { gerarAvisos, gerarRecomendacoes } from "../utils/clima";
import BuscaCidade from "../components/BuscaCidade";
import BotaoLocalizacao from "../components/BotaoLocalizacao";
import CartaoClima from "../components/CartaoClima";
import ClimaAmpliado from "../components/ClimaAmpliado";
import AvisoAmbiental from "../components/AvisoAmbiental";
import PrevisaoDias from "../components/PrevisaoDias";
import RastreadorTrajeto from "../components/RastreadorTrajeto";
import TituloPagina from "../components/TituloPagina";

export default function Mobilidade() {
  const { cidade, dados, ar, carregando, erro, trocarCidade, atualizar } = useClima();
  const { hora, rotina } = useCena();
  const trajeto = useTrajeto();
  const avisos = dados ? gerarAvisos(dados.current, dados.daily) : [];
  const recomendacoes = dados ? gerarRecomendacoes({ dados, ar, hora, lembretes: rotina.lembretes }).map((r) => ({ ...r, nivel: "info", rotulo: "Dica" })) : [];
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <TituloPagina sub="Clima, recomendações e acompanhamento do seu deslocamento.">Mobilidade</TituloPagina>
        <button onClick={atualizar} disabled={carregando} className="flex items-center gap-2 rounded-xl border border-silver/60 px-4 py-2 hover:bg-sage/15 disabled:opacity-60"><RefreshCw size={18} className={carregando ? "animate-spin" : ""} />Atualizar</button>
      </header>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start"><div className="max-w-xl flex-1"><BuscaCidade aoEscolher={trocarCidade} /></div><BotaoLocalizacao aoLocalizar={trocarCidade} /></div>
      {erro && <p role="alert" className="mb-6 rounded-xl border border-red-400/60 bg-red-500/10 p-4 text-sm">{erro}</p>}
      {carregando && !dados && <p aria-live="polite" className="opacity-70">Consultando o clima…</p>}
      {dados && (
        <>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <CartaoClima cidade={cidade} atual={dados.current} />
            <div><h2 className="mb-3 text-xl font-semibold">Avisos para o seu deslocamento</h2><ul className="flex flex-col gap-3">{avisos.map((a, i) => <AvisoAmbiental key={a.id} aviso={a} indice={i} />)}</ul></div>
          </div>
          <h2 className="mb-3 mt-10 text-xl font-semibold">Recomendações para agora</h2>
          <ul className="grid gap-3 md:grid-cols-2">{recomendacoes.map((r, i) => <AvisoAmbiental key={r.id} aviso={r} indice={i} />)}</ul>
          <div className="mt-10"><ClimaAmpliado dados={dados} ar={ar} /></div>
          <h2 className="mb-3 mt-10 text-xl font-semibold">Próximos dias</h2>
          <PrevisaoDias diario={dados.daily} />
        </>
      )}
      <div className="mt-12"><RastreadorTrajeto trajeto={trajeto} /></div>
      <p className="mt-10 text-xs opacity-70">Dados meteorológicos de <a href="https://open-meteo.com/" className="underline" target="_blank" rel="noreferrer">Open-Meteo.com</a>. Os avisos e recomendações são apenas informativos e não garantem a segurança de um trajeto.</p>
    </motion.section>
  );
}
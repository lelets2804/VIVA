import { motion } from "framer-motion";
import { RefreshCw, MapPin, Route, Waves, Car, Info, ExternalLink } from "lucide-react";
import useClima from "../hooks/useClima";
import { gerarAvisos } from "../utils/clima";
import BuscaCidade from "../components/BuscaCidade";
import CartaoClima from "../components/CartaoClima";
import AvisoAmbiental from "../components/AvisoAmbiental";
import PrevisaoDias from "../components/PrevisaoDias";
import TituloPagina from "../components/TituloPagina";

export default function Mobilidade() {
  const { cidade, dados, carregando, erro, trocarCidade, atualizar } = useClima();
  const avisos = dados ? gerarAvisos(dados.current, dados.daily) : [];

  const mapaTransito = "https://embed.waze.com/iframe?zoom=12&lat=-23.55052&lon=-46.63331&pin=1&desc=1";
  const painelCGE = "https://www.cgesp.org/v3/alagamentos.jsp";

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-auto mx-auto max-w-6xl">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <TituloPagina sobre="Módulo 03" sub="Trânsito, alagamentos e o clima de São Paulo antes de você sair de casa.">Mobilidade</TituloPagina>
        <button onClick={atualizar} disabled={carregando} className="btn btn-secundario">
          <RefreshCw size={18} className={carregando ? "animate-spin" : ""} />
          Atualizar clima
        </button>
      </header>

      <section className="cartao mb-8 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-5 md:p-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage/25 text-forest dark:text-sage"><Car size={25} /></span>
          <div>
            <h2 className="text-2xl">Trânsito em São Paulo</h2>
            <p className="text-sm opacity-70">Mapa com informações de trânsito e opções de consulta de trajetos.</p>
          </div>
          <span className="etiqueta ml-auto">São Paulo - SP</span>
        </div>

        <div className="overflow-hidden border-y border-silver/30">
          <iframe title="Mapa de trânsito de São Paulo" src={mapaTransito} className="h-120 w-full border-0 md:h-145" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>

        <div className="flex items-start gap-3 p-5 md:p-6">
          <Info size={19} className="mt-0.5 shrink-0 opacity-70" />
          <p className="text-sm leading-relaxed opacity-75">
            O mapa é fornecido pelo Waze e abre diretamente nesta página. Utilize a busca e as opções disponíveis dentro do próprio mapa para consultar trajetos. A visualização está centralizada na cidade de São Paulo, mas o mapa pode permitir navegação para outras localidades.
          </p>
        </div>
      </section>

      <section className="cartao mb-8 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-5 md:p-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage/25 text-forest dark:text-sage"><Waves size={25} /></span>
          <div>
            <h2 className="text-2xl">Alagamentos em São Paulo</h2>
            <p className="text-sm opacity-70">Consulte os registros de pontos de alagamento monitorados pelo CGE.</p>
          </div>
          <span className="etiqueta ml-auto">CGE - SP</span>
        </div>

        <div className="overflow-hidden border-y border-silver/30 bg-white">
          <iframe
            title="Painel de alagamentos do CGE São Paulo"
            src={painelCGE}
            className="h-120 w-full border-0 md:h-160"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="flex items-start gap-3 p-5 md:p-6">
          <Info size={19} className="mt-0.5 shrink-0 opacity-70" />
          <div className="text-sm leading-relaxed opacity-75">
            <p>As informações são disponibilizadas pelo Centro de Gerenciamento de Emergências da Prefeitura de São Paulo. A exibição dentro do VIVVA depende das permissões de incorporação do próprio CGE.</p>
            <a href="https://www.cgesp.org/v3/alagamentos.jsp" target="_blank" rel="noreferrer" className="btn btn-secundario mt-4">
              Acessar painel oficial do CGE <ExternalLink size={14} />
            </a>
            <p className="mt-3 text-sm opacity-70">Se o painel não carregar acima, o site de origem pode estar bloqueando a exibição incorporada. Nesse caso, utilize o acesso oficial.</p>
          </div>
        </div>
      </section>

      <section className="cartao mb-8 p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage/25 text-forest dark:text-sage"><MapPin size={24} /></span>
          <div>
            <h2 className="text-2xl">Condições do tempo</h2>
            <p className="text-sm opacity-70">Consulte as condições climáticas que podem afetar os deslocamentos.</p>
          </div>
        </div>
        <div className="max-w-xl">
          <BuscaCidade aoEscolher={trocarCidade} />
        </div>
      </section>

      {erro && <p role="alert" className="nota-erro mb-6">{erro}</p>}
      {carregando && !dados && <p aria-live="polite" className="opacity-70">Consultando o clima…</p>}

      {dados && (
        <>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <CartaoClima cidade={cidade} atual={dados.current} />
            <div>
              <h2 className="mb-4 text-2xl">Avisos para o seu deslocamento</h2>
              <ul className="flex flex-col gap-3">
                {avisos.map((a, i) => <AvisoAmbiental key={a.id} aviso={a} indice={i} />)}
              </ul>
            </div>
          </div>
          <h2 className="mb-4 mt-12 text-2xl">Previsão para os próximos dias</h2>
          <PrevisaoDias diario={dados.daily} />
        </>
      )}

      <p className="mt-12 text-sm opacity-70">
        Dados meteorológicos de <a href="https://open-meteo.com/" className="underline" target="_blank" rel="noreferrer">Open-Meteo.com</a>. O trânsito é fornecido pelo Waze e os dados de alagamento pelo CGE. A disponibilidade e atualização das informações dependem dos serviços de origem.
      </p>
    </motion.section>
  );
}

import { motion } from "framer-motion";
import { RefreshCw, MapPin, Route, Waves, Car, Info, ExternalLink } from "lucide-react";
import useClima from "../hooks/useClima";
import { gerarAvisos } from "../utils/clima";
import BuscaCidade from "../components/BuscaCidade";
import CartaoClima from "../components/CartaoClima";
import AvisoAmbiental from "../components/AvisoAmbiental";
import PrevisaoDias from "../components/PrevisaoDias";

export default function Mobilidade() {
  const { cidade, dados, carregando, erro, trocarCidade, atualizar } = useClima();
  const avisos = dados ? gerarAvisos(dados.current, dados.daily) : [];

  const mapaTransito = "https://embed.waze.com/iframe?zoom=12&lat=-23.55052&lon=-46.63331&pin=1&desc=1";
  const painelCGE = "https://www.cgesp.org/v3/alagamentos.jsp";

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-auto mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-silver-metal md:text-5xl">Mobilidade</h1>
          <p className="mt-2 opacity-80">Acompanhe o trânsito, os pontos de alagamento e as condições climáticas da cidade de São Paulo.</p>
        </div>
        <button onClick={atualizar} disabled={carregando} className="flex items-center gap-2 rounded-xl border border-silver/60 px-4 py-2 hover:bg-sage/15 disabled:opacity-60">
          <RefreshCw size={18} className={carregando ? "animate-spin" : ""} />
          Atualizar clima
        </button>
      </header>

      <section className="mb-8 overflow-hidden rounded-3xl border border-silver/40 bg-white/70 shadow-lg backdrop-blur dark:bg-forest/65">
        <div className="flex flex-wrap items-center gap-3 p-5 md:p-7">
          <span className="rounded-2xl bg-sage/25 p-3 text-forest dark:text-sage"><Car size={25} /></span>
          <div>
            <h2 className="text-xl font-semibold">Trânsito em São Paulo</h2>
            <p className="text-sm opacity-70">Mapa com informações de trânsito e opções de consulta de trajetos.</p>
          </div>
          <span className="ml-auto rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-forest dark:text-sage">São Paulo - SP</span>
        </div>

        <div className="overflow-hidden border-y border-silver/30">
          <iframe
            title="Mapa de trânsito de São Paulo"
            src={mapaTransito}
            className="h-120 w-full border-0 md:h-145"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="flex items-start gap-3 p-5 md:p-6">
          <Info size={19} className="mt-0.5 shrink-0 opacity-70" />
          <p className="text-sm leading-relaxed opacity-75">
            O mapa é fornecido pelo Waze e abre diretamente nesta página. Utilize a busca e as opções disponíveis dentro do próprio mapa para consultar trajetos. A visualização está centralizada na cidade de São Paulo, mas o mapa pode permitir navegação para outras localidades.
          </p>
        </div>
      </section>

      <section className="mb-8 overflow-hidden rounded-3xl border border-silver/40 bg-white/70 shadow-lg backdrop-blur dark:bg-forest/65">
        <div className="flex flex-wrap items-center gap-3 p-5 md:p-7">
          <span className="rounded-2xl bg-sage/25 p-3 text-forest dark:text-sage"><Waves size={25} /></span>
          <div>
            <h2 className="text-xl font-semibold">Alagamentos em São Paulo</h2>
            <p className="text-sm opacity-70">Consulte os registros de pontos de alagamento monitorados pelo CGE.</p>
          </div>
          <span className="ml-auto rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-forest dark:text-sage">CGE - SP</span>
        </div>

        <div className="overflow-hidden border-y border-silver/30 bg-white">
          <iframe
            title="Painel de alagamentos do CGE São Paulo"
            src={painelCGE}
            className="md-h-700 w-full border-0 md:h-700"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="flex items-start gap-3 p-5 md:p-6">
          <Info size={19} className="mt-0.5 shrink-0 opacity-70" />
          <div className="text-sm leading-relaxed opacity-75">
            <p>As informações são disponibilizadas pelo Centro de Gerenciamento de Emergências da Prefeitura de São Paulo. A exibição dentro do VIVVA depende das permissões de incorporação do próprio CGE.</p>
            <a href="https://www.cgesp.org/v3/alagamentos.jsp" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold underline">
              Acessar painel oficial do CGE <ExternalLink size={14} />
            </a>
            <p className="mt-2 text-xs opacity-70">Se o painel não carregar acima, o site de origem pode estar bloqueando a exibição incorporada. Nesse caso, utilize o acesso oficial.</p>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-3xl border border-silver/40 bg-white/70 p-5 shadow-lg backdrop-blur dark:bg-forest/65 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-2xl bg-sage/25 p-3 text-forest dark:text-sage"><MapPin size={24} /></span>
          <div>
            <h2 className="text-xl font-semibold">Condições do tempo</h2>
            <p className="text-sm opacity-70">Consulte as condições climáticas que podem afetar os deslocamentos.</p>
          </div>
        </div>
        <div className="max-w-xl">
          <BuscaCidade aoEscolher={trocarCidade} />
        </div>
      </section>

      {erro && <p role="alert" className="mb-6 rounded-xl border border-red-400/60 bg-red-500/10 p-4 text-sm">{erro}</p>}
      {carregando && !dados && <p aria-live="polite" className="opacity-70">Consultando o clima…</p>}

      {dados && (
        <>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <CartaoClima cidade={cidade} atual={dados.current} />
            <div>
              <h2 className="mb-3 text-xl font-semibold">Avisos para o seu deslocamento</h2>
              <ul className="flex flex-col gap-3">
                {avisos.map((a, i) => <AvisoAmbiental key={a.id} aviso={a} indice={i} />)}
              </ul>
            </div>
          </div>
          <h2 className="mb-3 mt-10 text-xl font-semibold">Previsão para os próximos dias</h2>
          <PrevisaoDias diario={dados.daily} />
        </>
      )}

      <p className="mt-10 text-xs opacity-70">
        Dados meteorológicos de <a href="https://open-meteo.com/" className="underline" target="_blank" rel="noreferrer">Open-Meteo.com</a>. O trânsito é fornecido pelo Waze e os dados de alagamento pelo CGE. A disponibilidade e atualização das informações dependem dos serviços de origem.
      </p>
    </motion.section>
  );
}

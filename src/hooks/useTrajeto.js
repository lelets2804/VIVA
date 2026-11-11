import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { listarTrajetos, salvarTrajeto, excluirTrajeto } from "../services/trajetosService";
import { distanciaM, distanciaTotal, simplificar } from "../utils/geo";

export default function useTrajeto() {
  const [historico, setHistorico] = useState([]);
  const [gravando, setGravando] = useState(false);
  const [pontos, setPontos] = useState([]);
  const [inicio, setInicio] = useState(null);
  const [agora, setAgora] = useState(() => Date.now());
  const [erro, setErro] = useState(null);
  const watch = useRef(null);

  useEffect(() => { let ativo = true; listarTrajetos().then((l) => ativo && setHistorico(l)).catch(() => ativo && setErro("Não foi possível carregar os trajetos.")); return () => { ativo = false; }; }, []);
  useEffect(() => { if (!gravando) return; const id = setInterval(() => setAgora(Date.now()), 1000); return () => clearInterval(id); }, [gravando]);
  useEffect(() => () => { if (watch.current !== null) navigator.geolocation?.clearWatch(watch.current); }, []);

  const iniciar = useCallback(() => {
    if (!("geolocation" in navigator)) { setErro("Seu navegador não oferece geolocalização."); return; }
    setErro(null); setPontos([]); setInicio(Date.now()); setAgora(Date.now()); setGravando(true);
    watch.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy > 100) return; // sinal fraco demais
        const novo = { lat: pos.coords.latitude, lon: pos.coords.longitude, t: pos.timestamp };
        setPontos((ps) => (ps.length > 0 && distanciaM(ps[ps.length - 1], novo) < 5 ? ps : [...ps, novo]));
      },
      (e) => { setErro(e.code === 1 ? "Permissão de localização negada. Libere o acesso nas configurações do navegador." : "Não foi possível obter sua localização."); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
  }, []);

  const parar = useCallback(async () => {
    if (watch.current !== null) { navigator.geolocation.clearWatch(watch.current); watch.current = null; }
    setGravando(false);
    if (pontos.length >= 2) {
      const fim = Date.now();
      const novo = await salvarTrajeto({ inicio, fim, duracaoS: Math.round((fim - inicio) / 1000), distanciaM: Math.round(distanciaTotal(pontos)), pontos: simplificar(pontos) });
      setHistorico((l) => [novo, ...l].slice(0, 40));
    } else if (inicio) setErro("Trajeto muito curto: nada foi salvo.");
    setPontos([]); setInicio(null);
  }, [pontos, inicio]);

  const remover = useCallback(async (id) => { await excluirTrajeto(id); setHistorico((l) => l.filter((t) => t.id !== id)); }, []);

  const distancia = useMemo(() => distanciaTotal(pontos), [pontos]);
  const duracaoS = gravando && inicio ? Math.max(0, Math.round((agora - inicio) / 1000)) : 0;
  const velocidadeKmh = duracaoS > 0 ? (distancia / duracaoS) * 3.6 : 0;
  return { historico, gravando, pontos, distancia, duracaoS, velocidadeKmh, erro, iniciar, parar, remover };
}
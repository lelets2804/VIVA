import { useState, useEffect, useCallback } from "react";
import { buscarClima, buscarQualidadeAr } from "../services/climaService";

const CHAVE = "vivva-cidade";
const PADRAO = { nome: "São Paulo", estado: "São Paulo", pais: "Brasil", latitude: -23.5475, longitude: -46.6361 };
const lerCidade = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || PADRAO; } catch { return PADRAO; } };

export default function useClima() {
  const [cidade, setCidade] = useState(lerCidade);
  const [dados, setDados] = useState(null);
  const [ar, setAr] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    setCarregando(true);
    setErro(null);
    buscarClima(cidade, controle.signal).then(setDados).catch((e) => { if (e.name !== "AbortError") setErro("Não foi possível consultar o clima agora. Verifique sua conexão e tente de novo."); }).finally(() => { if (!controle.signal.aborted) setCarregando(false); });
    buscarQualidadeAr(cidade, controle.signal).then((r) => setAr(r.current || null)).catch(() => setAr(null));
    return () => controle.abort();
  }, [cidade, tentativa]);

  const trocarCidade = (nova) => { try { localStorage.setItem(CHAVE, JSON.stringify(nova)); } catch { /* sem armazenamento disponível */ } setCidade(nova); };
  const atualizar = useCallback(() => setTentativa((t) => t + 1), []);
  return { cidade, dados, ar, carregando, erro, trocarCidade, atualizar };
}
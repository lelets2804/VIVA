import { useState } from "react";
import { buscarCidades } from "../services/climaService";

export default function useBuscaCidade() {
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const buscar = async (texto) => {
    const nome = texto.trim();
    if (nome.length < 2) { setMensagem("Digite pelo menos 2 letras."); setResultados([]); return; }
    try { setBuscando(true); setMensagem(""); const lista = await buscarCidades(nome); setResultados(lista); if (lista.length === 0) setMensagem("Nenhuma cidade encontrada. Confira o nome."); } catch { setMensagem("Não foi possível buscar agora. Tente de novo."); setResultados([]); } finally { setBuscando(false); }
  };
  const limpar = () => { setResultados([]); setMensagem(""); };
  return { resultados, buscando, mensagem, buscar, limpar };
}
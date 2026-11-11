import { useState, useEffect } from "react";
import { listarAlertas, registrarAlerta } from "../services/segurancaService";

export default function useAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    listarAlertas().then((l) => ativo && setAlertas(l)).catch(() => ativo && setErro("Não foi possível carregar o histórico.")).finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, []);

  const acionarSOS = async (totalContatos) => {
    try { setErro(null); const novo = await registrarAlerta({ tipo: "SOS demonstrativo", totalContatos }); setAlertas((l) => [novo, ...l].slice(0, 50)); return novo; } catch { setErro("Não foi possível registrar o alerta."); return null; }
  };

  return { alertas, carregando, erro, acionarSOS };
}
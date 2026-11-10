import { useState, useEffect } from "react";
import { listarLembretes, criarLembrete, atualizarLembrete, excluirLembrete } from "../services/lembretesService";

export default function useLembretes() {
  const [lembretes, setLembretes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    listarLembretes().then((l) => ativo && setLembretes(l)).catch(() => ativo && setErro("Não foi possível carregar os lembretes.")).finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, []);

  const executar = async (acao) => { try { setErro(null); await acao(); } catch { setErro("Algo deu errado. Tente novamente."); } };
  const adicionar = (dados) => executar(async () => { const novo = await criarLembrete(dados); setLembretes((l) => [novo, ...l]); });
  const editar = (id, dados) => executar(async () => { const atualizado = await atualizarLembrete(id, dados); setLembretes((l) => l.map((x) => (x.id === id ? atualizado : x))); });
  const remover = (id) => executar(async () => { await excluirLembrete(id); setLembretes((l) => l.filter((x) => x.id !== id)); });
  const alternar = (id) => { const atual = lembretes.find((l) => l.id === id); if (!atual) return Promise.resolve(); const concluido = !atual.concluido; return editar(id, { concluido, concluidoEm: concluido ? new Date().toISOString() : null }); };

  const total = lembretes.length;
  const concluidos = lembretes.filter((l) => l.concluido).length;
  const progresso = total === 0 ? 0 : Math.round((concluidos / total) * 100);
  return { lembretes, carregando, erro, adicionar, editar, alternar, remover, total, concluidos, progresso };
}
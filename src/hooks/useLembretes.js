import { useState, useEffect, useCallback, useMemo } from "react";
import { listarLembretes, criarLembrete, atualizarLembrete, excluirLembrete } from "../services/lembretesService";

export default function useLembretes() {
  const [lembretes, setLembretes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    listarLembretes()
      .then((dados) => {
        if (ativo) setLembretes(dados);
      })
      .catch((error) => {
        if (ativo) setErro(error.message || "Não foi possível carregar os lembretes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const executar = useCallback(async (acao) => {
    try {
      setErro(null);
      await acao();
      return true;
    } catch (error) {
      setErro(error.message || "Algo deu errado. Tente novamente.");
      return false;
    }
  }, []);

  const adicionar = useCallback((dados) =>
    executar(async () => {
      const novo = await criarLembrete(dados);
      setLembretes((lista) => [novo, ...lista]);
    }), [executar]);

  const editar = useCallback((id, dados) =>
    executar(async () => {
      const atualizado = await atualizarLembrete(id, dados);
      setLembretes((lista) => lista.map((item) => (item.id === id ? atualizado : item)));
    }), [executar]);

  const remover = useCallback((id) =>
    executar(async () => {
      await excluirLembrete(id);
      setLembretes((lista) => lista.filter((item) => item.id !== id));
    }), [executar]);

  const alternar = useCallback((id) => {
    const atual = lembretes.find((item) => item.id === id);
    if (!atual) return Promise.resolve(false);

    const concluido = !atual.concluido;
    return editar(id, { concluido, concluidoEm: concluido ? new Date().toISOString() : null });
  }, [lembretes, editar]);

  // Objeto estável: só muda quando os dados mudam de verdade
  return useMemo(() => {
    const total = lembretes.length;
    const concluidos = lembretes.filter((item) => item.concluido).length;
    const progresso = total === 0 ? 0 : Math.round((concluidos / total) * 100);
    return { lembretes, carregando, erro, adicionar, editar, alternar, remover, total, concluidos, progresso };
  }, [lembretes, carregando, erro, adicionar, editar, alternar, remover]);
}
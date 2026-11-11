import { useState, useEffect } from "react";
import { listarContatos, criarContato, atualizarContato, excluirContato } from "../services/segurancaService";

export default function useContatos() {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    listarContatos().then((l) => ativo && setContatos(l)).catch(() => ativo && setErro("Não foi possível carregar os contatos.")).finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, []);

  const executar = async (acao) => { try { setErro(null); await acao(); } catch { setErro("Algo deu errado. Tente novamente."); } };
  const adicionar = (dados) => executar(async () => { const novo = await criarContato(dados); setContatos((l) => [novo, ...l]); });
  const editar = (id, dados) => executar(async () => { const atualizado = await atualizarContato(id, dados); setContatos((l) => l.map((c) => (c.id === id ? atualizado : c))); });
  const remover = (id) => executar(async () => { await excluirContato(id); setContatos((l) => l.filter((c) => c.id !== id)); });

  return { contatos, carregando, erro, adicionar, editar, remover };
}
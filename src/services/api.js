const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function requisicao(caminho, { metodo = "GET", corpo, sinal } = {}) {
  const resposta = await fetch(`${BASE}${caminho}`, {
    method: metodo,
    headers: corpo ? { "Content-Type": "application/json" } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
    signal: sinal,
  });
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.status === 204 ? null : resposta.json();
}

export const maisRecentesPrimeiro = (lista) =>
  [...lista].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const TABELA = `${SUPABASE_URL}/rest/v1/lembretes`;

async function requisicao(url, opcoes = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Configure as variáveis do Supabase no arquivo .env.");
  }

  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(`Erro na API (${resposta.status}): ${detalhe}`);
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json();
  return Array.isArray(dados) ? dados : [dados];
}

function normalizar(lembrete) {
  return {
    id: lembrete.id,
    titulo: lembrete.titulo,
    horario: lembrete.horario || "",
    categoria: lembrete.categoria,
    concluido: lembrete.concluido,
    concluidoEm: lembrete.concluido_em,
    criadoEm: lembrete.criado_em,
  };
}

// READ: consulta todos os lembretes
export async function listarLembretes() {
  const dados = await requisicao(`${TABELA}?select=*&order=criado_em.desc`);
  return dados.map(normalizar);
}

// CREATE: cadastra um novo lembrete
export async function criarLembrete(dados) {
  const resposta = await requisicao(TABELA, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      titulo: dados.titulo,
      horario: dados.horario || null,
      categoria: dados.categoria || "Pessoal",
      concluido: false,
      concluido_em: null,
    }),
  });

  return normalizar(resposta[0]);
}

// UPDATE: atualiza um lembrete existente
export async function atualizarLembrete(id, mudancas) {
  const corpo = {};

  if (mudancas.titulo !== undefined) corpo.titulo = mudancas.titulo;
  if (mudancas.horario !== undefined) corpo.horario = mudancas.horario || null;
  if (mudancas.categoria !== undefined) corpo.categoria = mudancas.categoria;
  if (mudancas.concluido !== undefined) corpo.concluido = mudancas.concluido;
  if (mudancas.concluidoEm !== undefined) corpo.concluido_em = mudancas.concluidoEm;

  const resposta = await requisicao(`${TABELA}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(corpo),
  });

  if (!resposta.length) throw new Error("Lembrete não encontrado.");
  return normalizar(resposta[0]);
}

// DELETE: exclui um lembrete
export async function excluirLembrete(id) {
  await requisicao(`${TABELA}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

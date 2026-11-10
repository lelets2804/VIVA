const CHAVE = "vivva-lembretes";
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch { return []; } };
const gravar = (lista) => { try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch { /* sem armazenamento disponível */ } };
const espera = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function listarLembretes() { await espera(); return ler(); }
export async function criarLembrete(dados) { await espera(); const novo = { id: crypto.randomUUID(), concluido: false, concluidoEm: null, criadoEm: new Date().toISOString(), ...dados }; gravar([novo, ...ler()]); return novo; }
export async function atualizarLembrete(id, mudancas) { await espera(); const lista = ler().map((l) => (l.id === id ? { ...l, ...mudancas } : l)); gravar(lista); return lista.find((l) => l.id === id); }
export async function excluirLembrete(id) { await espera(); gravar(ler().filter((l) => l.id !== id)); }
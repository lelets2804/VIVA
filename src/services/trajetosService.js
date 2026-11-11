const CHAVE = "vivva-trajetos";
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch { return []; } };
const gravar = (lista) => { try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch { /* sem armazenamento disponível */ } };
const espera = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function listarTrajetos() { await espera(); return ler(); }
export async function salvarTrajeto(dados) { await espera(); const novo = { id: crypto.randomUUID(), ...dados }; gravar([novo, ...ler()].slice(0, 40)); return novo; }
export async function excluirTrajeto(id) { await espera(); gravar(ler().filter((t) => t.id !== id)); }
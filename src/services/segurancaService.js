const CHAVE_CONTATOS = "vivva-contatos";
const CHAVE_ALERTAS = "vivva-alertas";
const ler = (chave) => { try { return JSON.parse(localStorage.getItem(chave)) || []; } catch { return []; } };
const gravar = (chave, lista) => { try { localStorage.setItem(chave, JSON.stringify(lista)); } catch { /* sem armazenamento disponível */ } };
const espera = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function listarContatos() { await espera(); return ler(CHAVE_CONTATOS); }
export async function criarContato(dados) { await espera(); const novo = { id: crypto.randomUUID(), criadoEm: new Date().toISOString(), ...dados }; gravar(CHAVE_CONTATOS, [novo, ...ler(CHAVE_CONTATOS)]); return novo; }
export async function atualizarContato(id, mudancas) { await espera(); const lista = ler(CHAVE_CONTATOS).map((c) => (c.id === id ? { ...c, ...mudancas } : c)); gravar(CHAVE_CONTATOS, lista); return lista.find((c) => c.id === id); }
export async function excluirContato(id) { await espera(); gravar(CHAVE_CONTATOS, ler(CHAVE_CONTATOS).filter((c) => c.id !== id)); }

export async function listarAlertas() { await espera(); return ler(CHAVE_ALERTAS); }
export async function registrarAlerta(dados) { await espera(); const novo = { id: crypto.randomUUID(), criadoEm: new Date().toISOString(), ...dados }; gravar(CHAVE_ALERTAS, [novo, ...ler(CHAVE_ALERTAS)].slice(0, 50)); return novo; }
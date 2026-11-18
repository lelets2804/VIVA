const TEMA = "viva-theme";
const CIDADE = "vivva-cidade";

export const CIDADE_PADRAO = { nome: "São Paulo", estado: "São Paulo", pais: "Brasil", latitude: -23.5475, longitude: -46.6361 };

export function lerTema() {
  try { return localStorage.getItem(TEMA) || "dark"; } catch { return "dark"; }
}
export function gravarTema(tema) {
  try { localStorage.setItem(TEMA, tema); } catch { /* sem armazenamento disponível */ }
}
export function lerCidade() {
  try { return JSON.parse(localStorage.getItem(CIDADE)) || CIDADE_PADRAO; } catch { return CIDADE_PADRAO; }
}
export function gravarCidade(cidade) {
  try { localStorage.setItem(CIDADE, JSON.stringify(cidade)); } catch { /* sem armazenamento disponível */ }
}
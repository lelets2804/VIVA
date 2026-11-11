export const distanciaM = (a, b) => {
  const R = 6371000, rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
export const distanciaTotal = (pontos) => pontos.reduce((t, p, i) => (i === 0 ? 0 : t + distanciaM(pontos[i - 1], p)), 0);
export const formatarDistancia = (m) => (m >= 1000 ? `${(m / 1000).toFixed(2).replace(".", ",")} km` : `${Math.round(m)} m`);
export const formatarDuracao = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), seg = Math.floor(s % 60); return h > 0 ? `${h}h ${String(m).padStart(2, "0")}min` : `${m}min ${String(seg).padStart(2, "0")}s`; };
// Reduz o número de pontos guardados para não encher o localStorage.
export const simplificar = (pontos, max = 300) => { if (pontos.length <= max) return pontos; const passo = pontos.length / max; return Array.from({ length: max }, (_, i) => pontos[Math.floor(i * passo)]).concat(pontos[pontos.length - 1]); };
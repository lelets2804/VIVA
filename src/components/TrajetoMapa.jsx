// Desenho simples do percurso (sem mapa de fundo): o traçado é normalizado para caber na caixa.
export default function TrajetoMapa({ pontos, altura = 160 }) {
  if (!pontos || pontos.length < 2) return <div style={{ height: altura }} className="flex items-center justify-center rounded-2xl border border-dashed border-silver/50 text-sm opacity-70">Sem pontos suficientes</div>;
  const lat0 = pontos[0].lat, k = Math.cos((lat0 * Math.PI) / 180);
  const xs = pontos.map((p) => p.lon * k), ys = pontos.map((p) => -p.lat);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const L = 300, A = 160, pad = 14;
  const esc = Math.min((L - 2 * pad) / (maxX - minX || 1e-9), (A - 2 * pad) / (maxY - minY || 1e-9));
  const ox = (L - (maxX - minX) * esc) / 2, oy = (A - (maxY - minY) * esc) / 2;
  const pts = xs.map((x, i) => [ox + (x - minX) * esc, oy + (ys[i] - minY) * esc]);
  const fim = pts[pts.length - 1];
  return (
    <svg role="img" aria-label="Desenho do trajeto" viewBox={`0 0 ${L} ${A}`} style={{ height: altura }} className="w-full rounded-2xl border border-silver/40 bg-black/10">
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#7C6CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[0][0]} cy={pts[0][1]} r="6" fill="#8FD6A4" />
      <circle cx={fim[0]} cy={fim[1]} r="6" fill="#7C6CFF" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
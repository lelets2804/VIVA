import { useState, useCallback } from "react";

const CORES = ["#8FD6A4", "#7C6CFF", "#E6EAED", "#9AEAD5"];

export default function useRajadas() {
  const [rajadas, setRajadas] = useState([]);
  const disparar = useCallback((x, y) => {
    const id = crypto.randomUUID();
    const particulas = Array.from({ length: 28 }, (_, i) => { const ang = (i / 28) * Math.PI * 2 + Math.random() * 0.4; const forca = 70 + Math.random() * 130; return { dx: Math.cos(ang) * forca, dy: Math.sin(ang) * forca, s: 0.6 + Math.random() * 1.4, rot: Math.random() * 540 - 270, dur: 0.8 + Math.random() * 0.6, cor: CORES[i % CORES.length] }; });
    setRajadas((r) => [...r, { id, x, y, particulas }]);
    setTimeout(() => setRajadas((r) => r.filter((b) => b.id !== id)), 1600);
  }, []);
  return { rajadas, disparar };
}
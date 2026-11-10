import { useState, useEffect } from "react";

export default function useReducedMotion() {
  const [reduzido, setReduzido] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = () => setReduzido(mq.matches);
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return reduzido;
}
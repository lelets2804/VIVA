import { createContext, useMemo, useRef, useState } from "react";
import useLembretes from "../hooks/useLembretes";

export const CenaContext = createContext(null);
const horaAgora = () => { const d = new Date(); return d.getHours() + d.getMinutes() / 60; };

export function CenaProvider({ children }) {
  const [foco, setFoco] = useState(null);
  const [hora, setHora] = useState(horaAgora);
  const scroll = useRef(0);
  const rotina = useLembretes();
  const valor = useMemo(() => ({ foco, setFoco, hora, setHora, horaAgora, scroll, rotina }), [foco, hora, rotina]);
  return <CenaContext.Provider value={valor}>{children}</CenaContext.Provider>;
}
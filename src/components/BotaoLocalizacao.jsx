import { useState } from "react";
import { LocateFixed } from "lucide-react";

export default function BotaoLocalizacao({ aoLocalizar }) {
  const [buscando, setBuscando] = useState(false);
  const [msg, setMsg] = useState("");
  const usar = () => {
    if (!("geolocation" in navigator)) { setMsg("Seu navegador não oferece geolocalização."); return; }
    setBuscando(true); setMsg("");
    navigator.geolocation.getCurrentPosition(
      (p) => { aoLocalizar({ nome: "Minha localização", estado: "", pais: "", latitude: p.coords.latitude, longitude: p.coords.longitude }); setBuscando(false); },
      (e) => { setMsg(e.code === 1 ? "Permissão negada. Libere a localização no navegador ou busque uma cidade." : "Não foi possível obter sua localização."); setBuscando(false); },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  };
  return (
    <div>
      <button onClick={usar} disabled={buscando} className="flex items-center gap-2 rounded-xl border border-silver/60 px-4 py-3 hover:bg-sage/15 disabled:opacity-60"><LocateFixed size={18} className={buscando ? "animate-pulse" : ""} />{buscando ? "Localizando…" : "Usar minha localização"}</button>
      <p aria-live="polite" className="mt-1 text-xs opacity-80">{msg}</p>
    </div>
  );
}
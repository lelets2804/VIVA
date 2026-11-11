import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useReducedMotion from "../hooks/useReducedMotion";

export default function BotaoSOS({ aoConfirmar, totalContatos }) {
  const calmo = useReducedMotion();
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => { if (!aberto) return; const tecla = (e) => e.key === "Escape" && setAberto(false); window.addEventListener("keydown", tecla); return () => window.removeEventListener("keydown", tecla); }, [aberto]);
  useEffect(() => { if (!ativo) return; const id = setTimeout(() => setAtivo(false), 4500); return () => clearTimeout(id); }, [ativo]);

  const confirmar = async () => { setAberto(false); const registro = await aoConfirmar(); if (registro) setAtivo(true); };
  const contatosTexto = `${totalContatos} ${totalContatos === 1 ? "contato cadastrado" : "contatos cadastrados"}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-60 w-60 items-center justify-center">
        {!calmo && [0, 1, 2].map((i) => <motion.span key={i} aria-hidden="true" className="absolute h-40 w-40 rounded-full border-2 border-violet-glow" initial={{ scale: 0.8, opacity: 0 }} animate={ativo ? { scale: [1, 1.9], opacity: [0.9, 0] } : { scale: [1, 1.35], opacity: [0.35, 0] }} transition={{ duration: ativo ? 1.4 : 3.2, repeat: Infinity, delay: i * (ativo ? 0.35 : 1), ease: "easeOut" }} />)}
        <motion.button onClick={() => setAberto(true)} whileHover={calmo ? undefined : { scale: 1.06 }} whileTap={calmo ? undefined : { scale: 0.92 }} aria-label="Acionar SOS demonstrativo" className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#b9b0ff,#7C6CFF_55%,#3b2fb8)] text-4xl font-extrabold tracking-wide text-white shadow-[0_0_60px_rgba(124,108,255,0.55)] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sage">{ativo ? "✓" : "SOS"}</motion.button>
      </div>
      <p aria-live="polite" className="min-h-12 max-w-xs text-center text-sm">{ativo ? "Alerta demonstrativo registrado. Nenhuma ligação ou mensagem foi enviada." : "Toque para registrar um alerta de demonstração."}</p>
      <AnimatePresence>
        {aberto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAberto(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div role="alertdialog" aria-modal="true" aria-labelledby="sos-titulo" aria-describedby="sos-desc" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="w-full max-w-md rounded-3xl border border-silver/40 bg-pearl p-6 shadow-2xl dark:bg-forest">
              <h2 id="sos-titulo" className="text-2xl font-bold">Ativar o SOS demonstrativo?</h2>
              <p id="sos-desc" className="mt-3 opacity-90">Isto é apenas uma demonstração. Nenhuma ligação será feita, nenhuma mensagem será enviada e ninguém será avisado. O alerta fica registrado somente no histórico deste site ({contatosTexto}).</p>
              <div className="mt-6 flex justify-end gap-3"><button autoFocus onClick={() => setAberto(false)} className="rounded-xl border border-silver/60 px-5 py-3 hover:bg-sage/15">Cancelar</button><button onClick={confirmar} className="rounded-xl bg-violet-glow px-5 py-3 font-semibold text-white hover:brightness-110">Registrar alerta</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
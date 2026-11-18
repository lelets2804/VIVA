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
        {!calmo && [0, 1, 2].map((i) => <motion.span key={i} aria-hidden="true" className="absolute h-40 w-40 rounded-full border-2 border-coral" initial={{ scale: 0.8, opacity: 0 }} animate={ativo ? { scale: [1, 1.9], opacity: [0.9, 0] } : { scale: [1, 1.35], opacity: [0.35, 0] }} transition={ativo ? { duration: 1.4, repeat: 2, delay: i * 0.35, ease: "easeOut" } : { duration: 3.2, repeat: Infinity, delay: i * 1, ease: "easeOut" }} />)}
        <motion.button onClick={() => setAberto(true)} whileHover={calmo ? undefined : { scale: 1.06 }} whileTap={calmo ? undefined : { scale: 0.92 }} aria-label="Acionar SOS demonstrativo" className={`relative z-10 flex h-40 w-40 items-center justify-center rounded-full font-display text-5xl font-semibold tracking-tight text-white shadow-[0_18px_50px_-10px_rgba(229,83,75,0.7),inset_0_-8px_20px_rgba(0,0,0,0.18),inset_0_6px_14px_rgba(255,255,255,0.25)] ${ativo ? "bg-sage-deep" : "bg-[radial-gradient(circle_at_35%_28%,#ff8a80,#E5534B_50%,#B3261E)]"}`}>{ativo ? "✓" : "SOS"}</motion.button>
      </div>
      <p aria-live="polite" className="min-h-12 max-w-xs text-center">{ativo ? "Alerta demonstrativo registrado. Nenhuma ligação ou mensagem foi enviada." : "Toque para registrar um alerta de demonstração."}</p>
      <AnimatePresence>
        {aberto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAberto(false)} className="fixed inset-0 z-60 flex items-end justify-center bg-moss/60 p-3 backdrop-blur-sm sm:items-center sm:p-4">
            <motion.div role="alertdialog" aria-modal="true" aria-labelledby="sos-titulo" aria-describedby="sos-desc" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="modal">
              <h2 id="sos-titulo" className="font-display text-3xl tracking-tight">Ativar o SOS demonstrativo?</h2>
              <p id="sos-desc" className="mt-3 leading-relaxed opacity-85">Isto é apenas uma demonstração. Nenhuma ligação será feita, nenhuma mensagem será enviada e ninguém será avisado. O alerta fica registrado somente no histórico deste site ({contatosTexto}).</p>
              <div className="mt-6 flex flex-wrap justify-end gap-3"><button autoFocus onClick={() => setAberto(false)} className="btn btn-secundario">Cancelar</button><button onClick={confirmar} className="btn btn-perigo">Registrar alerta</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
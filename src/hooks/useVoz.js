import { useCallback, useEffect, useRef, useState } from "react";

// Reconhecimento de voz (falar com o assistente) e leitura em voz alta das respostas,
// usando a Web Speech API do próprio navegador. Nada é enviado para serviços do VIVVA.
const Reconhecimento = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
const temSintese = typeof window !== "undefined" && "speechSynthesis" in window;

const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
const ehFirefox = /firefox/i.test(ua);
const ehBrave = typeof navigator !== "undefined" && Boolean(navigator.brave);

const SEM_RECONHECIMENTO = ehFirefox
  ? "O Firefox não reconhece voz. Para falar com o assistente, abra o VIVVA no Google Chrome ou no Microsoft Edge."
  : "Este navegador não reconhece voz. Para falar com o assistente, abra o VIVVA no Google Chrome ou no Microsoft Edge.";

const ERROS = {
  "not-allowed": "O microfone está bloqueado. Clique no cadeado ao lado do endereço do site, permita o microfone e tente de novo.",
  "service-not-allowed": "O microfone está bloqueado. Clique no cadeado ao lado do endereço do site, permita o microfone e tente de novo.",
  "no-speech": "Não ouvi nada. Toque no microfone e fale logo em seguida.",
  "audio-capture": "Não encontrei um microfone neste aparelho. Verifique se ele está conectado e liberado no sistema.",
  network: ehBrave
    ? "O Brave bloqueia o reconhecimento de voz. Abra o VIVVA no Google Chrome ou no Microsoft Edge."
    : "O reconhecimento de voz deste navegador não está disponível agora. Verifique a internet ou abra o VIVVA no Google Chrome ou no Microsoft Edge.",
};

// As vozes do navegador às vezes carregam depois da página; esta função espera por elas.
function carregarVozes() {
  return new Promise((resolver) => {
    const vozes = window.speechSynthesis.getVoices();
    if (vozes.length) return resolver(vozes);
    const pronto = () => { window.speechSynthesis.removeEventListener("voiceschanged", pronto); resolver(window.speechSynthesis.getVoices()); };
    window.speechSynthesis.addEventListener("voiceschanged", pronto);
    setTimeout(pronto, 1500);
  });
}

export default function useVoz({ aoReconhecer, idioma = "pt-BR" } = {}) {
  const [ouvindo, setOuvindo] = useState(false);
  const [falando, setFalando] = useState(false);
  const [parcial, setParcial] = useState("");
  const [erro, setErro] = useState("");
  const [lerRespostas, setLerRespostas] = useState(() => {
    try { return localStorage.getItem("vivva-ler-respostas") === "sim"; } catch { return false; }
  });
  const reconhecimentoRef = useRef(null);
  const falaRef = useRef(null); // guarda a fala atual: sem isso, o Chrome às vezes corta o áudio
  const aoReconhecerRef = useRef(aoReconhecer);

  useEffect(() => { aoReconhecerRef.current = aoReconhecer; }, [aoReconhecer]);

  useEffect(() => {
    try { localStorage.setItem("vivva-ler-respostas", lerRespostas ? "sim" : "nao"); } catch { /* sem armazenamento */ }
  }, [lerRespostas]);

  // Ao sair da página, para de ouvir e de falar.
  useEffect(() => () => {
    reconhecimentoRef.current?.abort();
    if (temSintese) window.speechSynthesis.cancel();
  }, []);

  const pararFala = useCallback(() => {
    if (temSintese) window.speechSynthesis.cancel();
    setFalando(false);
  }, []);

  const falar = useCallback(async (texto) => {
    if (!texto) return;
    if (!temSintese) { setErro("Este navegador não consegue ler textos em voz alta."); return; }
    window.speechSynthesis.cancel();
    const vozes = await carregarVozes();
    const base = idioma.toLowerCase();
    const voz = vozes.find((v) => v.lang?.toLowerCase().replace("_", "-") === base)
      || vozes.find((v) => v.lang?.toLowerCase().startsWith(base.slice(0, 2)))
      || vozes.find((v) => v.default);

    if (!vozes.length) {
      setErro("Não encontrei nenhuma voz instalada neste navegador para ler em voz alta. No Google Chrome ou no Microsoft Edge a leitura funciona sem instalar nada.");
      return;
    }

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = voz?.lang || idioma;
    try { if (voz) fala.voice = voz; } catch { /* usa a voz padrão */ }
    fala.rate = 0.95;
    fala.volume = 1;
    fala.onstart = () => { setFalando(true); setErro(""); };
    fala.onend = () => setFalando(false);
    fala.onerror = (e) => {
      setFalando(false);
      if (e.error !== "interrupted" && e.error !== "canceled") setErro("Não consegui ler a resposta em voz alta. Verifique se o som do computador está ligado.");
    };
    falaRef.current = fala;

    // Pequena pausa depois do cancel(): no Chrome, falar logo em seguida pode ficar mudo.
    setTimeout(() => {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(fala);
    }, 60);
  }, [idioma]);

  const parar = useCallback(() => { reconhecimentoRef.current?.stop(); }, []);

  const ouvir = useCallback(() => {
    setErro("");
    if (!Reconhecimento) { setErro(SEM_RECONHECIMENTO); return; }
    pararFala();
    setParcial("");

    const r = new Reconhecimento();
    r.lang = idioma;
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;

    r.onstart = () => setOuvindo(true);
    r.onresult = (evento) => {
      let texto = "";
      let final = false;
      for (let i = evento.resultIndex; i < evento.results.length; i++) {
        texto += evento.results[i][0].transcript;
        if (evento.results[i].isFinal) final = true;
      }
      setParcial(texto);
      if (final && texto.trim()) aoReconhecerRef.current?.(texto.trim());
    };
    r.onerror = (evento) => { if (evento.error !== "aborted") setErro(ERROS[evento.error] || "Não consegui entender. Tente falar de novo."); };
    r.onend = () => { setOuvindo(false); setParcial(""); reconhecimentoRef.current = null; };

    reconhecimentoRef.current = r;
    try { r.start(); } catch { setErro("Não consegui ligar o microfone. Tente de novo."); }
  }, [idioma, pararFala]);

  const alternarOuvir = useCallback(() => (ouvindo ? parar() : ouvir()), [ouvindo, ouvir, parar]);

  // Ligar a leitura já fala uma frase curta, para a pessoa confirmar que o som funciona.
  const alternarLeitura = useCallback(() => {
    const novo = !lerRespostas;
    setLerRespostas(novo);
    if (novo) falar("Leitura em voz alta ligada.");
    else pararFala();
  }, [lerRespostas, falar, pararFala]);

  return {
    suportaReconhecimento: Boolean(Reconhecimento),
    ouvindo,
    falando,
    parcial,
    erro,
    alternarOuvir,
    lerRespostas,
    alternarLeitura,
    falar,
    pararFala,
  };
}
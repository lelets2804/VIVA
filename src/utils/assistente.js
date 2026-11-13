// Assistente local da VIVVA: entende português por palavras-chave, horários e contexto.
// Não usa IA externa nem servidor: tudo roda no navegador com os dados do próprio usuário.
import { descreverClima, descreverAr, gerarRecomendacoes } from "./clima";
import { formatarDistancia, formatarDuracao } from "./geo";

/* ---------- utilidades ---------- */
const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const pad = (n) => String(n).padStart(2, "0");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const DIAS_SEM = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const rotuloDia = (d) => (d === 0 ? "hoje" : d === 1 ? "amanhã" : d === 2 ? "depois de amanhã" : `em ${d} dias`);
const minutosAgora = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const hm = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const saudacao = () => { const h = new Date().getHours(); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; };

// Tolera erros de digitação leves (1 letra) em palavras longas.
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
function ocorre(t, tokens, termo) {
  if (termo.includes(" ") || termo.includes("-")) return t.includes(termo);
  const prefixo = termo.endsWith("*");
  const base = prefixo ? termo.slice(0, -1) : termo;
  return tokens.some((w) => (prefixo ? w.startsWith(base) : w === base || (base.length >= 5 && lev(w, base) <= 1)));
}

/* ---------- tema (pontuação por palavras) ---------- */
const TEMAS = {
  semana: [["semana", 2.5], ["semanal", 2.5], ["ultimos dias", 2.5]],
  resumo: [["resumo", 2.5], ["meu dia", 2.5], ["panorama", 2], ["visao geral", 2]],
  padroes: [["padrao", 2.5], ["padroes", 2.5], ["habito*", 2.5], ["insight*", 2.5], ["produtiv*", 2.5], ["costumo", 2], ["tendencia*", 2]],
  trajetos: [["trajeto*", 2.5], ["caminhada*", 2.5], ["percurso*", 2.5], ["rota", 2], ["rotas", 2], ["deslocamento*", 2], ["andei", 2], ["caminhei", 2], ["distancia", 1.5]],
  contatos: [["contato*", 2.5], ["apoio", 2], ["sos", 2.5], ["seguranca", 1.5], ["alerta*", 1.5]],
  tarefas: [["tarefa*", 2], ["pendente*", 2], ["rotina", 2], ["lembrete*", 2], ["agenda", 2], ["compromisso*", 2], ["afazer*", 2], ["fazer hoje", 2], ["proximo", 1]],
  clima: [["clima", 2], ["tempo", 1.5], ["chuv*", 2], ["chov*", 2], ["temperatura", 2], ["previsao", 2], ["guarda-chuva", 2], ["guarda chuva", 2], ["casaco", 2], ["agasalho", 2], ["blusa", 1.5], ["roupa*", 2], ["vestir", 2], ["frio", 2], ["calor", 2], ["vento", 2], ["uv", 2], ["umidade", 2], ["protetor", 2], ["nublad*", 2], ["sol", 1], ["poluic*", 2], ["qualidade do ar", 2], ["sair", 0.5]],
  ajuda: [["ajuda", 2], ["comandos", 2.5], ["funcoes", 2.5], ["o que voce faz", 3], ["o que voce sabe", 3], ["como funciona", 2.5], ["tutorial", 2.5], ["o que posso perguntar", 3]],
  sobre: [["quem e voce", 3], ["quem voce", 2], ["seu nome", 3], ["voce e uma ia", 3], ["voce e um robo", 3], ["voce e real", 3]],
};
const PRIORIDADE = ["semana", "resumo", "padroes", "trajetos", "contatos", "tarefas", "clima", "ajuda", "sobre"];
function melhorTema(t, tokens) {
  let melhor = null, pontos = 0;
  for (const tema of PRIORIDADE) {
    const p = TEMAS[tema].reduce((s, [termo, peso]) => s + (ocorre(t, tokens, termo) ? peso : 0), 0);
    if (p > pontos) { melhor = tema; pontos = p; }
  }
  return pontos >= 1 ? melhor : null;
}

/* ---------- quando? (dia, hora, período, "daqui a 30 min") ---------- */
const PERIODOS = { madrugada: [0, 1, 2, 3, 4, 5], manha: [6, 7, 8, 9, 10, 11], tarde: [12, 13, 14, 15, 16, 17], noite: [18, 19, 20, 21, 22, 23] };
const NOME_PERIODO = { madrugada: "de madrugada", manha: "de manhã", tarde: "à tarde", noite: "à noite" };
const HORA_PADRAO = { madrugada: 6, manha: 9, tarde: 15, noite: 20 };

function lerQuando(t) {
  const q = { dia: null, hora: null, minuto: 0, periodo: null, relativoMin: null };
  if (/depois de amanha/.test(t)) q.dia = 2; else if (/amanha/.test(t)) q.dia = 1; else if (/\bhoje\b/.test(t)) q.dia = 0;
  const rel = t.match(/daqui a\s+(?:(meia hora)|(\d+|uma|duas|tres)\s*(minutos?|min|horas?|h)\b)/);
  if (rel) {
    const n = rel[1] ? 30 : ({ uma: 1, duas: 2, tres: 3 }[rel[2]] ?? Number(rel[2]));
    q.relativoMin = rel[1] || /^m/.test(rel[3]) ? n : n * 60;
    return q;
  }
  let m;
  if (/meio[- ]?dia/.test(t)) q.hora = 12;
  else if (/meia[- ]?noite/.test(t)) q.hora = 0;
  else if ((m = t.match(/(\d{1,2})\s*:\s*(\d{2})/))) { q.hora = +m[1]; q.minuto = +m[2]; }
  else if ((m = t.match(/(\d{1,2})\s*(?:h|hs|horas?)(?:\s*(\d{2}))?(?![a-z])/))) { q.hora = +m[1]; q.minuto = +(m[2] || 0); }
  else if ((m = t.match(/(?:^|\s)as\s+(\d{1,2})(?![\d:])(?!\s*(?:km|%|graus|minutos?|min|dias?|anos|reais|pessoas))/))) q.hora = +m[1];
  if (q.hora != null && (q.hora > 23 || q.minuto > 59)) { q.hora = null; q.minuto = 0; }
  const p = t.replace(/meio[- ]?dia/g, " ").replace(/meia[- ]?noite/g, " ").match(/\b(manha|tarde|noite|madrugada)\b/);
  if (p) q.periodo = p[1];
  if (q.hora != null && q.hora >= 1 && q.hora < 12 && (q.periodo === "tarde" || q.periodo === "noite")) q.hora += 12;
  if (q.hora != null) q.periodo = null;
  return q;
}
function resolverRelativo(q, baseMin) {
  if (q.relativoMin == null) return q;
  const alvo = baseMin + q.relativoMin;
  return { ...q, dia: Math.floor(alvo / 1440), hora: Math.floor((alvo % 1440) / 60), minuto: alvo % 60 };
}

/* ---------- clima: dados por hora/dia ---------- */
const horaLocal = (dados) => Number(dados.current.time.slice(11, 13));
const minLocal = (dados) => horaLocal(dados) * 60 + Number(dados.current.time.slice(14, 16));
const somaDias = (data, n) => { const d = new Date(`${data}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
function climaHora(dados, off, hora) {
  const h = dados?.hourly; if (!h) return null;
  const i = h.time.indexOf(`${somaDias(dados.current.time.slice(0, 10), off)}T${pad(hora)}:00`);
  if (i < 0) return null;
  return { hora, temp: h.temperature_2m[i], prob: h.precipitation_probability[i] ?? 0, codigo: h.weather_code[i], uv: h.uv_index?.[i] ?? 0 };
}
const climaDia = (dados, off) => { const d = dados.daily; return { min: d.temperature_2m_min[off], max: d.temperature_2m_max[off], prob: d.precipitation_probability_max?.[off] ?? 0, codigo: d.weather_code[off], uv: d.uv_index_max?.[off] ?? 0 }; };
function conselho({ temp, prob, uv }) {
  const c = [];
  if (prob >= 50) c.push("leve guarda-chuva");
  if (temp <= 12) c.push("vista um agasalho grosso"); else if (temp <= 18) c.push("leve um casaco"); else if (temp >= 30) c.push("use roupas leves e leve água");
  if (uv >= 6) c.push("use protetor solar");
  return c;
}

function veredito(tem, temp, prob) {
  const p = [];
  if (tem("casaco", "agasalho", "blusa")) p.push(temp <= 18 ? "Sim, vale levar um casaco." : "Provavelmente você não precisa de casaco.");
  if (tem("guarda-chuva", "guarda chuva")) p.push(prob >= 50 ? "Sim, leve guarda-chuva." : "Provavelmente não precisa de guarda-chuva.");
  return p.length ? `${p.join(" ")} ` : "";
}

function respostaClima(t, q, ctx, tem) {
  const { dados, ar, cidade } = ctx;
  if (!dados) return "Ainda não consegui consultar o clima. Abra a aba Mobilidade ou tente de novo em instantes.";
  const qq = resolverRelativo(q, minLocal(dados));
  const off = qq.dia ?? 0;
  if (off > 3) return "Consigo ver a previsão só dos próximos 4 dias.";
  const quando = rotuloDia(off);
  const agora = horaLocal(dados);

  if (tem("melhor horario", "melhor hora", "quando sair", "quando posso sair", "quando e melhor", "janela")) {
    const cands = [];
    for (let h = off === 0 ? Math.max(agora, 6) : 6; h <= 22; h++) {
      const w = climaHora(dados, off, h); if (!w) continue;
      cands.push({ ...w, score: w.prob * 1.5 + Math.abs(w.temp - 23) * 2 + (w.uv >= 8 ? 20 : 0) });
    }
    if (!cands.length) return `Não há mais horários bons para ${quando}. Quer ver amanhã?`;
    const top = [...cands].sort((a, b) => a.score - b.score).slice(0, 3).sort((a, b) => a.hora - b.hora);
    if (top[0].prob >= 60) return `${cap(quando)} não há uma janela boa: a chance de chuva é alta o tempo todo. Se precisar sair, leve guarda-chuva.`;
    const temp = Math.round(top.reduce((s, w) => s + w.temp, 0) / top.length);
    return `Os melhores horários para sair ${quando} são ${top.map((w) => `${w.hora}h`).join(", ")}: chance de chuva de até ${Math.max(...top.map((w) => w.prob))}% e cerca de ${temp}°C.`;
  }

  if (tem("proximos dias", "previsao", "semana") && qq.dia == null && qq.hora == null && !qq.periodo) {
    const d = dados.daily;
    return `Previsão em ${cidade.nome}:\n${d.time.map((dia, i) => `• ${i === 0 ? "Hoje" : i === 1 ? "Amanhã" : cap(DIAS_SEM[new Date(`${dia}T12:00:00`).getDay()])}: ${Math.round(d.temperature_2m_min[i])}° a ${Math.round(d.temperature_2m_max[i])}°, chuva até ${d.precipitation_probability_max?.[i] ?? 0}%`).join("\n")}`;
  }

  if (tem("qualidade do ar", "poluic*")) {
    const n = ar?.us_aqi;
    if (n == null) return "Não consegui a qualidade do ar agora.";
    return `Qualidade do ar em ${cidade.nome}: índice ${Math.round(n)} (${descreverAr(n).texto}).${n > 100 ? " Evite exercício intenso ao ar livre." : ""}`;
  }

  if (tem("uv", "protetor", "bronzeador") || (tem("sol") && tem("forte", "queima*", "bronze*"))) {
    const v = Math.round(climaDia(dados, off).uv);
    return `UV máximo ${quando}: ${v} (${v >= 8 ? "muito alto" : v >= 6 ? "alto" : v >= 3 ? "moderado" : "baixo"}). ${v >= 6 ? "Use protetor, chapéu e evite o sol entre 10h e 16h." : v >= 3 ? "Protetor solar é recomendado se ficar muito tempo ao ar livre." : "Risco baixo."}`;
  }

  if (qq.hora != null) {
    const w = climaHora(dados, off, qq.hora);
    if (!w) return `Não tenho a previsão para as ${qq.hora}h ${quando}.`;
    const c = conselho(w);
    const passou = off === 0 && qq.hora < agora;
    return `${veredito(tem, w.temp, w.prob)}${passou ? "Esse horário já passou hoje, mas estava assim: " : ""}Às ${qq.hora}h ${quando} em ${cidade.nome}: ${Math.round(w.temp)}°C, ${descreverClima(w.codigo).texto.toLowerCase()}, chance de chuva de ${w.prob}%.${c.length ? ` Dica: ${c.join(", ")}.` : " Nada especial para levar."}`;
  }
  if (qq.periodo) {
    const ws = PERIODOS[qq.periodo].map((h) => climaHora(dados, off, h)).filter((w) => w && (off > 0 || w.hora >= agora));
    if (!ws.length) return "Esse período já passou hoje. Quer ver amanhã?";
    const prob = Math.max(...ws.map((w) => w.prob)), tmin = Math.round(Math.min(...ws.map((w) => w.temp))), tmax = Math.round(Math.max(...ws.map((w) => w.temp))), uv = Math.max(...ws.map((w) => w.uv));
    const c = conselho({ temp: tmin, prob, uv });
    return `${veredito(tem, tmin, prob)}${cap(quando)} ${NOME_PERIODO[qq.periodo]} em ${cidade.nome}: de ${tmin}° a ${tmax}°C, chance de chuva de até ${prob}%.${c.length ? ` Dica: ${c.join(", ")}.` : " Nada especial para levar."}`;
  }

  if (tem("chuv*", "chov*", "guarda-chuva", "guarda chuva")) {
    if (off === 0 && /\bagora\b/.test(t)) {
      const chovendoAgora = descreverClima(dados.current.weather_code).tipo === "chuva" || dados.current.precipitation > 0;
      const prox = [agora, agora + 1, agora + 2].map((h) => climaHora(dados, h < 24 ? 0 : 1, h % 24)).filter(Boolean);
      const pm = Math.max(0, ...prox.map((w) => w.prob));
      return chovendoAgora ? `Sim, está chovendo agora em ${cidade.nome}. Leve guarda-chuva se for sair.` : `Agora não está chovendo em ${cidade.nome}. Para as próximas 3 horas a chance de chuva é de até ${pm}%.`;
    }
    const d = climaDia(dados, off);
    const hs = []; for (let h = 0; h < 24; h++) { const w = climaHora(dados, off, h); if (w && (off > 0 || h >= agora)) hs.push(w); }
    const minProb = hs.length ? Math.min(...hs.map((w) => w.prob)) : 0;
    const pico = [...hs].sort((a, b) => b.prob - a.prob)[0];
    const chovendo = off === 0 && descreverClima(dados.current.weather_code).tipo === "chuva";
    if (d.prob < 30 && !chovendo) return `${cap(quando)} a chance de chuva é baixa (até ${d.prob}%). Não deve precisar de guarda-chuva.`;
    return `${chovendo ? "Está chovendo agora. " : ""}${cap(quando)}, a chance de chuva chega a ${d.prob}%${pico && pico.prob >= 30 && pico.prob - minProb >= 20 ? `, mais provável por volta das ${pico.hora}h` : ""}. Leve guarda-chuva.`;
  }

  if (tem("vestir", "roupa*", "casaco", "agasalho", "blusa")) {
    if (off === 0) {
      const recs = gerarRecomendacoes({ dados, ar, hora: ctx.hora, lembretes: ctx.lembretes }).filter((r) => r.id !== "proximo").slice(0, 3);
      return recs.map((r) => `• ${r.titulo}: ${r.texto}`).join("\n");
    }
    const d = climaDia(dados, off), c = conselho({ temp: (d.min + d.max) / 2, prob: d.prob, uv: d.uv });
    const camadas = d.min <= 16 && d.max >= 26 ? "Vai variar bastante: casaco de manhã e à noite, roupa leve à tarde. " : "";
    return `${cap(quando)} deve ir de ${Math.round(d.min)}° a ${Math.round(d.max)}°C. ${camadas}${c.length ? `Dica: ${c.join(", ")}.` : "Roupas leves bastam."}`;
  }

  const a = dados.current, d = climaDia(dados, off);
  if (off > 0) return `${cap(quando)} em ${cidade.nome}: ${descreverClima(d.codigo).texto.toLowerCase()}, de ${Math.round(d.min)}° a ${Math.round(d.max)}°C, chuva até ${d.prob}%, UV ${Math.round(d.uv)}.`;
  const prox = []; for (let h = agora; h < agora + 6; h++) { const w = h < 24 ? climaHora(dados, 0, h) : climaHora(dados, 1, h - 24); if (w) prox.push(w); }
  const prob = Math.max(0, ...prox.map((w) => w.prob));
  return `Agora em ${cidade.nome}: ${Math.round(a.temperature_2m)}°C (sensação de ${Math.round(a.apparent_temperature)}°C), ${descreverClima(a.weather_code).texto.toLowerCase()}. Hoje: mín. ${Math.round(d.min)}° e máx. ${Math.round(d.max)}°. Chance de chuva nas próximas 6h: até ${prob}%.`;
}

/* ---------- lembretes ---------- */
const CATEGORIAS = [
  ["Medicamento", ["remedio", "medicamento", "comprimido", "vitamina", "pilula", "insulina", "antibiotico", "gotas", "pomada"]],
  ["Consulta", ["consulta", "medico", "dentista", "exame", "fisioterapia", "psicolog", "terapia", "retorno"]],
  ["Compromisso", ["reuniao", "compromisso", "trabalho", "prova", "aula", "entrevista", "boleto", "pagar", "banco"]],
];
const RE_CRIAR = /\b(?:me\s+lembr\w*|lembre[- ]?me|lembra[- ]?me|lembrar|cri(?:e|ar|a)|adicion(?:e|ar)|anot(?:e|ar)|agend(?:e|ar)|marqu(?:e|ei)|marcar)\b/;
const RE_TITULO = /(?:me\s+lembr\w*|lembre[- ]?me|lembra[- ]?me|lembrar|cri(?:e|ar|a)|adicion(?:e|ar)|anot(?:e|ar)|agend(?:e|ar)|marqu(?:e|ei)|marcar)\b\s*(?:uma?\s+)?(?:lembrete\s+|tarefa\s+|compromisso\s+)?(.*)$/is;
const PER = "(?:\\s+(?:da|de|pela)\\s+(?:manh[ãa]|tarde|noite|madrugada))?";
const LIMPAR = [
  /(^|[^\p{L}\d])daqui\s+a\s+(?:meia\s+hora|(?:\d+|uma|duas|tr[eê]s)\s*(?:minutos?|min|horas?|h)(?![\p{L}]))/giu,
  new RegExp(`(^|[^\\p{L}\\d])(?:(?:[àa]s?|d[ao]s|por\\s+volta\\s+d[ao]s?)\\s+)?\\d{1,2}\\s*:\\s*\\d{2}(?:\\s*(?:h|horas?))?(?![\\p{L}\\d])${PER}`, "giu"),
  new RegExp(`(^|[^\\p{L}\\d])(?:(?:[àa]s?|d[ao]s|por\\s+volta\\s+d[ao]s?)\\s+)?\\d{1,2}\\s*(?:h|hs|horas?)(?:\\s*\\d{2})?(?![\\p{L}])${PER}`, "giu"),
  new RegExp(`(^|[^\\p{L}\\d])(?:[àa]s?|d[ao]s)\\s+\\d{1,2}(?![\\p{L}\\d:])${PER}`, "giu"),
  /(^|[^\p{L}])(?:ao\s+|[àa]\s+)?(?:meio[- ]?dia|meia[- ]?noite)(?![\p{L}])/giu,
  /(^|[^\p{L}])(?:hoje|amanh[ãa]|depois\s+de\s+amanh[ãa])(?![\p{L}])/giu,
  /(^|[^\p{L}])(?:de|pela|[àa])\s+(?:manh[ãa]|tarde|noite|madrugada)(?![\p{L}])/giu,
];
function extrairTitulo(original) {
  const m = original.replace(/[.!?]+\s*$/, "").match(RE_TITULO);
  if (!m) return "";
  let s = m[1];
  for (const re of LIMPAR) s = s.replace(re, " ");
  s = s.replace(/\s+/g, " ").trim().replace(/^(?:de|do|da|para|que|sobre)\s+/i, "");
  let ant; do { ant = s; s = s.replace(/\s+(?:[àa]s?|d[ao]s?|em|no|na|de|para|por|e)\s*$/i, "").trim(); } while (s !== ant);
  return cap(s).slice(0, 80);
}
function criarLembrete(original, t, lembretes) {
  const titulo = extrairTitulo(original);
  if (titulo.length < 3) return { texto: "O que devo lembrar? Por exemplo: “lembre-me de beber água às 16h”." };
  let q = lerQuando(t);
  if (q.relativoMin != null) { const alvo = new Date(Date.now() + q.relativoMin * 60000); q = { ...q, hora: alvo.getHours(), minuto: alvo.getMinutes(), dia: alvo.getDate() !== new Date().getDate() ? 1 : 0 }; }
  let horario = "", assumido = false;
  if (q.hora != null) horario = `${pad(q.hora)}:${pad(q.minuto)}`;
  else if (q.periodo) { horario = `${pad(HORA_PADRAO[q.periodo])}:00`; assumido = true; }
  const nt = norm(titulo);
  if (lembretes.some((l) => !l.concluido && norm(l.titulo) === nt && (l.horario || "") === horario)) return { texto: `Você já tem o lembrete “${titulo}”${horario ? ` para ${horario}` : ""} na Rotina.` };
  const categoria = (CATEGORIAS.find(([, ps]) => ps.some((p) => nt.includes(p))) || ["Pessoal"])[0];
  const notas = [];
  if (assumido) notas.push(`Como você não disse a hora exata, usei ${horario}.`);
  if ((q.dia ?? 0) > 0) notas.push("Os lembretes da VIVVA valem para o dia, sem data: este ficou como lembrete geral na Rotina.");
  return { texto: [`Pronto! Criei o lembrete “${titulo}”${horario ? ` para ${horario}` : ""} (${categoria}).`, ...notas].join(" "), acao: { tipo: "criar-lembrete", dados: { titulo, horario, categoria } } };
}

const STOP = new Set(["de", "da", "do", "para", "com", "que", "uma", "um", "as", "os", "meu", "minha", "ja", "como", "feito", "feita", "concluido", "concluida", "marque", "marcar", "conclua", "concluir", "finalizar", "finalizei", "terminei", "tomei", "fiz", "lembrete", "tarefa", "hoje", "agora", "por", "favor", "ok", "pronto"]);
const casa = (a, b) => a === b || (a.length >= 4 && b.length >= 4 && a.slice(0, 4) === b.slice(0, 4));
const RE_CONCLUIR_FORTE = /\b(conclui|concluir|conclua|finalizei|finalizar|terminei|terminar)\b|mar(?:qu|c)\w*[^.?!]*\bcomo\s+(?:feit\w+|conclu\w+|pront\w+|ok)\b/;
const RE_CONCLUIR_FRACO = /\bja\s+(?:tomei|fiz|liguei|paguei|comprei|fui|terminei|resolvi)\b|\b(?:tomei|liguei|paguei)\b/;
function concluirLembrete(t, lembretes) {
  const forte = RE_CONCLUIR_FORTE.test(t);
  if (!forte && (t.includes("?") || !RE_CONCLUIR_FRACO.test(t))) return null;
  const palavras = (t.match(/[a-z0-9]+/g) || []).filter((w) => w.length >= 3 && !STOP.has(w));
  const pontuar = (l) => { const tl = (norm(l.titulo).match(/[a-z0-9]+/g) || []).filter((w) => w.length >= 3 && !STOP.has(w)); return palavras.filter((w) => tl.some((x) => casa(w, x))).length; };
  const pend = lembretes.filter((l) => !l.concluido).map((l) => ({ l, p: pontuar(l) })).filter((x) => x.p > 0).sort((a, b) => b.p - a.p);
  if (pend.length) {
    const topo = pend.filter((x) => x.p === pend[0].p);
    if (topo.length > 1) return { texto: `Encontrei mais de um: ${topo.map((x) => `“${x.l.titulo}”`).join(", ")}. Qual deles você concluiu?` };
    return { texto: `Marquei “${pend[0].l.titulo}” como concluído. Bom trabalho!`, acao: { tipo: "concluir-lembrete", id: pend[0].l.id } };
  }
  const feito = lembretes.find((l) => l.concluido && pontuar(l) > 0);
  if (feito) return { texto: `“${feito.titulo}” já está concluído.` };
  if (!forte) return null;
  const pendentes = lembretes.filter((l) => !l.concluido);
  return { texto: pendentes.length ? `Não achei esse lembrete. Pendentes agora: ${pendentes.slice(0, 5).map((l) => `“${l.titulo}”`).join(", ")}.` : "Você não tem lembretes pendentes." };
}

/* ---------- segurança ---------- */
const RE_CRISE = /(?:quero|vou|penso em|pensando em|tenho vontade de|queria|desejo)\s+(?:me\s+)?(?:matar|morrer|suicid\w*|sumir|desaparecer)|\bsuicid\w*|me machucar|me ferir|acabar com (?:tudo|minha vida|isso tudo)|nao (?:aguento|quero) mais (?:viver|nada|continuar)|tirar (?:a )?minha vida|nao vejo (?:mais )?sentido (?:em|na) (?:viver|vida)|melhor sem mim/;
const RE_MEDICA = /dor (?:forte )?no peito|infarto|\bavc\b|derrame|desmai\w*|convuls\w*|nao consigo respirar|falta de ar|sangramento|engasg\w*|overdose|envenen\w*|passando mal|me sinto mal|estou muito mal|socorro|emergencia|\bsamu\b/;
const RE_PERIGO = /estou em perigo|alguem (?:esta )?me (?:segu|persegu|ameac)\w*|me ameac\w*|assalt\w*|violencia|agress\w*|sequestr\w*|abus\w*/;
const RE_DOSE = /(?:posso|pode|devo|preciso|vale a pena)\s+(?:tomar|misturar|juntar|trocar|parar)|\bdoses?\b|dosagem|quant\w+\s+(?:comprimidos?|remedios?|gotas?|capsulas?|pilulas?)|\ba mais\b|dobro|interacao|\bbula\b|efeito colateral|esqueci (?:de tomar|o remedio)/;

/* ---------- navegação e small talk ---------- */
const ROTAS = { rotina: ["/rotina", "Rotina"], seguranca: ["/seguranca", "Segurança"], mobilidade: ["/mobilidade", "Mobilidade"], insight: ["/insights", "Insights"], insights: ["/insights", "Insights"], dashboard: ["/", "Dashboard"], inicio: ["/", "Dashboard"], home: ["/", "Dashboard"], assistente: ["/assistente", "Assistente"] };
const RE_NAVEGAR = /\b(?:abr\w+|ir para|va para|vai para|me leve|leve[- ]?me|mostr\w+|ver|quero ver|acessar|entrar)\s+(?:na |no |a |o |as |os |para a |para o )?(?:aba |pagina |tela |secao )?(rotina|seguranca|mobilidade|insights?|dashboard|inicio|home|assistente)\b/;

export const SUGESTOES = ["Como está o clima?", "Preciso de casaco às 18h?", "Qual o melhor horário para sair?", "Quais são minhas tarefas?", "Como foi minha semana?", "Lembre-me de tomar remédio às 20h"];
const SUG = {
  clima: ["E amanhã?", "Melhor horário para sair hoje", "Preciso de casaco à noite?", "Qualidade do ar"],
  tarefas: ["Resumo do meu dia", "Lembre-me de beber água às 16h", "Como foi minha semana?"],
  resumo: ["Quais são minhas tarefas?", "Como está o clima?", "Quais são meus padrões?"],
  semana: ["Quais são meus padrões?", "Previsão dos próximos dias", "Meus trajetos"],
  padroes: ["Como foi minha semana?", "Quais são minhas tarefas?", "Abrir Insights"],
  trajetos: ["Como está o clima?", "Melhor horário para sair hoje", "Como foi minha semana?"],
  contatos: ["Como funciona o SOS?", "Abrir Segurança", "Resumo do meu dia"],
  criado: ["Quais são minhas tarefas?", "Resumo do meu dia"],
};

/* ---------- função principal ---------- */
// memoria: { topico } da resposta anterior (permite perguntas como "e amanhã?").
export function responder(texto, ctx, memoria = null) {
  const original = texto.trim();
  let t = norm(original);
  const { lembretes, contatos, trajetos, analise } = ctx;
  const pendentes = lembretes.filter((l) => !l.concluido);
  const R = (txt, extra = {}) => ({ texto: txt, ...extra });

  if (RE_CRISE.test(t)) return R(`Sinto muito que você esteja se sentindo assim. Você não está sozinho(a) e merece apoio agora.\n• Ligue para o CVV: 188 (24 horas, gratuito) ou converse pelo chat em cvv.org.br.\n• Se houver risco imediato, ligue 192 (SAMU) ou 190.\n• Se puder, procure agora alguém de confiança e peça para ficar com você.${contatos.length ? `\nVocê tem ${contatos.length} ${contatos.length === 1 ? "contato de apoio" : "contatos de apoio"} na aba Segurança.` : ""}`);
  if (RE_MEDICA.test(t) && !(t.includes("sos") && /como|funciona|o que e/.test(t))) return R("Se for uma emergência, ligue agora para 192 (SAMU) ou 193 (Bombeiros). O botão SOS da VIVVA é só uma demonstração: ele não liga nem avisa ninguém.");
  if (RE_PERIGO.test(t)) return R("Se você estiver em perigo, ligue 190 (Polícia) agora e procure um lugar seguro com outras pessoas. Em casos de violência doméstica, também existe o 180. O SOS da VIVVA é só uma demonstração e não aciona ninguém.");

  const sauda = t.match(/^(?:oi+|ola|e ai|eai|hey|opa|bom dia|boa tarde|boa noite)\b[\s,!.]*/);
  if (sauda) {
    const resto = t.slice(sauda[0].length);
    if (!resto.trim()) return R(`${saudacao()}! Sou a VIVVA. Posso falar do clima, listar suas tarefas, criar lembretes, resumir seu dia e mostrar seus padrões. O que você precisa?`);
    t = resto;
  }

  const nav = t.match(RE_NAVEGAR);
  if (nav) { const [para, nome] = ROTAS[nav[1]]; return R(`Abrindo ${nome}…`, { acao: { tipo: "navegar", para } }); }

  const concluir = concluirLembrete(t, lembretes);
  if (concluir) return { ...concluir, sugestoes: SUG.tarefas };

  const querCriar = RE_CRIAR.test(t);
  if (querCriar) { const r = criarLembrete(original, t, lembretes); return { ...r, sugestoes: SUG.criado }; }

  if (RE_DOSE.test(t)) return R("Não posso orientar sobre doses, trocas ou combinações de medicamentos, porque isso depende de cada pessoa. Fale com seu médico ou farmacêutico. Se tomou algo a mais e passou mal, ligue 192 (SAMU). Posso criar um lembrete para você não esquecer horários: é só pedir.");

  if (/\bobrigad\w*|\bvaleu\b/.test(t)) return R("Por nada! Estou aqui quando precisar.");
  if (/\b(tchau|ate logo|ate mais|falou)\b/.test(t)) return R("Até mais! Cuide-se.");
  if (/(tudo bem|como (?:voce )?(?:esta|vai))\b/.test(t) && !melhorTema(t, t.match(/[a-z0-9]+/g) || [])) return R("Tudo certo por aqui! E com você? Posso ajudar com clima, rotina, trajetos ou seus padrões.");
  if (/que horas|hora certa/.test(t)) return R(`Agora são ${pad(new Date().getHours())}:${pad(new Date().getMinutes())}.`);
  if (/que dia (?:e|eh) hoje|data de hoje|dia da semana/.test(t)) return R(`Hoje é ${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}.`);

  const tokens = t.match(/[a-z0-9]+/g) || [];
  const tem = (...termos) => termos.some((x) => ocorre(t, tokens, x));
  let tema = melhorTema(t, tokens);
  const q = lerQuando(t);
  if (!tema && memoria?.topico === "clima" && tokens.length <= 7 && (q.dia != null || q.hora != null || q.periodo || q.relativoMin != null || /^e\b/.test(t))) tema = "clima";
  if (tema === "semana" && tem("clima", "tempo", "chuva", "previsao", "temperatura")) tema = "clima";

  switch (tema) {
    case "clima": return R(respostaClima(t, q, ctx, tem), { memoria: { topico: "clima" }, sugestoes: SUG.clima });

    case "resumo": {
      const partes = [];
      if (ctx.dados) partes.push(`Em ${ctx.cidade.nome}: ${Math.round(ctx.dados.current.temperature_2m)}°C, ${descreverClima(ctx.dados.current.weather_code).texto.toLowerCase()}.`);
      partes.push(lembretes.length ? `Rotina: ${lembretes.length - pendentes.length} de ${lembretes.length} lembretes concluídos${pendentes.length ? `; faltam ${pendentes.slice(0, 3).map((l) => l.titulo).join(", ")}` : ""}.` : "Você ainda não tem lembretes hoje.");
      const atrasados = pendentes.filter((l) => l.horario && hm(l.horario) < minutosAgora());
      if (atrasados.length) partes.push(`Atenção: ${atrasados.length === 1 ? "1 lembrete passou" : `${atrasados.length} lembretes passaram`} do horário.`);
      const rec = gerarRecomendacoes({ dados: ctx.dados, ar: ctx.ar, hora: ctx.hora, lembretes }).find((r) => r.id !== "proximo");
      if (rec) partes.push(`Dica: ${rec.titulo.toLowerCase()}. ${rec.texto}`);
      return R(partes.join("\n"), { memoria: { topico: "resumo" }, sugestoes: SUG.resumo });
    }

    case "tarefas": {
      if (!lembretes.length) return R("Você ainda não tem lembretes. Diga, por exemplo: “lembre-me de ligar para o médico às 15h”.", { sugestoes: SUG.tarefas });
      if (!pendentes.length) return R("Tudo concluído por hoje. Bom trabalho!", { sugestoes: SUG.tarefas });
      const agora = minutosAgora();
      const lista = [...pendentes].sort((a, b) => (a.horario || "99:99").localeCompare(b.horario || "99:99")).slice(0, 6);
      const proximo = lista.find((l) => l.horario && hm(l.horario) >= agora);
      const linhas = lista.map((l) => `• ${l.titulo}${l.horario ? ` (${l.horario}${hm(l.horario) < agora ? ", já passou" : ""})` : ""}`);
      const pediuProximo = tem("proximo") && proximo;
      return R(pediuProximo ? `Seu próximo compromisso é “${proximo.titulo}” às ${proximo.horario}.` : `Você tem ${pendentes.length} ${pendentes.length === 1 ? "pendência" : "pendências"}:\n${linhas.join("\n")}`, { memoria: { topico: "tarefas" }, sugestoes: SUG.tarefas });
    }

    case "semana": {
      const limite = Date.now() - 7 * 86400000;
      const feitos = lembretes.filter((l) => l.concluido && l.concluidoEm && new Date(l.concluidoEm).getTime() >= limite);
      const trajs = trajetos.filter((x) => x.inicio >= limite);
      if (!feitos.length && !trajs.length) return R("Ainda não tenho dados suficientes dos últimos 7 dias. Conclua lembretes e registre trajetos, e eu monto o resumo da sua semana.", { sugestoes: SUG.semana });
      const partes = [];
      if (feitos.length) {
        const porDia = Array(7).fill(0); feitos.forEach((l) => { porDia[new Date(l.concluidoEm).getDay()] += 1; });
        const top = porDia.indexOf(Math.max(...porDia));
        const meds = feitos.filter((l) => l.categoria === "Medicamento").length;
        partes.push(`Nos últimos 7 dias você concluiu ${feitos.length} ${feitos.length === 1 ? "lembrete" : "lembretes"}${meds ? `, ${meds} de medicamento` : ""}. Dia mais ativo: ${DIAS_SEM[top]}.`);
      }
      if (trajs.length) partes.push(`Você registrou ${trajs.length} ${trajs.length === 1 ? "trajeto" : "trajetos"}, somando ${formatarDistancia(trajs.reduce((s, x) => s + x.distanciaM, 0))}.`);
      if (pendentes.length) partes.push(`Ainda há ${pendentes.length} ${pendentes.length === 1 ? "pendência" : "pendências"} na Rotina.`);
      return R(partes.join("\n"), { memoria: { topico: "semana" }, sugestoes: SUG.semana });
    }

    case "padroes": {
      const reais = analise.insights.filter((i) => i.id !== "poucos").slice(0, 3);
      if (!reais.length) return R(analise.insights[0]?.texto || "Ainda não tenho dados suficientes sobre você.", { sugestoes: SUG.padroes });
      return R(`Notei isto sobre você:\n${reais.map((i) => `• ${i.titulo}. ${i.texto}`).join("\n")}`, { memoria: { topico: "padroes" }, sugestoes: SUG.padroes });
    }

    case "trajetos": {
      const u = trajetos[0];
      if (!u) return R("Você ainda não registrou trajetos. Na aba Mobilidade, toque em “Iniciar trajeto” e a VIVVA acompanha seu percurso.", { sugestoes: SUG.trajetos });
      const total = trajetos.reduce((s, x) => s + x.distanciaM, 0);
      return R(`Seu último trajeto teve ${formatarDistancia(u.distanciaM)} em ${formatarDuracao(u.duracaoS)}. Você registrou ${trajetos.length} no total, somando ${formatarDistancia(total)}.`, { memoria: { topico: "trajetos" }, sugestoes: SUG.trajetos });
    }

    case "contatos":
      if (tem("sos", "alerta*")) return R("O botão SOS da aba Segurança é uma demonstração: ele registra um alerta no histórico do app, mas não liga nem avisa ninguém. Em emergência real, ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia).", { sugestoes: SUG.contatos });
      return R(contatos.length ? `Você tem ${contatos.length} ${contatos.length === 1 ? "contato de apoio" : "contatos de apoio"}: ${contatos.slice(0, 4).map((c) => c.nome).join(", ")}. Veja tudo na aba Segurança.` : "Você ainda não cadastrou contatos de apoio. Dá para adicionar na aba Segurança.", { sugestoes: SUG.contatos });

    case "ajuda":
      return R("Posso:\n• clima por hora, por período ou por dia (“preciso de casaco às 18h?”, “vai chover amanhã?”)\n• melhor horário para sair, UV e qualidade do ar\n• listar suas tarefas e criar lembretes (“lembre-me de… às 15h”, “daqui a 30 minutos”)\n• marcar como feito (“já tomei o remédio”)\n• resumir seu dia e sua semana\n• mostrar seus padrões e trajetos\n• abrir abas (“abrir Mobilidade”)");
    case "sobre":
      return R("Sou a VIVVA, a assistente do app. Funciono com regras e com os dados do seu próprio aparelho: não sou uma IA externa e não envio suas conversas para lugar nenhum.");
    default:
      return R("Não entendi bem essa. Tente algo como “como está o clima?”, “quais são minhas tarefas?” ou “lembre-me de beber água às 16h”. Digite “ajuda” para ver tudo que sei fazer.");
  }
}
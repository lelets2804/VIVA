// Assistente local da VIVVA: entende comandos em português por palavras-chave.
// Não usa IA externa; tudo roda no navegador com os dados do próprio usuário.
import { descreverClima, gerarRecomendacoes, proximasHoras } from "./clima";
import { formatarDistancia, formatarDuracao } from "./geo";

const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const tem = (t, ...palavras) => palavras.some((p) => t.includes(p));
const CATEGORIAS = [
  ["Medicamento", ["remedio", "medicamento", "comprimido", "vitamina"]],
  ["Consulta", ["consulta", "medico", "dentista", "exame"]],
  ["Compromisso", ["reuniao", "compromisso", "trabalho", "prova", "aula"]],
];

function lerHorario(t) {
  const m = t.match(/(?:as|às)?\s*(\d{1,2})\s*(?:h|:)\s*(\d{2})?/);
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2] || 0);
  if (h > 23 || mi > 59) return null;
  return { horario: `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`, trecho: m[0] };
}

function criarLembrete(original) {
  const m = original.match(/(?:lembre[- ]?me|lembrar|lembra|crie|criar|adicione|adicionar|anote|anotar)\s+(?:um\s+lembrete\s+)?(?:de\s+|para\s+|que\s+)?(.+)/i);
  if (!m) return null;
  let titulo = m[1];
  const h = lerHorario(titulo.toLowerCase());
  if (h) titulo = titulo.replace(new RegExp(h.trecho.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), " ");
  titulo = titulo.replace(/\b(as|às|hoje|amanha|amanhã)\b\s*$/i, "").replace(/\s+/g, " ").trim();
  titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
  if (titulo.length < 3) return null;
  const n = norm(titulo);
  const categoria = (CATEGORIAS.find(([, ps]) => tem(n, ...ps)) || ["Pessoal"])[0];
  return { titulo, horario: h?.horario || "", categoria };
}

export const SUGESTOES = [
  "Como está o clima?",
  "O que vestir hoje?",
  "Quais são minhas tarefas?",
  "Resumo do meu dia",
  "Quais são meus padrões?",
  "Lembre-me de tomar remédio às 20h",
];

export function responder(texto, ctx) {
  const t = norm(texto);
  const { dados, ar, lembretes, contatos, trajetos, analise, hora, cidade } = ctx;
  const pendentes = lembretes.filter((l) => !l.concluido);

  if (/(lembre[- ]?me|lembrar|lembra |crie|criar|adicione|adicionar|anote|anotar)/.test(t) && !tem(t, "quais", "o que", "meus lembretes")) {
    const novo = criarLembrete(texto);
    if (novo) return { texto: `Pronto! Criei o lembrete “${novo.titulo}”${novo.horario ? ` para ${novo.horario}` : ""} na categoria ${novo.categoria}.`, acao: { tipo: "criar-lembrete", dados: novo } };
    return { texto: "Quase! Me diga o que lembrar, por exemplo: “lembre-me de tomar remédio às 20h”." };
  }

  if (tem(t, "emergencia", "socorro", "sos", "ajuda urgente", "me sinto mal")) return { texto: "Em uma emergência real, ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia). O SOS da VIVVA é só uma demonstração: ele não liga nem avisa ninguém." };

  if (tem(t, "contato", "apoio")) return { texto: contatos.length ? `Você tem ${contatos.length} ${contatos.length === 1 ? "contato de apoio" : "contatos de apoio"}: ${contatos.slice(0, 4).map((c) => c.nome).join(", ")}. Veja tudo na aba Segurança.` : "Você ainda não cadastrou contatos de apoio. Dá para adicionar na aba Segurança." };

  if (tem(t, "padrao", "padroes", "habito", "insight", "costumo", "produtiv")) {
    const reais = analise.insights.filter((i) => i.id !== "poucos").slice(0, 3);
    if (!reais.length) return { texto: analise.insights[0]?.texto || "Ainda não tenho dados suficientes sobre você." };
    return { texto: `Notei isto sobre você:\n${reais.map((i) => `• ${i.titulo}. ${i.texto}`).join("\n")}` };
  }

  if (tem(t, "trajeto", "caminhada", "percurso", "rota", "deslocamento", "andei")) {
    const u = trajetos[0];
    if (!u) return { texto: "Você ainda não registrou trajetos. Na aba Mobilidade, toque em “Iniciar trajeto” e a VIVVA acompanha seu percurso." };
    return { texto: `Seu último trajeto teve ${formatarDistancia(u.distanciaM)} em ${formatarDuracao(u.duracaoS)}. Você registrou ${trajetos.length} no total.` };
  }

  if (tem(t, "resumo", "meu dia")) {
    const partes = [];
    if (dados) partes.push(`Em ${cidade.nome}: ${Math.round(dados.current.temperature_2m)}°C, ${descreverClima(dados.current.weather_code).texto.toLowerCase()}.`);
    partes.push(lembretes.length ? `Rotina: ${lembretes.length - pendentes.length} de ${lembretes.length} lembretes concluídos${pendentes.length ? `; falta ${pendentes.slice(0, 3).map((l) => l.titulo).join(", ")}` : ""}.` : "Você ainda não tem lembretes hoje.");
    const rec = gerarRecomendacoes({ dados, ar, hora, lembretes })[0];
    if (rec) partes.push(`Dica: ${rec.titulo.toLowerCase()}. ${rec.texto}`);
    return { texto: partes.join("\n") };
  }

  if (tem(t, "tarefa", "pendente", "rotina", "lembretes", "agenda", "compromisso")) {
    if (!lembretes.length) return { texto: "Você ainda não tem lembretes. Diga, por exemplo: “lembre-me de ligar para o médico às 15h”." };
    if (!pendentes.length) return { texto: "Tudo concluído por hoje. Bom trabalho!" };
    const lista = [...pendentes].sort((a, b) => (a.horario || "99").localeCompare(b.horario || "99")).slice(0, 6);
    return { texto: `Você tem ${pendentes.length} ${pendentes.length === 1 ? "pendência" : "pendências"}:\n${lista.map((l) => `• ${l.titulo}${l.horario ? ` (${l.horario})` : ""}`).join("\n")}` };
  }

  if (tem(t, "vestir", "roupa", "casaco", "agasalho", "guarda-chuva", "guarda chuva", "levar", "protetor", "sair")) {
    if (!dados) return { texto: "Ainda não consegui consultar o clima. Tente de novo em instantes." };
    const recs = gerarRecomendacoes({ dados, ar, hora, lembretes }).filter((r) => r.id !== "proximo").slice(0, 3);
    return { texto: recs.map((r) => `• ${r.titulo}: ${r.texto}`).join("\n") };
  }

  if (tem(t, "clima", "tempo", "chuva", "chover", "temperatura", "frio", "calor", "sol", "vento", "uv", "qualidade do ar", "poluicao")) {
    if (!dados) return { texto: "Ainda não consegui consultar o clima. Tente de novo em instantes." };
    const a = dados.current, d = dados.daily, horas = proximasHoras(dados, 6);
    const prob = Math.max(0, ...horas.map((h) => h.prob));
    let r = `Agora em ${cidade.nome}: ${Math.round(a.temperature_2m)}°C (sensação de ${Math.round(a.apparent_temperature)}°C), ${descreverClima(a.weather_code).texto.toLowerCase()}. Hoje: mín. ${Math.round(d.temperature_2m_min[0])}° e máx. ${Math.round(d.temperature_2m_max[0])}°. Chance de chuva nas próximas 6h: até ${prob}%.`;
    if (tem(t, "uv", "sol")) r += ` UV máximo de hoje: ${Math.round(d.uv_index_max[0])}.`;
    if (tem(t, "qualidade do ar", "poluicao") && ar?.us_aqi != null) r += ` Qualidade do ar (AQI): ${Math.round(ar.us_aqi)}.`;
    return { texto: r };
  }

  if (/^(oi|ola|e ai|bom dia|boa tarde|boa noite|hey)\b/.test(t)) return { texto: "Olá! Sou a VIVVA. Posso falar do clima, listar suas tarefas, criar lembretes, resumir seu dia e mostrar seus padrões. O que você precisa?" };
  if (tem(t, "obrigad", "valeu")) return { texto: "Por nada! Estou aqui quando precisar." };
  if (tem(t, "ajuda", "o que voce faz", "o que voce sabe", "comandos")) return { texto: "Posso:\n• falar do clima e o que vestir\n• listar suas tarefas e criar lembretes (“lembre-me de… às 15h”)\n• resumir seu dia\n• mostrar seus padrões e trajetos\n• lembrar quem são seus contatos de apoio" };
  return { texto: "Não entendi bem essa. Tente algo como “como está o clima?”, “quais são minhas tarefas?” ou “lembre-me de beber água às 16h”. Digite “ajuda” para ver tudo que sei fazer." };
}
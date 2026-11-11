const CODIGOS = {
  0: ["Céu limpo", "sol"], 1: ["Predominantemente limpo", "sol"], 2: ["Parcialmente nublado", "nuvem-sol"], 3: ["Nublado", "nuvem"],
  45: ["Neblina", "neblina"], 48: ["Neblina com geada", "neblina"],
  51: ["Garoa fraca", "chuva"], 53: ["Garoa moderada", "chuva"], 55: ["Garoa forte", "chuva"], 56: ["Garoa congelante", "chuva"], 57: ["Garoa congelante forte", "chuva"],
  61: ["Chuva fraca", "chuva"], 63: ["Chuva moderada", "chuva"], 65: ["Chuva forte", "chuva"], 66: ["Chuva congelante", "chuva"], 67: ["Chuva congelante forte", "chuva"],
  71: ["Neve fraca", "neve"], 73: ["Neve moderada", "neve"], 75: ["Neve forte", "neve"], 77: ["Grãos de neve", "neve"],
  80: ["Pancadas de chuva fracas", "chuva"], 81: ["Pancadas de chuva", "chuva"], 82: ["Pancadas de chuva fortes", "chuva"], 85: ["Pancadas de neve", "neve"], 86: ["Pancadas de neve fortes", "neve"],
  95: ["Trovoadas", "tempestade"], 96: ["Trovoadas com granizo", "tempestade"], 99: ["Trovoadas com granizo forte", "tempestade"],
};
const CODIGOS_CHUVA = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];

export function descreverClima(codigo) { const [texto, tipo] = CODIGOS[codigo] || ["Condição desconhecida", "nuvem"]; return { texto, tipo }; }

export function gerarAvisos(atual, diario) {
  const avisos = [];
  const codigo = atual.weather_code;
  const prob = diario.precipitation_probability_max?.[0] ?? 0;
  const uv = diario.uv_index_max?.[0] ?? 0;
  const sensacao = atual.apparent_temperature;
  const rajada = atual.wind_gusts_10m ?? atual.wind_speed_10m;
  if ([95, 96, 99].includes(codigo)) avisos.push({ id: "tempestade", nivel: "atencao", icone: "tempestade", titulo: "Trovoadas na região", texto: "Há registro de trovoadas agora. Se puder, evite sair ou fique em locais cobertos." });
  if (CODIGOS_CHUVA.includes(codigo) || atual.precipitation > 0) avisos.push({ id: "chuva", nivel: "atencao", icone: "chuva", titulo: "Chuva neste momento", texto: "Leve guarda-chuva e redobre a atenção ao caminhar em calçadas molhadas." });
  else if (prob >= 60) avisos.push({ id: "chuva-prevista", nivel: "info", icone: "chuva", titulo: `Chance de chuva hoje: ${prob}%`, texto: "Considere levar um guarda-chuva ao sair." });
  if (sensacao >= 35) avisos.push({ id: "calor", nivel: "atencao", icone: "calor", titulo: `Calor intenso: sensação de ${Math.round(sensacao)}°C`, texto: "Beba água, use roupas leves e prefira horários mais frescos para se deslocar." });
  else if (sensacao >= 30) avisos.push({ id: "calor", nivel: "info", icone: "calor", titulo: `Dia quente: sensação de ${Math.round(sensacao)}°C`, texto: "Leve uma garrafa de água e procure sombra nos trajetos a pé." });
  if (sensacao <= 10) avisos.push({ id: "frio", nivel: "info", icone: "frio", titulo: `Frio: sensação de ${Math.round(sensacao)}°C`, texto: "Vista um agasalho antes de sair." });
  if (rajada >= 50) avisos.push({ id: "vento", nivel: "atencao", icone: "vento", titulo: `Rajadas de vento de até ${Math.round(rajada)} km/h`, texto: "Tenha cuidado com objetos soltos e árvores durante o deslocamento." });
  else if (rajada >= 35) avisos.push({ id: "vento", nivel: "info", icone: "vento", titulo: `Vento com rajadas de ${Math.round(rajada)} km/h`, texto: "Segure bem guarda-chuvas e sacolas." });
  if (uv >= 8) avisos.push({ id: "uv", nivel: "atencao", icone: "uv", titulo: `Radiação UV muito alta hoje (índice ${Math.round(uv)})`, texto: "Use protetor solar, chapéu e evite o sol forte ao meio-dia." });
  else if (uv >= 6) avisos.push({ id: "uv", nivel: "info", icone: "uv", titulo: `Radiação UV alta hoje (índice ${Math.round(uv)})`, texto: "Considere protetor solar nos trajetos ao ar livre." });
  if (atual.relative_humidity_2m <= 30) avisos.push({ id: "seco", nivel: "info", icone: "seco", titulo: `Ar seco: umidade em ${atual.relative_humidity_2m}%`, texto: "Beba água com frequência durante o dia." });
  if ([45, 48].includes(codigo)) avisos.push({ id: "neblina", nivel: "info", icone: "neblina", titulo: "Visibilidade reduzida", texto: "Há neblina na região. Redobre a atenção ao atravessar ruas." });
  if (avisos.length === 0) avisos.push({ id: "nenhum", nivel: "info", icone: "info", titulo: "Nenhum aviso agora", texto: "Não há avisos para as condições consultadas. Isso não garante que o trajeto seja seguro." });
  return avisos;
}

// ---------- Clima ampliado ----------
export function proximasHoras(dados, quantidade = 12) {
  const h = dados?.hourly; if (!h) return [];
  const corte = `${dados.current.time.slice(0, 13)}:00`;
  const inicio = Math.max(0, h.time.findIndex((t) => t >= corte));
  return h.time.slice(inicio, inicio + quantidade).map((t, i) => ({ hora: t.slice(11, 16), temp: h.temperature_2m[inicio + i], prob: h.precipitation_probability[inicio + i] ?? 0, codigo: h.weather_code[inicio + i], uv: h.uv_index?.[inicio + i] ?? 0 }));
}

export function descreverAr(aqi) {
  if (aqi == null) return { texto: "Indisponível", nivel: "info" };
  if (aqi <= 50) return { texto: "Boa", nivel: "info" };
  if (aqi <= 100) return { texto: "Moderada", nivel: "info" };
  if (aqi <= 150) return { texto: "Ruim para pessoas sensíveis", nivel: "atencao" };
  if (aqi <= 200) return { texto: "Ruim", nivel: "atencao" };
  return { texto: "Muito ruim", nivel: "atencao" };
}

// ---------- Recomendações contextuais ----------
// Combina clima agora, próximas horas, hora do dia e lembretes pendentes.
export function gerarRecomendacoes({ dados, ar, hora, lembretes = [] }) {
  if (!dados) return [];
  const { current: atual, daily: diario } = dados;
  const horas = proximasHoras(dados, 8);
  const rec = [];
  const sens = atual.apparent_temperature;
  const probProx = Math.max(0, ...horas.map((h) => h.prob));
  const chovendo = CODIGOS_CHUVA.includes(atual.weather_code) || atual.precipitation > 0;
  const uvAgora = horas[0]?.uv ?? 0;
  const pendentesComHorario = lembretes.filter((l) => !l.concluido && l.horario).sort((a, b) => a.horario.localeCompare(b.horario));
  const proximo = pendentesComHorario.find((l) => { const [hh, mm] = l.horario.split(":").map(Number); return hh + mm / 60 >= hora - 0.25; });

  if (chovendo || probProx >= 60) {
    const quando = chovendo ? "agora" : `nas próximas horas (até ${probProx}%)`;
    rec.push({ id: "guarda-chuva", icone: "chuva", titulo: "Leve guarda-chuva", texto: `Há chuva ${quando}. ${proximo ? `Seu compromisso “${proximo.titulo}” às ${proximo.horario} pode ser afetado: saia com folga.` : "Prefira sair com folga de tempo."}` });
  }
  if (sens >= 30) rec.push({ id: "roupa-calor", icone: "calor", titulo: "Roupas leves e água", texto: `Sensação de ${Math.round(sens)}°C. Use tecidos leves e leve uma garrafa de água${hora >= 11 && hora <= 15 ? "; evite o sol forte do meio-dia" : ""}.` });
  else if (sens <= 15) rec.push({ id: "roupa-frio", icone: "frio", titulo: sens <= 10 ? "Agasalho grosso" : "Leve um casaco", texto: `Sensação de ${Math.round(sens)}°C${hora >= 17 || hora < 7 ? ", e à noite tende a esfriar mais" : ""}. Vista camadas.` });
  else rec.push({ id: "roupa-ok", icone: "info", titulo: "Temperatura agradável", texto: `Sensação de ${Math.round(sens)}°C: roupas leves e um casaquinho de reserva bastam.` });
  if (uvAgora >= 6 || (diario.uv_index_max?.[0] ?? 0) >= 8) rec.push({ id: "uv", icone: "uv", titulo: "Proteção solar", texto: `UV ${uvAgora >= 6 ? `${Math.round(uvAgora)} agora` : `chega a ${Math.round(diario.uv_index_max[0])} hoje`}. Use protetor, chapéu e procure sombra nos trajetos a pé.` });
  if (ar?.us_aqi > 100) rec.push({ id: "ar", icone: "seco", titulo: "Qualidade do ar ruim", texto: "Evite exercício intenso ao ar livre e mantenha medicamentos respiratórios à mão, se você usa." });
  if (atual.relative_humidity_2m <= 30) rec.push({ id: "seco", icone: "seco", titulo: "Hidrate-se", texto: `Umidade em ${atual.relative_humidity_2m}%. Beba água com frequência.` });
  if ((atual.wind_gusts_10m ?? 0) >= 40) rec.push({ id: "vento", icone: "vento", titulo: "Vento forte", texto: "Atenção a objetos soltos e árvores durante o deslocamento." });
  const melhor = horas.filter((h) => h.prob < 30 && h.temp < 32 && h.temp > 12)[0];
  if (!chovendo && probProx >= 60 && melhor) rec.push({ id: "janela", icone: "info", titulo: "Melhor janela para sair", texto: `Por volta de ${melhor.hora} a chance de chuva é de só ${melhor.prob}%.` });
  if (proximo) rec.push({ id: "proximo", icone: "info", titulo: `Próximo: ${proximo.titulo}`, texto: `Marcado para ${proximo.horario}.` });
  return rec;
}
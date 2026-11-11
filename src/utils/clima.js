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
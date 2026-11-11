const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const PREVISAO = "https://api.open-meteo.com/v1/forecast";

async function pedir(url, sinal) { const r = await fetch(url, { signal: sinal }); if (!r.ok) throw new Error(`Erro ${r.status}`); return r.json(); }

export async function buscarCidades(nome, sinal) {
  const dados = await pedir(`${GEO}?name=${encodeURIComponent(nome)}&count=5&language=pt&format=json`, sinal);
  return (dados.results || []).map((c) => ({ id: c.id, nome: c.name, estado: c.admin1 || "", pais: c.country || "", latitude: c.latitude, longitude: c.longitude }));
}

export async function buscarClima({ latitude, longitude }, sinal) {
  const params = new URLSearchParams({ latitude, longitude, current: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,is_day", daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max", timezone: "auto", forecast_days: "4" });
  return pedir(`${PREVISAO}?${params}`, sinal);
}
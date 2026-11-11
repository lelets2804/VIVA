// Detecção de padrões a partir dos lembretes e dos trajetos do próprio usuário.
// Tudo local: nenhum dado sai do navegador.
const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const periodo = (h) => (h < 6 ? "madrugada" : h < 12 ? "manhã" : h < 18 ? "tarde" : "noite");
const maisComum = (arr) => { const c = {}; arr.forEach((x) => { c[x] = (c[x] || 0) + 1; }); const e = Object.entries(c).sort((a, b) => b[1] - a[1]); return e[0] ? { valor: e[0][0], qtd: e[0][1] } : null; };
const minutos = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

export function analisarPadroes(lembretes = [], trajetos = [], agora = new Date()) {
  const concluidos = lembretes.filter((l) => l.concluido && l.concluidoEm);
  const porHora = Array(24).fill(0);
  concluidos.forEach((l) => { porHora[new Date(l.concluidoEm).getHours()] += 1; });
  const porDia = Array(7).fill(0);
  concluidos.forEach((l) => { porDia[new Date(l.concluidoEm).getDay()] += 1; });

  const categorias = {};
  lembretes.forEach((l) => { const c = l.categoria || "Pessoal"; categorias[c] = categorias[c] || { total: 0, feitos: 0 }; categorias[c].total += 1; if (l.concluido) categorias[c].feitos += 1; });
  const porCategoria = Object.entries(categorias).map(([nome, v]) => ({ nome, ...v, taxa: Math.round((v.feitos / v.total) * 100) })).sort((a, b) => b.total - a.total);

  const taxa = lembretes.length ? Math.round((concluidos.length / lembretes.length) * 100) : 0;
  const insights = [];

  if (concluidos.length >= 3) {
    const p = maisComum(concluidos.map((l) => periodo(new Date(l.concluidoEm).getHours())));
    if (p && p.qtd / concluidos.length >= 0.5) insights.push({ id: "periodo", icone: "relogio", titulo: `Você rende mais de ${p.valor}`, texto: `${Math.round((p.qtd / concluidos.length) * 100)}% das suas tarefas são concluídas de ${p.valor}. Deixe o que é mais importante para esse período.` });
    const d = maisComum(concluidos.map((l) => new Date(l.concluidoEm).getDay()));
    if (d && d.qtd >= 2) insights.push({ id: "dia", icone: "calendario", titulo: `${DIAS[d.valor]} é seu dia mais produtivo`, texto: `${d.qtd} tarefas concluídas nesse dia da semana.` });
  }

  // Atraso médio entre o horário planejado e a conclusão real.
  const atrasos = concluidos.filter((l) => l.horario).map((l) => { const c = new Date(l.concluidoEm); return c.getHours() * 60 + c.getMinutes() - minutos(l.horario); }).filter((m) => Math.abs(m) < 360);
  if (atrasos.length >= 3) {
    const media = Math.round(atrasos.reduce((a, b) => a + b, 0) / atrasos.length);
    if (media >= 20) insights.push({ id: "atraso", icone: "alerta", titulo: "Você costuma concluir depois do horário", texto: `Em média ${media} minutos depois do marcado. Que tal programar lembretes um pouco mais cedo?` });
    else if (media <= -10) insights.push({ id: "adiantado", icone: "ok", titulo: "Você costuma se adiantar", texto: `Em média ${Math.abs(media)} minutos antes do horário marcado. Ótimo hábito.` });
    else insights.push({ id: "pontual", icone: "ok", titulo: "Você é pontual", texto: "Suas conclusões ficam bem próximas do horário planejado." });
  }

  const comTaxa = porCategoria.filter((c) => c.total >= 3);
  if (comTaxa.length >= 2) {
    const pior = [...comTaxa].sort((a, b) => a.taxa - b.taxa)[0], melhor = [...comTaxa].sort((a, b) => b.taxa - a.taxa)[0];
    if (pior.taxa < melhor.taxa) insights.push({ id: "categoria", icone: "alerta", titulo: `“${pior.nome}” é a categoria que mais fica pendente`, texto: `Só ${pior.taxa}% concluídos, contra ${melhor.taxa}% em “${melhor.nome}”.` });
  }
  const meds = categorias.Medicamento;
  if (meds && meds.total >= 3 && meds.taxa < 70) insights.push({ id: "meds", icone: "alerta", titulo: "Atenção aos medicamentos", texto: `Apenas ${meds.taxa}% dos lembretes de medicamento foram concluídos. Se esquecer com frequência, converse com seu médico ou farmacêutico sobre estratégias.` });

  const atrasados = lembretes.filter((l) => !l.concluido && l.horario && minutos(l.horario) < agora.getHours() * 60 + agora.getMinutes());
  if (atrasados.length > 0) insights.push({ id: "atrasados", icone: "alerta", titulo: `${atrasados.length} ${atrasados.length === 1 ? "lembrete passou" : "lembretes passaram"} do horário hoje`, texto: atrasados.slice(0, 3).map((l) => `${l.titulo} (${l.horario})`).join(", ") + "." });

  // Trajetos
  const dist = trajetos.reduce((t, x) => t + x.distanciaM, 0);
  if (trajetos.length >= 3) {
    const h = maisComum(trajetos.map((t) => periodo(new Date(t.inicio).getHours())));
    if (h) insights.push({ id: "trajeto-periodo", icone: "rota", titulo: `Você costuma se deslocar de ${h.valor}`, texto: `${h.qtd} de ${trajetos.length} trajetos registrados foram nesse período. Os avisos de clima dessa hora são os mais úteis para você.` });
    insights.push({ id: "trajeto-media", icone: "rota", titulo: `Trajeto médio: ${(dist / trajetos.length / 1000).toFixed(1).replace(".", ",")} km`, texto: `${trajetos.length} trajetos registrados, ${(dist / 1000).toFixed(1).replace(".", ",")} km no total.` });
  }

  const dadosSuficientes = concluidos.length >= 3 || trajetos.length >= 3;
  if (!dadosSuficientes) insights.push({ id: "poucos", icone: "info", titulo: "Ainda aprendendo sobre você", texto: "Conclua pelo menos 3 lembretes e registre alguns trajetos: a VIVVA começa a mostrar seus padrões a partir daí." });
  return { insights, porHora, porDia, porCategoria, taxa, totalConcluidos: concluidos.length, dadosSuficientes, nomesDias: DIAS };
}
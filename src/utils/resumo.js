export function gerarResumo(rotina, contatos) {
  return {
    rotina: rotina.total > 0 ? `${rotina.concluidos} de ${rotina.total} lembretes concluídos` : "Crie seu primeiro lembrete",
    seguranca: contatos.length > 0 ? `${contatos.length} ${contatos.length === 1 ? "contato de apoio" : "contatos de apoio"}` : "Cadastre um contato de apoio",
    mobilidade: "Clima e avisos do seu deslocamento",
  };
}
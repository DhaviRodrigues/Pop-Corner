export class Sessao {
  constructor(
    private idFilme: string,
    private data: string,
    private horario: string
  ) {}

  getIdFilme() { return this.idFilme; }
  getData() { return this.data; }
  getHorario() { return this.horario; }

  static createSessao(payload: { idFilme: string; data: string; horario: string }): Sessao {
    const idFilmeLimpo = payload.idFilme.trim();
    const dataLimpa = payload.data.trim();
    const horarioLimpo = payload.horario.trim();

    if (!idFilmeLimpo) {
      throw new Error("O ID do filme é obrigatório para criar uma sessão.");
    }

    const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regexData.test(dataLimpa)) {
      throw new Error("Formato de data inválido. Use o padrão DD/MM/AAAA (ex: 15/05/2026).");
    }

    const regexHorario = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regexHorario.test(horarioLimpo)) {
      throw new Error("Formato de horário inválido. Use o padrão HH:MM de 24 horas (ex: 14:30).");
    }

    return new Sessao(idFilmeLimpo, dataLimpa, horarioLimpo);
  }

  toFirestore() {
    return {
      id_filme: this.idFilme,
      data: this.data,
      horario: this.horario
    };
  }
}
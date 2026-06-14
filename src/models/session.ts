export interface ISession {
  idFilme: string;
  data: string;
  horario: string;
}

export class Session implements ISession {
  constructor(
    public idFilme: string,
    public data: string,
    public horario: string
  ) {}

  getIdFilme(): string { return this.idFilme; }
  getData(): string { return this.data; }
  getHorario(): string { return this.horario; }

  /**
   * Fábrica Estática (Factory Pattern) para validação estrutural da Sessão
   */
  static createSessao(payload: ISession): Session {
    const idFilmeLimpo = (payload.idFilme || '').trim();
    const dataLimpa = (payload.data || '').trim();
    const horarioLimpo = (payload.horario || '').trim();

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

    return new Session(idFilmeLimpo, dataLimpa, horarioLimpo);
  }
}
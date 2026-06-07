export class WatchlistEntry {
  constructor(
    private idFilme: string,
    private dataAdicionado: string
  ) {}

  getIdFilme() { return this.idFilme; }
  getDataAdicionado() { return this.dataAdicionado; }

  static createEntry(payload: { idFilme: string; dataAdicionado?: string }): WatchlistEntry {
    const idLimpo = (payload.idFilme || '').toString().trim();
    if (!idLimpo) {
      throw new Error('O ID do filme é obrigatório para adicionar à watchlist.');
    }

    const data = payload.dataAdicionado && payload.dataAdicionado.trim().length > 0
      ? payload.dataAdicionado.trim()
      : new Date().toISOString();

    return new WatchlistEntry(idLimpo, data);
  }

  toFirestore() {
    return {
      id_filme: this.idFilme,
      added_at: this.dataAdicionado
    };
  }
}

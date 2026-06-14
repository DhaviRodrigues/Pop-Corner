import { ICinema, ICinemaPayload } from "@/types/ICinema";
import { Session } from "./session";

export class Cinema implements ICinema {
  constructor(
    public nome: string,
    public cidade: string,
    public endereco: string,
    public latitude: number,
    public longitude: number,
    public urlImagem: string,
    public filmesEmCartaz: string[],
    public sessoes: Session[],
    public avaliacao: number = 0,
    public comentarios: any[] = [],
    public isParceiro: boolean = false
  ) {}

  // Getters estruturados (POO)
  getNome(): string { return this.nome; }
  getCidade(): string { return this.cidade; }
  getEndereco(): string { return this.endereco; }
  getLatitude(): number { return this.latitude; }
  getLongitude(): number { return this.longitude; }
  getUrlImagem(): string { return this.urlImagem; }
  getFilmesEmCartaz(): string[] { return this.filmesEmCartaz; }
  getSessoes(): Session[] { return this.sessoes; }
  getAvaliacao(): number { return this.avaliacao; }
  getComentarios(): any[] { return this.comentarios; }
  getIsParceiro(): boolean { return this.isParceiro; }

  /**
   * Fábrica Estática (Factory Pattern):
   * Centraliza as regras de consistência de domínio de um Cinema antes de permitir sua instanciação.
   */
  static createCinema(payload: ICinemaPayload): Cinema {
    const nomeLimpo = (payload.nome || '').trim();
    const cidadeLimpa = (payload.cidade || '').trim();
    const enderecoLimpo = (payload.endereco || '').trim();
    const urlLimpa = (payload.urlImagem || '').trim() || "https://placehold.co/600x400/D9D9D9/A62103?text=Sem+Imagem";

    if (!nomeLimpo || !cidadeLimpa || !enderecoLimpo) {
      throw new Error("Classe Cinema recusou a criação: Nome, Cidade e Endereço são obrigatórios.");
    }

    // Normalização das coordenadas geográficas
    const lat = typeof payload.latitude === "string" 
      ? parseFloat(payload.latitude.replace(',', '.')) 
      : payload.latitude;
      
    const lng = typeof payload.longitude === "string" 
      ? parseFloat(payload.longitude.replace(',', '.')) 
      : payload.longitude;

    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error("Latitude inválida. Deve ser um número real entre -90 e 90.");
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new Error("Longitude inválida. Deve ser um número real entre -180 e 180.");
    }

    const listaFilmes = payload.filmesEmCartaz || [];
    const listaSessoes = payload.sessoes || [];

    // Validações de Regra de Negócio Pura (Agnósticas a Banco de Dados)
    if (listaSessoes.length > 0 && listaFilmes.length === 0) {
      throw new Error("Regra de Negócio: Um cinema não pode ter sessões se não há filmes em cartaz.");
    }

    for (const sessao of listaSessoes) {
      if (!listaFilmes.includes(sessao.getIdFilme())) {
        throw new Error(`Incoerência: A sessão aponta para o filme '${sessao.getIdFilme()}', mas ele não está no catálogo deste cinema.`);
      }
    }

    return new Cinema(
      nomeLimpo,
      cidadeLimpa,
      enderecoLimpo,
      lat,
      lng,
      urlLimpa,
      listaFilmes,
      listaSessoes,
      payload.avaliacao || 0,
      payload.comentarios || [],
      payload.isParceiro || false
    );
  }
}
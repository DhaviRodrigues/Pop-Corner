import { GeoPoint, Timestamp } from "firebase/firestore";
import { Sessao } from "./sessao"; 

export class Cinema {
  constructor(
    private nome: string,
    private cidade: string,
    private endereco: string,
    private latitude: number,
    private longitude: number,
    private urlImagem: string,
    private filmesEmCartaz: string[], 
    private sessoes: Sessao[],
    private avaliacao: number = 0,
    private comentarios: any[] = [],
    private isParceiro: boolean = false 
  ) {}

  getNome() { return this.nome; }
  getCidade() { return this.cidade; }
  getEndereco() { return this.endereco; }
  getLatitude() { return this.latitude; }
  getLongitude() { return this.longitude; }
  getUrlImagem() { return this.urlImagem; }
  getAvaliacao() { return this.avaliacao; }
  getComentarios() { return this.comentarios; }
  getIsParceiro() { return this.isParceiro; }

  static createCinema(payload: {
    nome: string;
    cidade: string;
    endereco: string;
    latitude: string | number;
    longitude: string | number;
    urlImagem: string;
    filmesEmCartaz?: string[]; 
    sessoes?: Sessao[];  
    avaliacao?: number;
    comentarios?: any[];      
    isParceiro?: boolean;
  }): Cinema {

    const nomeLimpo = payload.nome.trim();
    const cidadeLimpa = payload.cidade.trim();
    const enderecoLimpo = payload.endereco.trim();
    const urlLimpa = payload.urlImagem.trim() || "https://placehold.co/600x400/D9D9D9/A62103?text=Sem+Imagem";

    if (!nomeLimpo || !cidadeLimpa || !enderecoLimpo) {
      throw new Error("Classe Cinema recusou a criação: Nome, Cidade e Endereço são obrigatórios.");
    }

    const lat = typeof payload.latitude === "string" ? parseFloat(payload.latitude.replace(',', '.')) : payload.latitude;
    const lng = typeof payload.longitude === "string" ? parseFloat(payload.longitude.replace(',', '.')) : payload.longitude;

    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error("Latitude inválida. Deve ser um número real entre -90 e 90.");
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new Error("Longitude inválida. Deve ser um número real entre -180 e 180.");
    }

    const listaFilmes = payload.filmesEmCartaz || [];
    const listaSessoes = payload.sessoes || [];

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

  toFirestore() {
    return {
      nome: this.nome,
      cidade: this.cidade,
      endereco: this.endereco,
      url_imagem: this.urlImagem,
      coordinates: new GeoPoint(this.latitude, this.longitude),
      created_at: Timestamp.now(),
      nome_search: this.nome.toLowerCase(),
      filmesEmCartaz: this.filmesEmCartaz,
      sessoes: this.sessoes.map(sessao => sessao.toFirestore()),
      avaliacao: this.avaliacao,
      comentarios: this.comentarios,
      is_parceiro: this.isParceiro
    };
  }
}
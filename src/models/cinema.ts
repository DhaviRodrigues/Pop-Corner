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
    public comments: string, // Agora é uma string (caminho)
    public isParceiro: boolean = false,
    public qnt_avaliacoes: number = 0 // Adicionado para manter consistência com o constructor
  ) {}

  // Getters estruturados
  getNome(): string { return this.nome; }
  getCidade(): string { return this.cidade; }
  getEndereco(): string { return this.endereco; }
  getLatitude(): number { return this.latitude; }
  getLongitude(): number { return this.longitude; }
  getUrlImagem(): string { return this.urlImagem; }
  getFilmesEmCartaz(): string[] { return this.filmesEmCartaz; }
  getSessoes(): Session[] { return this.sessoes; }
  getAvaliacao(): number { return this.avaliacao; }
  getComentarios(): string { return this.comments; }
  getIsParceiro(): boolean { return this.isParceiro; }
  getQntAvaliacoes(): number { return this.qnt_avaliacoes; }

  static createCinema(payload: ICinemaPayload): Cinema {
    const nomeLimpo = (payload.nome || '').trim();
    const cidadeLimpa = (payload.cidade || '').trim();
    const enderecoLimpo = (payload.endereco || '').trim();
    const urlLimpa = (payload.urlImagem || '').trim() || "https://placehold.co/600x400/D9D9D9/A62103?text=Sem+Imagem";

    if (!nomeLimpo || !cidadeLimpa || !enderecoLimpo) {
      throw new Error("Nome, Cidade e Endereço são obrigatórios.");
    }

    const lat = typeof payload.latitude === "string" ? parseFloat(payload.latitude.replace(',', '.')) : payload.latitude;
    const lng = typeof payload.longitude === "string" ? parseFloat(payload.longitude.replace(',', '.')) : payload.longitude;

    if (isNaN(lat) || lat < -90 || lat > 90) throw new Error("Latitude inválida.");
    if (isNaN(lng) || lng < -180 || lng > 180) throw new Error("Longitude inválida.");

    const listaFilmes = payload.filmesEmCartaz || [];
    const listaSessoes = payload.sessoes || [];

    // Garante que o campo de comentários seja tratado como string (caminho)
    const caminhoComentarios = typeof payload.comentarios === 'string' ? payload.comentarios : "";

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
      caminhoComentarios,
      payload.isParceiro || false,
      payload.qnt_avaliacoes || 0
    );
  }
}
import { Session } from "@/models/session";
import { Comment } from "@/models/comment";

export interface ICinema {
  nome: string;
  cidade: string;
  endereco: string;
  latitude: number;
  longitude: number;
  urlImagem: string;
  filmesEmCartaz: string[];
  sessoes: Session[];
  avaliacao: number;
  comments: Comment[];
  isParceiro: boolean;
  qnt_avaliacoes: number;
}

export interface ICinemaPayload {
  nome: string;
  cidade: string;
  endereco: string;
  latitude: string | number;
  longitude: string | number;
  urlImagem: string;
  filmesEmCartaz?: string[];
  sessoes?: Session[];
  avaliacao?: number;
  comentarios?: any[];
  isParceiro?: boolean;
}
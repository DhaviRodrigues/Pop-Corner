import { Session } from "@/models/session";

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
  comentarios: any[];
  isParceiro: boolean;
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
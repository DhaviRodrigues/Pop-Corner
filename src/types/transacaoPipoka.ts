export type TipoTransacao = 'GANHO' | 'GASTO';

export interface TransacaoPipoka {
  id?: string;
  id_usuario: string;
  quantidade: number;
  tipo_transacao: TipoTransacao;
  descricao: string;
  created_at: string;
}

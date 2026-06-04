import { Timestamp } from "firebase/firestore";

export enum TipoCupom {
  PORCENTAGEM = 'PORCENTAGEM',
  VALOR_FIXO = 'VALOR_FIXO',
  PRODUTO_BRINDE = 'PRODUTO_BRINDE',
  DOIS_POR_UM = 'DOIS_POR_UM'
}

export class Cupom {
  constructor(
    private idCupom: string,
    private nomeCupom: string,
    private valorPipokas: number,
    private urlIcone: string,
    private tipoCupom: TipoCupom,
    private valorBeneficio: number | string | null,
    private descricaoProduto: string,
    private dataExpiracaoResgate: Date,
    private validadePosResgate: number
  ) {}

  getIdCupom() { return this.idCupom; }
  getNomeCupom() { return this.nomeCupom; }
  getValorPipokas() { return this.valorPipokas; }
  getUrlIcone() { return this.urlIcone; }
  getTipoCupom() { return this.tipoCupom; }
  getValorBeneficio() { return this.valorBeneficio; }
  getDescricaoProduto() { return this.descricaoProduto; }
  getDataExpiracaoResgate() { return this.dataExpiracaoResgate; }
  getValidadePosResgate() { return this.validadePosResgate; }

  // Verifica se o cupom ainda pode ser comprado na loja
  isDisponivelParaResgate(): boolean {
    const hoje = new Date();
    return hoje <= this.dataExpiracaoResgate;
  }

  // Calcula a data limite de uso baseado no dia em que o usuário resgatou
  calcularDataVencimentoUso(dataResgate: Date = new Date()): Date {
    const dataVencimento = new Date(dataResgate);
    dataVencimento.setDate(dataVencimento.getDate() + this.validadePosResgate);
    return dataVencimento;
  }

  getDetalhesBeneficio(): string {
    switch (this.tipoCupom) {
      case TipoCupom.PORCENTAGEM:
        return `${(Number(this.valorBeneficio) * 100).toFixed(0)}% de Desconto`;
      case TipoCupom.VALOR_FIXO:
        return `R$ ${Number(this.valorBeneficio).toFixed(2)} de Desconto`;
      case TipoCupom.PRODUTO_BRINDE:
        return `Brinde: ${this.valorBeneficio}`;
      case TipoCupom.DOIS_POR_UM:
        return `Promoção 2 Por 1`;
      default:
        return "Benefício Especial";
    }
  }

  // Método seguro para criar um Cupom na aplicação antes de enviar ao Firebase
  static createCupom(payload: {
    idCupom?: string; 
    nomeCupom: string;
    valorPipokas: number;
    urlIcone: string;
    tipoCupom: TipoCupom;
    valorBeneficio: number | string | null;
    descricaoProduto: string;
    dataExpiracaoResgate: Date;
    validadePosResgate: number;
  }): Cupom {
    
    // Validações estritas baseadas nos limites definidos
    if (payload.nomeCupom.length > 100) throw new Error("O nome do cupom excedeu 100 caracteres.");
    if (payload.descricaoProduto.length > 255) throw new Error("A descrição excedeu 255 caracteres.");
    if (payload.valorPipokas < 0) throw new Error("O valor em Pipokas não pode ser negativo.");

    // Validações da Regra de Negócio do valorBeneficio
    let beneficioFinal = payload.valorBeneficio;
    if (payload.tipoCupom === TipoCupom.DOIS_POR_UM) beneficioFinal = null;
    if (payload.tipoCupom === TipoCupom.PRODUTO_BRINDE && typeof beneficioFinal !== 'string') {
        throw new Error("Para brindes, o valor do benefício deve ser o nome do produto (String).");
    }

    return new Cupom(
      payload.idCupom || "", 
      payload.nomeCupom,
      payload.valorPipokas,
      payload.urlIcone,
      payload.tipoCupom,
      beneficioFinal,
      payload.descricaoProduto,
      payload.dataExpiracaoResgate,
      payload.validadePosResgate
    );
  }

  // Converte a Classe para um Objeto puro do Firestore
  toFirestore() {
    return {
      nome_cupom: this.nomeCupom,
      valor_pipokas: this.valorPipokas,
      url_icone: this.urlIcone,
      tipo_cupom: this.tipoCupom,
      valor_beneficio: this.valorBeneficio,
      descricao_produto: this.descricaoProduto,
      data_expiracao_resgate: Timestamp.fromDate(this.dataExpiracaoResgate),
      validade_pos_resgate: this.validadePosResgate
    };
  }

  static fromFirestore(id: string, data: any): Cupom {
    return new Cupom(
      id,
      data.nome_cupom || "",
      data.valor_pipokas || 0,
      data.url_icone || "",
      data.tipo_cupom as TipoCupom,
      data.valor_beneficio ?? null,
      data.descricao_produto || "",
      
      data.data_expiracao_resgate ? data.data_expiracao_resgate.toDate() : new Date(),
      data.validade_pos_resgate || 0
    );
  }
}
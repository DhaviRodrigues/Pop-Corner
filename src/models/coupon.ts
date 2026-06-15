import { Timestamp } from "firebase/firestore";

export enum TipoCupom {
  PORCENTAGEM = 'PORCENTAGEM',
  VALOR_FIXO = 'VALOR_FIXO',
  PRODUTO_BRINDE = 'PRODUTO_BRINDE',
  DOIS_POR_UM = 'DOIS_POR_UM'
}

export class Coupon {
  constructor(
    private idCupom: string,
    private nomeCupom: string,
    private valorPipokas: number,
    private urlIcone: string,
    private tipoCupom: TipoCupom,
    private valorBeneficio: number | string | null,
    private descricaoProduto: string,
    private validadePosResgate: number,
    private isTempoLimitado: boolean,
    private dataExpiracaoResgate: Date | null,
    private quantidadeDisponivel: number | null 
  ) {}

  getIdCupom() { return this.idCupom; }
  getNomeCupom() { return this.nomeCupom; }
  getValorPipokas() { return this.valorPipokas; }
  getUrlIcone() { return this.urlIcone; }
  getTipoCupom() { return this.tipoCupom; }
  getValorBeneficio() { return this.valorBeneficio; }
  getDescricaoProduto() { return this.descricaoProduto; }
  getValidadePosResgate() { return this.validadePosResgate; }
  getIsTempoLimitado() { return this.isTempoLimitado; }
  getDataExpiracaoResgate() { return this.dataExpiracaoResgate; }
  getQuantidadeDisponivel() { return this.quantidadeDisponivel; }


  isDisponivelParaResgate(): boolean {
   
    if (this.quantidadeDisponivel !== null && this.quantidadeDisponivel <= 0) {
      return false; 
    }

    if (this.isTempoLimitado && this.dataExpiracaoResgate) {
      const hoje = new Date();
      if (hoje > this.dataExpiracaoResgate) {
        return false; 
      }
    }

    return true; 
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
    validadePosResgate: number;
    isTempoLimitado?: boolean;
    dataExpiracaoResgate?: Date | null;
    quantidadeDisponivel?: number | null;
  }): Coupon {
    
    // Validações estritas baseadas nos limites definidos
    if (payload.nomeCupom.length > 100) throw new Error("O nome do cupom excedeu 100 caracteres.");
    if (payload.descricaoProduto.length > 255) throw new Error("A descrição excedeu 255 caracteres.");
    if (payload.valorPipokas < 0) throw new Error("O valor em Pipokas não pode ser negativo.");

    // Validação da nova Regra de Tempo Limitado
    const tempoLimitado = payload.isTempoLimitado || false;
    if (tempoLimitado && !payload.dataExpiracaoResgate) {
        throw new Error("Cupons por tempo limitado precisam ter uma data de expiração definida.");
    }

    // Validação da nova Regra de Quantidade Limitada
    if (payload.quantidadeDisponivel !== undefined && payload.quantidadeDisponivel !== null && payload.quantidadeDisponivel < 0) {
        throw new Error("A quantidade disponível não pode ser menor que zero.");
    }

    // Validações da Regra de Negócio do valorBeneficio
    let beneficioFinal = payload.valorBeneficio;
    if (payload.tipoCupom === TipoCupom.DOIS_POR_UM) beneficioFinal = null;
    if (payload.tipoCupom === TipoCupom.PRODUTO_BRINDE && typeof beneficioFinal !== 'string') {
        throw new Error("Para brindes, o valor do benefício deve ser o nome do produto (String).");
    }

    return new Coupon(
      payload.idCupom || "", 
      payload.nomeCupom,
      payload.valorPipokas,
      payload.urlIcone,
      payload.tipoCupom,
      beneficioFinal,
      payload.descricaoProduto,
      payload.validadePosResgate,
      tempoLimitado,
      payload.dataExpiracaoResgate || null,
      payload.quantidadeDisponivel !== undefined ? payload.quantidadeDisponivel : null
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
      validade_pos_resgate: this.validadePosResgate,
      is_tempo_limitado: this.isTempoLimitado,
      data_expiracao_resgate: this.dataExpiracaoResgate ? Timestamp.fromDate(this.dataExpiracaoResgate) : null,
      quantidade_disponivel: this.quantidadeDisponivel
    };
  }

static fromFirestore(id: string, data: any): Coupon {
    return new Coupon(
      id,
      data.nome_cupom || data.nome || data.title,              
      data.valor_pipokas || data.valorPipokas || data.pipokaCost || 0,
      data.url_icone || data.urlIcone || "",
      (data.tipo_cupom || data.tipo || data.type) as TipoCupom, 
      data.valor_beneficio ?? data.valorBeneficios ?? data.circleText ?? null,
      data.descricao_produto || data.observacoes || data.description || "",
      Number(data.validade_pos_resgate || data.tempoValidade) || 0, 
      data.is_tempo_limitado || data.temporaria || false,
      data.data_expiracao_resgate ? data.data_expiracao_resgate.toDate() : (data.dataExpiracao?.toDate ? data.dataExpiracao.toDate() : null),
      data.quantidade_disponivel ?? data.qtdCupons
    );
  }
}
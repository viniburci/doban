export enum TipoContrato {
    CLT_CE_CJ = 'CLT_CE_CJ',
    CLT_CE_SJ = 'CLT_CE_SJ',
    CLT_SE_SJ = 'CLT_SE_SJ',
    TEMP_CJ = 'TEMP_CJ',
    INDEFINIDO = 'INDEFINIDO',
}

export enum TipoAcrescimoSubstituicao {
    ACRESCIMO = 'ACRESCIMO',
    SUBSTITUICAO = 'SUBSTITUICAO',
}

export enum AtestadoSaudeOcupacional {
    ADMISSIONAL = 'ADMISSIONAL',
    DEMISSIONAL = 'DEMISSIONAL',
    RETORNO = 'RETORNO',
}

export enum TipoContratante {
    DOBAN_PRESTADORA_DE_SERVIÇOS_LTDA = 'DOBAN_PRESTADORA_DE_SERVIÇOS_LTDA',
}

export interface VagaFormData {
    id: string | null;
    cliente: string | null;
    cidade: string | null;
    uf: string | null;
    cargo: string | null;
    setor: string | null;
    salario: number | null;
    tipoContrato: TipoContrato | null;
    dataAdmissao: string | null;
    dataDemissao: string | null;  
    acrescimoOuSubstituicao: TipoAcrescimoSubstituicao | null;
    aso: AtestadoSaudeOcupacional | null;
    optanteVT: boolean | null;
    horarioEntrada: string | null;
    horarioSaida: string | null;
    contratante: TipoContratante | null;
}
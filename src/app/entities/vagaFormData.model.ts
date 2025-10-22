export enum TipoContrato {
    CLT = 'CLT',
    PJ = 'PJ',
}

export enum TipoAcrescimoSubstituicao {
    ACRESCIMO = 'ACRESCIMO',
    SUBSTITUICAO = 'SUBSTITUICAO',
}

export enum AtestadoSaudeOcupacional {
    APT = 'APT',
    INAPT = 'INAPT',
}

export enum TipoContratante {
    EMPRESA = 'EMPRESA',
    CONTRATADO = 'CONTRATADO',
}

export interface VagaFormData {
    pessoaId: string | null; 

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
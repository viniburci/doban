import { FieldSchema } from './field-schema.model';

export interface TipoVagaResumo {
  id: number;
  codigo: string;
  nome: string;
}

export interface TemplateDocumento {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string | null;
  conteudoHtml: string;
  schemaItens?: FieldSchema | null;
  variaveisDisponiveis?: string[];
  tiposVagaPermitidos?: TipoVagaResumo[];
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateDocumentoCreate {
  codigo: string;
  nome: string;
  descricao?: string | null;
  conteudoHtml: string;
  schemaItens?: FieldSchema | null;
  variaveisDisponiveis?: string[];
  tiposVagaPermitidosIds?: number[];
}

export interface TemplateDocumentoUpdate {
  nome?: string | null;
  descricao?: string | null;
  conteudoHtml?: string | null;
  schemaItens?: FieldSchema | null;
  variaveisDisponiveis?: string[];
  tiposVagaPermitidosIds?: number[];
  ativo?: boolean | null;
}

export type CampoTamanhoPessoa = 'tamanhoCamisa' | 'tamanhoCalca' | 'tamanhoCalcado' | 'tamanhoLuva' | 'tamanhoCapacete';

export interface ItemPadrao {
  descricao: string;
  quantidade: number;
  tamanho?: string;
  marca?: string;
  valor?: number;
  numeroSerie?: string;
  campoTamanhoPessoa?: CampoTamanhoPessoa | null;
  [key: string]: unknown;
}

export const CAMPOS_TAMANHO_PESSOA: { valor: CampoTamanhoPessoa; rotulo: string }[] = [
  { valor: 'tamanhoCamisa', rotulo: 'Tam. Camisa' },
  { valor: 'tamanhoCalca', rotulo: 'Tam. Calca' },
  { valor: 'tamanhoCalcado', rotulo: 'Tam. Calcado' },
  { valor: 'tamanhoLuva', rotulo: 'Tam. Luva' },
  { valor: 'tamanhoCapacete', rotulo: 'Tam. Capacete' },
];

export interface DadosTemplate {
  pessoa: Record<string, unknown>;
  vaga: Record<string, unknown>;
  itens: ItemPadrao[];
  schemaItens?: FieldSchema | null;
  variaveisDisponiveis?: string[];
}

export interface GerarDocumentoRequest {
  itens?: ItemPadrao[];
  outrosCampos?: Record<string, unknown>;
}

export interface GerarDocumentoCustomRequest {
  htmlContent: string;
  itens?: ItemPadrao[];
}

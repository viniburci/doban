import { FieldSchema } from './field-schema.model';
import { TipoRecursoResumoDTO } from './tipo-recurso.model';
import { ItemPadrao } from './template-documento.model';

/**
 * DTO de resposta para TipoVaga
 */
export interface TipoVagaDTO {
  id: number | null;
  codigo: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  schema?: FieldSchema | null;
  itensPadrao?: ItemPadrao[];
  recursosPermitidos?: TipoRecursoResumoDTO[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO de criação para TipoVaga
 */
export interface TipoVagaCreateDTO {
  codigo: string;
  nome: string;
  descricao?: string | null;
  schema?: FieldSchema | null;
  itensPadrao?: ItemPadrao[];
  recursosPermitidosIds?: number[];
}

/**
 * DTO de atualização para TipoVaga
 */
export interface TipoVagaUpdateDTO {
  nome?: string | null;
  descricao?: string | null;
  schema?: FieldSchema | null;
  itensPadrao?: ItemPadrao[];
  ativo?: boolean | null;
}

import { FieldSchema } from './field-schema.model';
import { TipoRecursoResumoDTO } from './tipo-recurso.model';

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
  recursosPermitidosIds?: number[];
}

/**
 * DTO de atualização para TipoVaga
 */
export interface TipoVagaUpdateDTO {
  nome?: string | null;
  descricao?: string | null;
  schema?: FieldSchema | null;
  ativo?: boolean | null;
}

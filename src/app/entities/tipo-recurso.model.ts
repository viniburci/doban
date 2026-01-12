import { FieldSchema } from './field-schema.model';

/**
 * DTO de resposta para TipoRecurso
 */
export interface TipoRecursoDTO {
  id: number | null;
  codigo: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  legado: boolean;
  schema?: FieldSchema | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO de criação para TipoRecurso
 */
export interface TipoRecursoCreateDTO {
  codigo: string;
  nome: string;
  descricao?: string | null;
  schema?: FieldSchema | null;
}

/**
 * DTO de atualização para TipoRecurso
 */
export interface TipoRecursoUpdateDTO {
  nome?: string | null;
  descricao?: string | null;
  schema?: FieldSchema | null;
  ativo?: boolean | null;
}

/**
 * DTO resumido de TipoRecurso (usado dentro de TipoVaga)
 */
export interface TipoRecursoResumoDTO {
  id: number;
  codigo: string;
  nome: string;
}

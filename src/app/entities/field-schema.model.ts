/**
 * Tipos de campos suportados para schemas dinâmicos
 */
export type FieldType = 'STRING' | 'INTEGER' | 'DECIMAL' | 'DATE' | 'DATETIME' | 'BOOLEAN' | 'ENUM';

/**
 * Definição de um campo dinâmico dentro de um schema
 */
export interface FieldDefinition {
  nome: string;
  rotulo: string;
  tipo: FieldType;
  obrigatorio?: boolean;
  valorPadrao?: string;
  opcoes?: string[];  // Para tipo ENUM
  tamanhoMaximo?: number;
  regex?: string;
  mensagemErro?: string;
  valorMinimo?: number;
  valorMaximo?: number;
}

/**
 * Schema que define os campos dinâmicos de um tipo de recurso ou vaga
 */
export interface FieldSchema {
  fields: FieldDefinition[];
}

/**
 * DTO de resposta para ItemDinamico
 */
export interface ItemDinamicoDTO {
  id: number | null;
  tipoRecursoId: number;
  tipoRecursoCodigo: string;
  tipoRecursoNome: string;
  identificador: string;
  atributos: Record<string, any>;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO de criação para ItemDinamico
 */
export interface ItemDinamicoCreateDTO {
  tipoRecursoCodigo: string;
  identificador: string;
  atributos: Record<string, any>;
}

/**
 * DTO de atualização para ItemDinamico
 */
export interface ItemDinamicoUpdateDTO {
  identificador?: string | null;
  atributos?: Record<string, any> | null;
  ativo?: boolean | null;
}

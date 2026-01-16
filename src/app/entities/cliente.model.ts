/**
 * DTO de resposta para Cliente
 */
export interface ClienteDTO {
  id: number | null;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO de criação/atualização para Cliente
 */
export interface ClienteCreateDTO {
  nome: string;
  descricao?: string | null;
  ativo?: boolean;
}

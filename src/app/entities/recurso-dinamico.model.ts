import { ItemDinamicoDTO } from './item-dinamico.model';

/**
 * DTO de resposta para RecursoDinamico (empréstimo)
 */
export interface RecursoDinamicoDTO {
  id: number | null;
  pessoaId: number;
  pessoaNome: string;
  item: ItemDinamicoDTO;
  dataEntrega: string | null;
  dataDevolucao: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO de criação para RecursoDinamico (emprestar)
 */
export interface RecursoDinamicoCreateDTO {
  pessoaId: number;
  itemId: number;
  dataEntrega: string;
}

/**
 * DTO de devolução
 */
export interface DevolucaoDinamicaDTO {
  dataDevolucao: string;
}

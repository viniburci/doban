import { ItemDinamicoDTO } from './item-dinamico.model';

export interface ItemExtraDTO {
  descricao: string;
  marca?: string;
  numeroSerie?: string;
  ddd?: string;
  quantidade?: number;
  valor?: number;
}

/**
 * DTO de resposta para RecursoDinamico (emprestimo)
 */
export interface RecursoDinamicoDTO {
  id: number | null;
  pessoaId: number;
  pessoaNome: string;
  item: ItemDinamicoDTO;
  dataEntrega: string | null;
  dataDevolucao: string | null;
  atributosSnapshot?: Record<string, unknown>;
  itensExtras?: ItemExtraDTO[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO de criacao para RecursoDinamico (emprestar)
 */
export interface RecursoDinamicoCreateDTO {
  pessoaId: number;
  itemId: number;
  dataEntrega: string;
  itensExtras?: ItemExtraDTO[];
}

/**
 * DTO de devolucao
 */
export interface DevolucaoDinamicaDTO {
  dataDevolucao: string;
}

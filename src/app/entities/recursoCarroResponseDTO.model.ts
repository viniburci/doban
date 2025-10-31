import { Recurso } from "./recurso.model";

export interface RecursoCarroResponseDTO extends Recurso {
  carroId: string | null;
  nomePessoa: string | null;
  modeloCarro: string | null;
  placa: string | null;
}

import { Recurso } from "./recurso.model";

export interface RecursoCarroResponseDTO extends Recurso {
  carroId: string;
  nomePessoa: string;
  modeloCarro: string;
  placa: string;
}

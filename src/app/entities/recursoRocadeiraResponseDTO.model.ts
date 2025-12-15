import { Recurso } from "./recurso.model";

export interface RecursoRocadeiraResponseDTO extends Recurso {
  rocadeiraId: string | null;
  nomePessoa: string | null;
  marca: string | null;
  numeroSerie: string | null;
}
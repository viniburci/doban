import { Recurso } from "./recurso.model";

export interface RecursoCarroRequestDTO extends Recurso {
  carroId: string | null;
}

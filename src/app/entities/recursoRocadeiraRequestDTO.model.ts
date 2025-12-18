import { Recurso } from "./recurso.model";

export interface RecursoRocadeiraRequestDTO extends Recurso {
    rocadeiraId: string | null;
}
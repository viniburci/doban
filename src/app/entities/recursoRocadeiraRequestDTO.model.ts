import { Recurso } from "./recurso.model";

export interface RecursoRocadeiraRequestDTO extends Recurso {
    RocadeiraId: string | null;
}
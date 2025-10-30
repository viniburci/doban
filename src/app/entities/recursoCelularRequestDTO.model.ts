import { Recurso } from "./recurso.model";

export interface RecursoCelularRequestDTO extends Recurso {
  celularId: number;
}

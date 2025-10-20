import { Celular } from "./celular.model";
import { Recurso } from "./recurso.model";

export interface RecursoCelular extends Recurso {
  celular: Celular;
}

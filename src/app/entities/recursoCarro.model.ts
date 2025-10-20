import { Carro } from "./carro.model";
import { Recurso } from "./recurso.model";

export interface RecursoCarro extends Recurso {
  carro: Carro;
}

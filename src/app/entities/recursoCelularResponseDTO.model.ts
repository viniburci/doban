import { Recurso } from "./recurso.model";

export interface RecursoCelularResponseDTO extends Recurso {
  celularId: string;
  nomePessoa: string;
  modeloCelular: string;
  imei: string;
}

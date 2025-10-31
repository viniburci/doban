import { Recurso } from "./recurso.model";

export interface RecursoCelularResponseDTO extends Recurso {
  celularId: string | null;
  nomePessoa: string | null;
  modeloCelular: string | null;
  imei: string | null;
}

export interface Recurso {
  id: number;
  dataEntrega: string; // Usamos string para representar LocalDate
  dataDevolucao: string; // Usamos string para representar LocalDate
  pessoa: number;
}

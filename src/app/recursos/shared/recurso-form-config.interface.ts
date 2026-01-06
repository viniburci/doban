import { Observable } from 'rxjs';

export interface RecursoFormFieldConfig {
  resourceTypeLabel: string;        // "Celular", "Carro", "Roçadeira"
  resourceIdField: string;           // "celularId", "carroId", "rocadeiraId"
  resourceIdLabel: string;           // "Selecione o Celular", etc.
}

export interface RecursoListItem {
  id?: string | number | null;
  [key: string]: any;
}

export interface RecursoFormConfig<TRequest, TResponse, TListItem extends RecursoListItem> {
  fieldConfig: RecursoFormFieldConfig;

  // Funções injetadas via configuração
  createFn: (request: TRequest) => Observable<TResponse>;
  updateFn: (id: number, dto: { dataDevolucao: string | null }) => Observable<TResponse>;
  listFn: () => Observable<TListItem[]>;

  // Função para exibir item no select
  displayFn: (item: TListItem) => string;
}

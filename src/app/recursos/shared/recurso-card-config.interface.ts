import { Observable } from 'rxjs';

export interface RecursoCardFieldConfig {
  titleField: string;
  subtitleField: string;
  titleFallback: string;
  subtitleFallback: string;
  resourceTypeLabel: string;
  resourceIdField: string;
  detailFields: Array<{
    label: string;
    field: string;
    fallback: string;
  }>;
}

export interface RecursoCardConfig<T> {
  fieldConfig: RecursoCardFieldConfig;
  routeBase: string;
  deleteFn: (id: number) => Observable<void>;
}

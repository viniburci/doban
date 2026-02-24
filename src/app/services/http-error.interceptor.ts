import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

export const SUPPRESS_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.context.get(SUPPRESS_ERROR_NOTIFICATION)) {
        return throwError(() => error);
      }

      if (error.error instanceof Blob && error.error.type === 'application/json') {
        return from(error.error.text()).pipe(
          switchMap(text => {
            try {
              const body = JSON.parse(text);
              notifications.error(resolveMessage(error, body));
            } catch {
              notifications.error(resolveMessage(error));
            }
            return throwError(() => error);
          })
        );
      }

      notifications.error(resolveMessage(error));
      return throwError(() => error);
    })
  );
};

function resolveMessage(error: HttpErrorResponse, body?: Record<string, unknown>): string {
  const errorBody = body ?? (error.error instanceof Blob ? null : error.error);

  if (error.status === 0)   return 'Sem conexao com o servidor.';
  if (error.status === 401) return 'Sessao expirada. Faca login novamente.';
  if (error.status === 403) return 'Voce nao tem permissao para esta acao.';
  if (error.status === 404) return 'Recurso nao encontrado.';
  if (error.status >= 500)  return 'Erro interno do servidor. Tente novamente.';
  return (errorBody?.['message'] as string) ?? 'Ocorreu um erro inesperado.';
}

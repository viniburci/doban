import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface ApiError {
  status: number;
  message: string;
  body: unknown;
  original: HttpErrorResponse;
}

export function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }

  if (typeof error.error === 'string') {
    return error.error;
  }

  switch (error.status) {
    case 0:
      return 'Servidor indisponivel. Verifique sua conexao.';
    case 400:
      return 'Requisicao invalida.';
    case 401:
      return 'Sessao expirada. Faca login novamente.';
    case 403:
      return 'Acesso negado.';
    case 404:
      return 'Recurso nao encontrado.';
    case 500:
      return 'Erro interno do servidor.';
    default:
      return error.message || 'Erro desconhecido.';
  }
}

const AUTH_URLS = ['/api/v1/auth/refresh', '/oauth2/authorization', '/api/v1/auth/logout'];

function isAuthUrl(url: string): boolean {
  return AUTH_URLS.some(authUrl => url.includes(authUrl));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();

  if (token && !isAuthUrl(req.url)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isApiRequest = req.url.includes('cadastro-pessoas-docs.onrender.com');
      const errorMessage = extractErrorMessage(error);

      if (isApiRequest && error.status === 401 && !isAuthUrl(req.url)) {
        return authService.handle401Error(req, next);
      }

      if (isApiRequest) {
        console.error(`[HTTP ${error.status}] ${errorMessage}`, error);
      }

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        body: error.error,
        original: error
      }));
    })
  );
};

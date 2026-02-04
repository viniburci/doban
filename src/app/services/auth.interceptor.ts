import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth_token';

export interface ApiError {
  status: number;
  message: string;
  body: unknown;
  original: HttpErrorResponse;
}

/**
 * Extrai a mensagem de erro do HttpErrorResponse
 * O backend retorna a mensagem em error.error.message
 */
export function extractErrorMessage(error: HttpErrorResponse): string {
  // Tenta extrair a mensagem do body da resposta
  if (error.error?.message) {
    return error.error.message;
  }

  // Se error.error for uma string, usa diretamente
  if (typeof error.error === 'string') {
    return error.error;
  }

  // Fallback para mensagens padrao por status
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

/**
 * Interceptor funcional para adicionar token JWT nas requisicoes
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Obtem o token diretamente do localStorage
  const token = localStorage.getItem(TOKEN_KEY);

  // Se existe token, adiciona ao header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Processa a requisicao e trata erros de autenticacao
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isApiRequest = req.url.includes('localhost:8080');
      const errorMessage = extractErrorMessage(error);

      if (isApiRequest) {
        console.error(`[HTTP ${error.status}] ${errorMessage}`, error);

        // Se erro 401 (Unauthorized), limpa token e redireciona para login
        if (error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          router.navigate(['/login']);
        }
      }

      // Relanca erro com mensagem extraida para facilitar uso nos componentes
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        body: error.error,
        original: error
      }));
    })
  );
};

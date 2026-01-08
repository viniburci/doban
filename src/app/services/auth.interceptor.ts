import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth_token';

/**
 * Interceptor funcional para adicionar token JWT nas requisições
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Obtém o token diretamente do localStorage
  const token = localStorage.getItem(TOKEN_KEY);

  // Se existe token, adiciona ao header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Processa a requisição e trata erros de autenticação
  return next(req).pipe(
    catchError(error => {
      // Só trata erros de autenticação para requisições à nossa API
      const isApiRequest = req.url.includes('localhost:8080');

      if (isApiRequest) {
        // Se erro 401 (Unauthorized), limpa token e redireciona para login
        if (error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          router.navigate(['/login']);
        }

        // Se erro 403 (Forbidden), pode mostrar mensagem de acesso negado
        if (error.status === 403) {
          console.error('Acesso negado: você não tem permissão para acessar este recurso');
        }
      }

      return throwError(() => error);
    })
  );
};

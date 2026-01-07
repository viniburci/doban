import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor funcional para adicionar token JWT nas requisições
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtém o token do serviço de autenticação
  const token = authService.getToken();
  
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
      // Se erro 401 (Unauthorized), faz logout e redireciona para login
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      
      // Se erro 403 (Forbidden), pode mostrar mensagem de acesso negado
      if (error.status === 403) {
        console.error('Acesso negado: você não tem permissão para acessar este recurso');
      }
      
      return throwError(() => error);
    })
  );
};

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Guard funcional para proteger rotas que requerem autenticação
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Salva a URL que o usuário tentou acessar para redirecionar após login
    const returnUrl = state.url;
    router.navigate(['/login'], { queryParams: { returnUrl } });
    console.log('Usuário não autenticado. Redirecionando para a página de login.');
    return false;
  }

  return true;
};

/**
 * Guard funcional para proteger rotas que requerem role ADMIN
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  if (!isAuthenticated) {
    router.navigate(['/login']);
    console.log('Usuário não autenticado. Redirecionando para a página de login.');
    return false;
  }
  
  if (!isAdmin) {
    console.error('Acesso negado: apenas administradores podem acessar esta página');
    router.navigate(['/pessoas']);
    return false;
  }
  
  return true;
};

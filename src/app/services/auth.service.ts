import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  nome: string;
  pictureUrl: string;
  role: 'USER' | 'ADMIN';
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'auth_token';
  
  // Signals para gerenciamento de estado
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  
  // Computed signals públicos
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');

  private http = inject(HttpClient);

  constructor() {
    this.checkStoredToken();
    this.setupStorageListener();
  }

  /**
   * Monitora mudanças no localStorage para sincronizar estado
   */
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.TOKEN_KEY && !event.newValue) {
        // Token foi removido
        this.currentUserSignal.set(null);
        this.isAuthenticatedSignal.set(false);
      }
    });
  }

  /**
   * Verifica se existe token armazenado e valida
   * Implementação profissional: valida o token antes de marcar como autenticado
   */
  private checkStoredToken(): void {
    const token = this.getToken();
    if (!token) {
      return;
    }

    // Verifica se o token parece válido (formato JWT básico)
    if (!this.isValidJwtFormat(token)) {
      this.removeToken();
      return;
    }

    // Verifica se o token está expirado (sem chamar backend)
    if (this.isTokenExpired(token)) {
      this.removeToken();
      return;
    }

    // Token parece válido localmente, marca como autenticado temporariamente
    this.isAuthenticatedSignal.set(true);

    // Carrega dados do usuário do backend
    // Se falhar (401), o interceptor removerá o token e redirecionará
    this.loadCurrentUser().subscribe({
      error: () => {
        // Limpa estado local se houver erro
        this.currentUserSignal.set(null);
        this.isAuthenticatedSignal.set(false);
      }
    });
  }

  /**
   * Verifica se o token tem formato JWT válido
   */
  private isValidJwtFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Verifica se o token JWT está expirado
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) {
        return false; // Token sem expiração
      }
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch {
      return true; // Se não conseguir decodificar, considera expirado
    }
  }

  /**
   * Inicia o fluxo de login OAuth2 com Google
   */
  loginWithGoogle(): void {
    window.location.href = `${this.API_URL}/oauth2/authorization/google`;
  }

  /**
   * Processa o callback do OAuth2
   */
  handleOAuthCallback(token: string): Observable<User> {
    this.saveToken(token);
    return this.loadCurrentUser();
  }

  /**
   * Carrega os dados do usuário atual
   */
  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/api/v1/auth/me`).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      })
    );
  }


  /**
   * Logout do usuário
   */
  logout(): void {
    this.removeToken();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Obtém o token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Salva o token JWT
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Remove o token JWT
   */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se o usuário tem role ADMIN
   */
  hasAdminRole(): boolean {
    return this.isAdmin();
  }
}

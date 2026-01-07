import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkStoredToken();
  }

  /**
   * Verifica se existe token armazenado e valida
   */
  private checkStoredToken(): void {
    const token = this.getToken();
    if (token) {
      this.validateToken().subscribe();
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
      }),
      catchError(error => {
        console.error('Erro ao carregar usuário:', error);
        this.logout();
        return of(null as any);
      })
    );
  }

  /**
   * Valida o token JWT atual
   */
  validateToken(): Observable<{valid: boolean, email: string}> {
    return this.http.get<{valid: boolean, email: string}>(`${this.API_URL}/api/v1/auth/validate`).pipe(
      tap(response => {
        if (response.valid) {
          this.loadCurrentUser().subscribe();
        } else {
          this.logout();
        }
      }),
      catchError(() => {
        this.logout();
        return of({valid: false, email: ''});
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
    this.router.navigate(['/login']);
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

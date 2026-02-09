import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, tap, switchMap, catchError, filter, take } from 'rxjs';

export interface User {
  id: number;
  email: string;
  nome: string;
  pictureUrl: string;
  role: 'USER' | 'ADMIN';
  ativo: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');

  private http = inject(HttpClient);
  private router = inject(Router);

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.checkStoredToken();
    this.setupStorageListener();
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.TOKEN_KEY || event.key === this.REFRESH_TOKEN_KEY) {
        if (!localStorage.getItem(this.TOKEN_KEY) && !localStorage.getItem(this.REFRESH_TOKEN_KEY)) {
          this.currentUserSignal.set(null);
          this.isAuthenticatedSignal.set(false);
        }
      }
    });
  }

  private checkStoredToken(): void {
    const token = this.getToken();

    if (token && this.isValidJwtFormat(token) && !this.isTokenExpired(token)) {
      this.isAuthenticatedSignal.set(true);
      this.loadCurrentUser().subscribe({
        error: () => {
          this.currentUserSignal.set(null);
          this.isAuthenticatedSignal.set(false);
        }
      });
      return;
    }

    // Access token ausente ou expirado - tentar refresh se refresh token existe
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.isAuthenticatedSignal.set(true);
      this.refreshAccessToken().pipe(
        switchMap(() => this.loadCurrentUser())
      ).subscribe({
        error: () => {
          this.removeTokens();
          this.currentUserSignal.set(null);
          this.isAuthenticatedSignal.set(false);
        }
      });
      return;
    }

    // Nenhum token disponivel
    if (token) {
      this.removeTokens();
    }
  }

  private isValidJwtFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) {
        return false;
      }
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch {
      return true;
    }
  }

  loginWithGoogle(): void {
    const url = `${this.API_URL}/oauth2/authorization/google`;
    window.location.href = url;
  }

  handleOAuthCallback(token: string, refreshToken: string): Observable<User> {
    this.saveTokens(token, refreshToken);
    return this.loadCurrentUser();
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/api/v1/auth/me`).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      })
    );
  }

  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token ausente'));
    }

    return this.http.post<RefreshTokenResponse>(
      `${this.API_URL}/api/v1/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        this.saveTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  /**
   * Coordena o tratamento de 401 entre multiplas requisicoes simultaneas.
   * Chamado pelo interceptor quando recebe 401.
   */
  handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshAccessToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);
          return next(req.clone({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          }));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.handleRefreshFailure();
          return throwError(() => err);
        })
      );
    }

    // Refresh ja em andamento - enfileirar requisicao
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      })
    );
  }

  private handleRefreshFailure(): void {
    this.removeTokens();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.API_URL}/api/v1/auth/logout`, null).subscribe();
    }
    this.removeTokens();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private saveTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this.isAuthenticatedSignal.set(true);
  }

  private removeTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  hasAdminRole(): boolean {
    return this.isAdmin();
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError, tap, switchMap, catchError, filter, take } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private readonly API_URL = environment.apiUrl;
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

  initialize(): Observable<void> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!token && !refreshToken) {
      return of(undefined);
    }

    // Trust tokens immediately so APP_INITIALIZER never blocks the router.
    this.isAuthenticatedSignal.set(true);

    // Defer loading user data until after the first NavigationEnd.
    // This ensures handleRefreshFailure() cannot call router.navigate() while
    // the initial navigation chain is still in progress, which would cancel it
    // and leave the router-outlet empty (blank page).
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      take(1),
      switchMap(() => this.loadCurrentUser().pipe(catchError(() => of(null))))
    ).subscribe();

    return of(undefined);
  }

  private isNetworkError(err: unknown): boolean {
    return err instanceof HttpErrorResponse && err.status === 0;
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
          // Error the current subject so queued requests fail immediately
          // instead of waiting forever for a non-null token that never arrives.
          const pending = this.refreshTokenSubject;
          this.refreshTokenSubject = new BehaviorSubject<string | null>(null);
          pending.error(err);
          if (!this.isNetworkError(err)) {
            this.handleRefreshFailure();
          }
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

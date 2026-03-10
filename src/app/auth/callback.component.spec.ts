import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { of, throwError } from 'rxjs';
import { CallbackComponent } from './callback.component';
import { AuthService } from '../services/auth.service';
import { User } from '../services/auth.service';

const mockUser: User = {
  id: 1,
  email: 'user@test.com',
  nome: 'User Test',
  pictureUrl: '',
  role: 'USER',
  ativo: true
};

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let queryParamsSubject: Subject<Record<string, string>>;

  beforeEach(async () => {
    queryParamsSubject = new Subject();
    const authSpy = jasmine.createSpyObj('AuthService', ['handleOAuthCallback']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CallbackComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
            snapshot: { queryParams: {} }
          }
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with loading=true and error=false initially', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeTrue();
    expect(component.error).toBeFalse();
  });

  it('should show error state when error param is present with message', () => {
    queryParamsSubject.next({ error: 'access_denied', message: 'Email nao autorizado' });

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Email nao autorizado');
  });

  it('should show default error message when error param has no message', () => {
    queryParamsSubject.next({ error: 'access_denied' });

    expect(component.error).toBeTrue();
    expect(component.errorMessage).toBe('Email não autorizado. Entre em contato com o administrador.');
  });

  it('should show error when both token and refreshToken are absent', () => {
    queryParamsSubject.next({});

    expect(component.error).toBeTrue();
    expect(component.errorMessage).toBe('Resposta inválida do servidor de autenticação.');
  });

  it('should call handleOAuthCallback with token and refreshToken on success', () => {
    authService.handleOAuthCallback.and.returnValue(of(mockUser));

    queryParamsSubject.next({ token: 'access-token', refreshToken: 'refresh-token' });

    expect(authService.handleOAuthCallback).toHaveBeenCalledWith('access-token', 'refresh-token');
  });

  it('should navigate to /pessoas after successful callback', () => {
    authService.handleOAuthCallback.and.returnValue(of(mockUser));

    queryParamsSubject.next({ token: 'access-token', refreshToken: 'refresh-token' });

    expect(router.navigate).toHaveBeenCalledWith(['/pessoas']);
  });

  it('should show error when handleOAuthCallback fails', () => {
    authService.handleOAuthCallback.and.returnValue(throwError(() => new Error('Network error')));

    queryParamsSubject.next({ token: 'access-token', refreshToken: 'refresh-token' });

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Erro ao carregar dados do usuário. Tente novamente.');
  });
});

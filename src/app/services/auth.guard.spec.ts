import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard, adminGuard, loginGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('Auth Guards', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    routerSpy.createUrlTree.and.callFake((commands: unknown[], extras?: unknown) => ({ commands, extras }));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/pessoas/lista' } as RouterStateSnapshot;
  });

  describe('authGuard', () => {
    it('should return true when authenticated', () => {
      authService.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBeTrue();
    });

    it('should redirect to login with returnUrl when not authenticated', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(router.createUrlTree).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { returnUrl: '/pessoas/lista' } }
      );
    });
  });

  describe('adminGuard', () => {
    it('should return true when authenticated and admin', () => {
      authService.isAuthenticated.and.returnValue(true);
      authService.isAdmin.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(result).toBeTrue();
    });

    it('should redirect to login when not authenticated', () => {
      authService.isAuthenticated.and.returnValue(false);

      TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to pessoas when authenticated but not admin', () => {
      authService.isAuthenticated.and.returnValue(true);
      authService.isAdmin.and.returnValue(false);

      TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/pessoas']);
    });
  });

  describe('loginGuard', () => {
    it('should return true when not authenticated', () => {
      authService.isAuthenticated.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => loginGuard(mockRoute, mockState));

      expect(result).toBeTrue();
    });

    it('should redirect to pessoas when already authenticated', () => {
      authService.isAuthenticated.and.returnValue(true);

      TestBed.runInInjectionContext(() => loginGuard(mockRoute, mockState));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/pessoas']);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['loginWithGoogle']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: spy }]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.loginWithGoogle() when loginWithGoogle() is called', () => {
    component.loginWithGoogle();

    expect(authService.loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should render a Google login button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-google');

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Entrar com Google');
  });

  it('should call loginWithGoogle() when button is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-google');
    button.click();

    expect(authService.loginWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should render the application title DOBAN', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('.login-title');

    expect(title.textContent).toContain('DOBAN');
  });
});

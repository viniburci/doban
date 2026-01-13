import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="text-center mb-4">
          <h1 class="login-title">DOBAN</h1>
          <p class="login-subtitle">Cadastro de Pessoas e Documentos</p>
        </div>
        
        <div class="card">
          <div class="card-body p-5">
            <h2 class="card-title text-center mb-4">Bem-vindo!</h2>
            <p class="text-center text-muted mb-4">
              Faça login para acessar o sistema
            </p>
            
            <div class="d-grid">
              <button
                class="btn btn-google btn-lg"
                (click)="loginWithGoogle()">
                <svg class="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </button>
            </div>
            
            <div class="mt-4 text-center">
              <small class="text-muted">
                Apenas usuários autorizados podem acessar o sistema
              </small>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-3">
          <small class="text-muted">
            © 2026 DOBAN Serviços. Todos os direitos reservados.
          </small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      padding: 20px;
      position: relative;
    }

    .login-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.08) 0%, transparent 50%);
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      position: relative;
      z-index: 1;
    }

    .login-title {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: -0.5px;
    }

    .login-subtitle {
      color: #6c757d;
      font-size: 1.05rem;
      margin-bottom: 2rem;
      font-weight: 400;
    }

    .card {
      border: none;
      border-radius: 1.25rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      background: white;
    }

    .btn-google {
      background: linear-gradient(to bottom, #ffffff, #f8f9fa);
      color: #3c4043;
      border: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-weight: 500;
      font-size: 1rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }

    .btn-google:hover {
      background: linear-gradient(to bottom, #f8f9fa, #f1f3f4);
      color: #3c4043;
      border-color: #d2d2d2;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      transform: translateY(-2px);
    }

    .google-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .card-body {
      background: white;
      border-radius: 1.25rem;
    }

    .text-muted {
      color: #6c757d !important;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);

  loginWithGoogle(): void {
    console.log('LoginComponent: botão clicado, chamando authService.loginWithGoogle()');
    this.authService.loginWithGoogle();
    console.log('LoginComponent: authService.loginWithGoogle() executado');
  }
}

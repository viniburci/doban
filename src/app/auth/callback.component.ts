import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="callback-container">
      <div class="callback-card">
        @if (loading) {
          <div class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <h4>Processando autenticação...</h4>
            <p class="text-muted">Aguarde um momento</p>
          </div>
        }

        @if (error) {
          <div class="alert alert-danger">
            <h4 class="alert-heading">
              <i class="bi bi-exclamation-triangle-fill"></i>
              Erro ao fazer login
            </h4>
            <p>{{ errorMessage }}</p>
            <hr>
            <p class="mb-0">
              <a href="/login" class="alert-link">Voltar para o login</a>
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      padding: 20px;
      position: relative;
    }

    .callback-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.08) 0%, transparent 50%);
    }

    .callback-card {
      background: white;
      padding: 3rem;
      border-radius: 1.25rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      max-width: 500px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
      border-width: 0.3rem;
    }

    .text-primary {
      color: #667eea !important;
    }

    .text-muted {
      color: #6c757d !important;
    }

    .alert-danger {
      background-color: #fff5f5;
      border-color: #feb2b2;
      color: #c53030;
      border-radius: 0.75rem;
    }

    .alert-link {
      color: #9b2c2c;
      font-weight: 600;
    }

    .alert-link:hover {
      color: #742a2a;
      text-decoration: underline;
    }
  `]
})
export class CallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  loading = true;
  error = false;
  errorMessage = '';
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];
      const message = params['message'];
      
      if (error) {
        this.handleError(message || 'Email não autorizado. Entre em contato com o administrador.');
        return;
      }
      
      if (token) {
        this.handleSuccess(token);
        return;
      }
      
      this.handleError('Resposta inválida do servidor de autenticação.');
    });
  }
  
  private handleSuccess(token: string): void {
    this.authService.handleOAuthCallback(token).subscribe({
      next: (user) => {
        console.log('Login bem-sucedido:', user.email);
        
        // Verifica se existe returnUrl para redirecionar
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pessoas';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        console.error('Erro ao processar callback:', err);
        this.handleError('Erro ao carregar dados do usuário. Tente novamente.');
      }
    });
  }
  
  private handleError(message: string): void {
    this.loading = false;
    this.error = true;
    this.errorMessage = message;
  }
}

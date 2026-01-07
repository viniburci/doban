import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('doban');
  protected authService = inject(AuthService);
  protected currentUser = this.authService.currentUser;
  protected isAuthenticated = this.authService.isAuthenticated;

  logout(): void {
    this.authService.logout();
  }
}
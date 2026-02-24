import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toast.css',
  template: `
    <div class="toast-container">
      @for (notification of notifications(); track notification.id) {
        <div class="toast-item" [class]="'toast-' + notification.type">
          <span class="toast-message">{{ notification.message }}</span>
          <button type="button" class="toast-close" (click)="dismiss(notification.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class Toast {
  private notificationService = inject(NotificationService);
  protected notifications = this.notificationService.notifications;

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}

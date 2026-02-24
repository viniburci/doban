import { Injectable, signal } from '@angular/core';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<Notification[]>([]);

  show(message: string, type: NotificationType = 'info', duration = 4000): void {
    const id = crypto.randomUUID();
    this.notifications.update(n => [...n, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error', 6000); }
  warning(message: string): void { this.show(message, 'warning'); }

  dismiss(id: string): void {
    this.notifications.update(n => n.filter(notif => notif.id !== id));
  }
}

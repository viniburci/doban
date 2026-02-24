import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemplateDocumentoService } from '../../services/template-documento.service';
import { TemplateDocumento } from '../../entities/template-documento.model';
import { ConfirmDeleteDirective } from '../../directives/confirm-delete';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-gestao-templates',
  imports: [RouterLink, ConfirmDeleteDirective],
  templateUrl: './gestao-templates.html',
  styleUrl: './gestao-templates.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestaoTemplates implements OnInit {
  private templateService = inject(TemplateDocumentoService);
  private notifications = inject(NotificationService);

  templates = signal<TemplateDocumento[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.carregarTemplates();
  }

  carregarTemplates() {
    this.loading.set(true);
    this.templateService.listarTodos().subscribe({
      next: (data) => {
        this.templates.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar templates:', err);
        this.loading.set(false);
      }
    });
  }

  desativarTemplate(template: TemplateDocumento, confirmed: boolean) {
    if (!confirmed) return;

    this.templateService.desativar(template.id).subscribe({
      next: () => {
        this.notifications.success('Template desativado com sucesso.');
        this.carregarTemplates();
      }
    });
  }
}

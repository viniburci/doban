import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemplateDocumentoService } from '../../services/template-documento.service';
import { TemplateDocumento } from '../../entities/template-documento.model';

@Component({
  selector: 'app-detalhes-template',
  imports: [RouterLink],
  templateUrl: './detalhes-template.html',
  styleUrl: './detalhes-template.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesTemplate implements OnInit {
  private templateService = inject(TemplateDocumentoService);

  templateId = input<string | null>(null);

  template = signal<TemplateDocumento | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.templateId();
    if (id && !isNaN(Number(id))) {
      this.carregarTemplate(Number(id));
    }
  }

  carregarTemplate(id: number) {
    this.loading.set(true);
    this.templateService.buscarPorId(id).subscribe({
      next: (data) => {
        this.template.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar template:', err);
        this.loading.set(false);
      }
    });
  }
}

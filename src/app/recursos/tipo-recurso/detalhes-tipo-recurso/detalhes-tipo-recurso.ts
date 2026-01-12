import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';

@Component({
  selector: 'app-detalhes-tipo-recurso',
  imports: [RouterLink],
  templateUrl: './detalhes-tipo-recurso.html',
  styleUrl: './detalhes-tipo-recurso.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesTipoRecurso implements OnInit {
  tipoRecursoId = input<string | null>(null);
  tipoRecurso = signal<TipoRecursoDTO | null>(null);
  loading = signal(true);

  constructor(private tipoRecursoService: TipoRecursoService) {}

  ngOnInit() {
    if (this.tipoRecursoId()) {
      this.carregarTipoRecurso();
    }
  }

  carregarTipoRecurso() {
    this.loading.set(true);
    this.tipoRecursoService.buscarPorId(Number(this.tipoRecursoId())).subscribe({
      next: (response) => {
        this.tipoRecurso.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tipo de recurso', error);
        this.loading.set(false);
      }
    });
  }

  getFieldTypeLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'STRING': 'Texto',
      'INTEGER': 'Inteiro',
      'DECIMAL': 'Decimal',
      'DATE': 'Data',
      'DATETIME': 'Data/Hora',
      'BOOLEAN': 'Sim/Não',
      'ENUM': 'Lista de opções'
    };
    return labels[tipo] || tipo;
  }
}

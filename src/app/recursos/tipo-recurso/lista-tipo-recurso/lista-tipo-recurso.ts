import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';

@Component({
  selector: 'app-lista-tipo-recurso',
  imports: [RouterLink],
  templateUrl: './lista-tipo-recurso.html',
  styleUrl: './lista-tipo-recurso.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaTipoRecurso implements OnInit {
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  loading = signal(true);

  constructor(private tipoRecursoService: TipoRecursoService) {}

  ngOnInit() {
    this.carregarTipos();
  }

  carregarTipos() {
    this.loading.set(true);
    this.tipoRecursoService.listarTodos().subscribe({
      next: (response) => {
        this.tiposRecurso.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de recurso', error);
        this.loading.set(false);
      }
    });
  }
}

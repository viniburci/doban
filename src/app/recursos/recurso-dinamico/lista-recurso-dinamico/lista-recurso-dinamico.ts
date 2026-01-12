import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecursoDinamicoService } from '../../../services/recurso-dinamico.service';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { RecursoDinamicoDTO } from '../../../entities/recurso-dinamico.model';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';

@Component({
  selector: 'app-lista-recurso-dinamico',
  imports: [RouterLink, FormsModule],
  templateUrl: './lista-recurso-dinamico.html',
  styleUrl: './lista-recurso-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaRecursoDinamico implements OnInit {
  recursos = signal<RecursoDinamicoDTO[]>([]);
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  loading = signal(true);
  filtroTipo = signal<string>('');
  filtroStatus = signal<string>('');

  constructor(
    private recursoDinamicoService: RecursoDinamicoService,
    private tipoRecursoService: TipoRecursoService
  ) {}

  ngOnInit() {
    this.carregarTiposRecurso();
    this.carregarRecursos();
  }

  carregarTiposRecurso() {
    this.tipoRecursoService.listarTodos().subscribe({
      next: (response) => {
        this.tiposRecurso.set(response.filter(t => t.ativo));
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de recurso', error);
      }
    });
  }

  carregarRecursos() {
    this.loading.set(true);
    const filtro = this.filtroTipo();

    if (filtro) {
      this.recursoDinamicoService.listarPorTipoRecurso(filtro).subscribe({
        next: (response) => {
          this.recursos.set(this.aplicarFiltroStatus(response));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar recursos', error);
          this.loading.set(false);
        }
      });
    } else {
      this.recursoDinamicoService.listarTodos().subscribe({
        next: (response) => {
          this.recursos.set(this.aplicarFiltroStatus(response));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar recursos', error);
          this.loading.set(false);
        }
      });
    }
  }

  aplicarFiltroStatus(recursos: RecursoDinamicoDTO[]): RecursoDinamicoDTO[] {
    const status = this.filtroStatus();
    if (!status) return recursos;

    if (status === 'emprestado') {
      return recursos.filter(r => !r.dataDevolucao);
    } else if (status === 'devolvido') {
      return recursos.filter(r => r.dataDevolucao);
    }
    return recursos;
  }

  onFiltroTipoChange(valor: string) {
    this.filtroTipo.set(valor);
    this.carregarRecursos();
  }

  onFiltroStatusChange(valor: string) {
    this.filtroStatus.set(valor);
    this.carregarRecursos();
  }

  isEmprestado(recurso: RecursoDinamicoDTO): boolean {
    return !recurso.dataDevolucao;
  }

  formatarData(data: string | null): string {
    if (!data) return '-';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  registrarDevolucao(recurso: RecursoDinamicoDTO) {
    if (!recurso.id) return;

    const dataHoje = new Date().toISOString().split('T')[0];
    this.recursoDinamicoService.registrarDevolucao(recurso.id, { dataDevolucao: dataHoje }).subscribe({
      next: () => {
        this.carregarRecursos();
      },
      error: (error) => {
        console.error('Erro ao registrar devolução', error);
      }
    });
  }
}

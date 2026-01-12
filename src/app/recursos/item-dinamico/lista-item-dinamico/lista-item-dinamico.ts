import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemDinamicoService } from '../../../services/item-dinamico.service';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { ItemDinamicoDTO } from '../../../entities/item-dinamico.model';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-item-dinamico',
  imports: [RouterLink, FormsModule],
  templateUrl: './lista-item-dinamico.html',
  styleUrl: './lista-item-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaItemDinamico implements OnInit {
  itens = signal<ItemDinamicoDTO[]>([]);
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  loading = signal(true);
  filtroTipo = signal<string>('');

  constructor(
    private itemDinamicoService: ItemDinamicoService,
    private tipoRecursoService: TipoRecursoService
  ) {}

  ngOnInit() {
    this.carregarTiposRecurso();
    this.carregarItens();
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

  carregarItens() {
    this.loading.set(true);
    const filtro = this.filtroTipo();

    if (filtro) {
      this.itemDinamicoService.listarPorTipo(filtro).subscribe({
        next: (response) => {
          this.itens.set(response);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar itens', error);
          this.loading.set(false);
        }
      });
    } else {
      this.itemDinamicoService.listarTodos().subscribe({
        next: (response) => {
          this.itens.set(response);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar itens', error);
          this.loading.set(false);
        }
      });
    }
  }

  onFiltroChange(valor: string) {
    this.filtroTipo.set(valor);
    this.carregarItens();
  }

  getAtributosResumo(atributos: Record<string, any>): string {
    const entries = Object.entries(atributos);
    if (entries.length === 0) return '';
    return entries.slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' | ');
  }
}

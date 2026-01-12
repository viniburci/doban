import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemDinamicoService } from '../../../services/item-dinamico.service';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { ItemDinamicoDTO } from '../../../entities/item-dinamico.model';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';

@Component({
  selector: 'app-detalhes-item-dinamico',
  imports: [RouterLink],
  templateUrl: './detalhes-item-dinamico.html',
  styleUrl: './detalhes-item-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesItemDinamico implements OnInit {
  itemId = input<string | null>(null);
  item = signal<ItemDinamicoDTO | null>(null);
  tipoRecurso = signal<TipoRecursoDTO | null>(null);
  loading = signal(true);

  constructor(
    private itemDinamicoService: ItemDinamicoService,
    private tipoRecursoService: TipoRecursoService
  ) {}

  ngOnInit() {
    if (this.itemId()) {
      this.carregarItem();
    }
  }

  carregarItem() {
    this.loading.set(true);
    this.itemDinamicoService.buscarPorId(Number(this.itemId())).subscribe({
      next: (response) => {
        this.item.set(response);
        this.carregarTipoRecurso(response.tipoRecursoCodigo);
      },
      error: (error) => {
        console.error('Erro ao carregar item', error);
        this.loading.set(false);
      }
    });
  }

  carregarTipoRecurso(codigo: string) {
    this.tipoRecursoService.buscarPorCodigo(codigo).subscribe({
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

  getRotuloCampo(nome: string): string {
    const campo = this.tipoRecurso()?.schema?.fields?.find(f => f.nome === nome);
    return campo?.rotulo || nome;
  }

  formatarValor(valor: any): string {
    if (valor === null || valor === undefined) return '-';
    if (typeof valor === 'boolean') return valor ? 'Sim' : 'Não';
    return String(valor);
  }

  getAtributos(): { nome: string; rotulo: string; valor: any }[] {
    const item = this.item();
    if (!item?.atributos) return [];

    return Object.entries(item.atributos).map(([nome, valor]) => ({
      nome,
      rotulo: this.getRotuloCampo(nome),
      valor
    }));
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';
import { ConfirmDeleteDirective } from '../../directives/confirm-delete';

@Component({
  selector: 'app-gestao-tipos-vaga',
  imports: [RouterLink, ConfirmDeleteDirective],
  templateUrl: './gestao-tipos-vaga.html',
  styleUrl: './gestao-tipos-vaga.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestaoTiposVaga implements OnInit {
  private tipoVagaService = inject(TipoVagaService);

  tiposVaga = signal<TipoVagaDTO[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.carregarTiposVaga();
  }

  carregarTiposVaga() {
    this.loading.set(true);
    this.tipoVagaService.listarTodos().subscribe({
      next: (data) => {
        this.tiposVaga.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de vaga:', err);
        this.loading.set(false);
      }
    });
  }

  desativarTipoVaga(tipo: TipoVagaDTO, confirmed: boolean) {
    if (!confirmed || !tipo.id) return;

    this.tipoVagaService.desativar(tipo.id).subscribe({
      next: () => this.carregarTiposVaga(),
      error: (err) => console.error('Erro ao desativar tipo de vaga:', err)
    });
  }
}

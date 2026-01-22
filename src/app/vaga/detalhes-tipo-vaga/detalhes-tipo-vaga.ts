import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';

@Component({
  selector: 'app-detalhes-tipo-vaga',
  imports: [RouterLink],
  templateUrl: './detalhes-tipo-vaga.html',
  styleUrl: './detalhes-tipo-vaga.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesTipoVaga implements OnInit {
  private tipoVagaService = inject(TipoVagaService);

  tipoVagaId = input<string | null>(null);

  tipoVaga = signal<TipoVagaDTO | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.tipoVagaId();
    if (id && !isNaN(Number(id))) {
      this.carregarTipoVaga(Number(id));
    }
  }

  carregarTipoVaga(id: number) {
    this.loading.set(true);
    this.tipoVagaService.buscarPorId(id).subscribe({
      next: (data) => {
        this.tipoVaga.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tipo de vaga:', err);
        this.loading.set(false);
      }
    });
  }
}

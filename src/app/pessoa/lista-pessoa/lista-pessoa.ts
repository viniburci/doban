import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { Router } from '@angular/router';

const ITENS_POR_PAGINA = 10;

@Component({
  selector: 'app-lista-pessoa',
  imports: [],
  templateUrl: './lista-pessoa.html',
  styleUrl: './lista-pessoa.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaPessoa {
  private pessoaService = inject(PessoaService);
  private router = inject(Router);

  pessoasAtivas = signal<PessoaFormData[]>([]);
  pessoasInativas = signal<PessoaFormData[]>([]);
  carregando = signal(true);

  paginaAtivas = signal(0);
  paginaInativas = signal(0);

  readonly itensPorPagina = ITENS_POR_PAGINA;

  pessoasAtivasPaginadas = computed(() =>
    this.pessoasAtivas().slice(
      this.paginaAtivas() * ITENS_POR_PAGINA,
      (this.paginaAtivas() + 1) * ITENS_POR_PAGINA
    )
  );

  pessoasInativasPaginadas = computed(() =>
    this.pessoasInativas().slice(
      this.paginaInativas() * ITENS_POR_PAGINA,
      (this.paginaInativas() + 1) * ITENS_POR_PAGINA
    )
  );

  totalPaginasAtivas = computed(() =>
    Math.ceil(this.pessoasAtivas().length / ITENS_POR_PAGINA)
  );

  totalPaginasInativas = computed(() =>
    Math.ceil(this.pessoasInativas().length / ITENS_POR_PAGINA)
  );

  constructor() {
    this.carregarPessoas();
  }

  carregarPessoas(): void {
    this.carregando.set(true);
    let pendentes = 2;

    const verificarConclusao = () => {
      if (--pendentes === 0) this.carregando.set(false);
    };

    this.pessoaService.buscarPessoasAtivas().subscribe(data => {
      this.pessoasAtivas.set(data || []);
      this.paginaAtivas.set(0);
      verificarConclusao();
    });

    this.pessoaService.buscarPessoasInativas().subscribe(data => {
      this.pessoasInativas.set(data || []);
      this.paginaInativas.set(0);
      verificarConclusao();
    });
  }

  navegarPaginaAtivas(pagina: number): void {
    this.paginaAtivas.set(pagina);
  }

  navegarPaginaInativas(pagina: number): void {
    this.paginaInativas.set(pagina);
  }

  navegarParaDetalhes(pessoaId: string | null): void {
    if (pessoaId) {
      this.router.navigate(['/pessoas', pessoaId, 'detalhes']);
    }
  }

  navegarParaRegistro(): void {
    this.router.navigate(['/pessoas/novo']);
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}

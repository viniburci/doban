import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { Router, RouterLink } from '@angular/router';

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

  constructor() {
    this.carregarPessoas();
  }

  carregarPessoas(): void {
    this.pessoaService.buscarPessoasAtivas().subscribe(data => {
      this.pessoasAtivas.set(data || []);
    });

    this.pessoaService.buscarPessoasInativas().subscribe(data => {
      this.pessoasInativas.set(data || []);
    });
  }

  navegarParaDetalhes(pessoaId: string | null): void {
    if (pessoaId) {
      this.router.navigate(['/pessoas', pessoaId, 'detalhes']);
    }
  }

  navegarParaRegistro(): void {
    this.router.navigate(['/pessoas/novo']);
  }
}

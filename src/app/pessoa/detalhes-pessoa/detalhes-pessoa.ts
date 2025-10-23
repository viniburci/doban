import { ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CadastroVaga } from "../../vaga/cadastro-vaga/cadastro-vaga";
import { ScrollOnRenderDirective } from '../../directives/scroll-on-render-directive';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [CommonModule, RouterLink, CadastroVaga, ScrollOnRenderDirective],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css'
})
export class DetalhesPessoa implements OnInit {

  private pessoaService = inject(PessoaService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  pessoaId = input<string | null>(null);

  errorMessage: string | null = null;

  pessoa: PessoaFormData | null = null;

  showRegistrarVaga = signal<boolean>(false);

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.pessoaService.buscarPessoa(Number(id)).subscribe(data => {
        console.log(data);
        this.pessoa = data;
        this.convertDatesToBr();
      });
    } else {
      this.errorMessage = 'Id inválido.'
    }
  }

  convertDatesToBr() {
    if (!this.pessoa) return;

    const d = this.dataService;

    this.pessoa.dataNascimento = d.convertISOToDateBR(this.pessoa.dataNascimento);
    this.pessoa.dataEmissaoCtps = d.convertISOToDateBR(this.pessoa.dataEmissaoCtps);
    this.pessoa.dataEmissaoRg = d.convertISOToDateBR(this.pessoa.dataEmissaoRg);
    this.pessoa.dataEmissaoPis = d.convertISOToDateBR(this.pessoa.dataEmissaoPis);
    this.pessoa.validadeCnh = d.convertISOToDateBR(this.pessoa.validadeCnh);
  }

  toggleRegistrarVaga() {
    this.showRegistrarVaga.set(!this.showRegistrarVaga());
    this.cdr.detectChanges();
  }

}

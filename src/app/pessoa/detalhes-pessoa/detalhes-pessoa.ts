import { Component, inject, input, OnInit } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css'
})
export class DetalhesPessoa implements OnInit{

  private pessoaService = inject(PessoaService);
  private dataService = inject(DataService);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;

  pessoa: PessoaFormData | null = null;
  
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

    this.pessoa.dataNascimento = this.dataService.convertISOToDateBR(this.pessoa.dataNascimento);
    this.pessoa.dataEmissaoCtps = this.dataService.convertISOToDateBR(this.pessoa.dataEmissaoCtps);
    this.pessoa.dataEmissaoRg = this.dataService.convertISOToDateBR(this.pessoa.dataEmissaoRg);
    this.pessoa.dataEmissaoPis = this.dataService.convertISOToDateBR(this.pessoa.dataEmissaoPis);
    this.pessoa.validadeCnh = this.dataService.convertISOToDateBR(this.pessoa.validadeCnh);
  }

}

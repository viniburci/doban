import { Component, inject, input, OnInit } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [CommonModule],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css'
})
export class DetalhesPessoa implements OnInit{

  private pessoaService = inject(PessoaService);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;

  pessoa: PessoaFormData | null = null;
  
  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.pessoaService.buscarPessoa(Number(id)).subscribe(data => {
        console.log(data);
        this.pessoa = data;
      });
    } else {
      this.errorMessage = 'Id inválido.'
    }
  }

}

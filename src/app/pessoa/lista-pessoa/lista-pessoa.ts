import { Component, inject, OnInit } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';

@Component({
  selector: 'app-lista-pessoa',
  imports: [],
  templateUrl: './lista-pessoa.html',
  styleUrl: './lista-pessoa.css'
})
export class ListaPessoa implements OnInit{

  private pessoaService = inject(PessoaService);

  listaPessoas: PessoaFormData[] = [];

  ngOnInit(): void {
    this.pessoaService.buscarTodasPessoas().subscribe(data => {
      this.listaPessoas = data;
      console.log(this.listaPessoas);
    });
  }

}

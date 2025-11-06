import { Component, inject, OnInit } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-pessoa',
  imports: [RouterLink],
  templateUrl: './lista-pessoa.html',
  styleUrl: './lista-pessoa.css'
})
export class ListaPessoa implements OnInit{

  private pessoaService = inject(PessoaService);
  private router = inject(Router);

  listaPessoas: PessoaFormData[] = [];

  ngOnInit(): void {
    this.pessoaService.buscarTodasPessoas().subscribe(data => {
      this.listaPessoas = data;
    });
  }

}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cadastro-vaga',
  imports: [],
  templateUrl: './cadastro-vaga.html',
  styleUrl: './cadastro-vaga.css'
})
export class CadastroVaga {

  pessoaId = input<string | null>(null);

}

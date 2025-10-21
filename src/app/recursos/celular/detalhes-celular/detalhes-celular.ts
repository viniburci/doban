import { Component, input, OnInit } from '@angular/core';
import { CelularFormData } from '../../../entities/celularFormData.model';
import { CelularService } from '../../../services/celular-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhes-celular',
  imports: [RouterLink],
  templateUrl: './detalhes-celular.html',
  styleUrl: './detalhes-celular.css'
})
export class DetalhesCelular implements OnInit {

  constructor(private celularService: CelularService) { }

  celularId = input<string | null>(null);
  celular: CelularFormData | null = null;

  ngOnInit() {
    if (this.celularId() != null) {
      this.celularService.buscarPorId(Number(this.celularId())).subscribe(response => {
        this.celular = response;
        console.log(response);
      });
    }
  }

}

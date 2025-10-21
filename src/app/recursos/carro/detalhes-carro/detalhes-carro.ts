import { Component, input, OnInit } from '@angular/core';
import { CarroService } from '../../../services/carro-service';
import { CarroFormData } from '../../../entities/carroFormData.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhes-carro',
  imports: [RouterLink],
  templateUrl: './detalhes-carro.html',
  styleUrl: './detalhes-carro.css'
})
export class DetalhesCarro implements OnInit {

  constructor(private carroService: CarroService) { }

  carroId = input<string | null>(null);
  carro: CarroFormData | null = null;

  ngOnInit() {
    if (this.carroId() != null) {
      this.carroService.buscarPorId(Number(this.carroId())).subscribe(response => {
        this.carro = response;
        console.log(response);
      });
    }
  }

}

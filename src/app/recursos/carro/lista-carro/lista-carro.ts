import { Component, OnInit } from '@angular/core';
import { CarroService } from '../../../services/carro-service';
import { CarroFormData } from '../../../entities/carroFormData.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-carro',
  imports: [RouterLink],
  templateUrl: './lista-carro.html',
  styleUrl: './lista-carro.css'
})
export class ListaCarro implements OnInit{

  constructor(private carroService: CarroService, private router: Router) {}

  listaCarros: CarroFormData[] = [];

  ngOnInit(){
    this.carroService.buscarTodos().subscribe(response => {
      this.listaCarros = response;
      console.log(response);
    })
  }


}

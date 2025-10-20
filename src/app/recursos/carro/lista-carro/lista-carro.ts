import { Component, OnInit } from '@angular/core';
import { CarroService } from '../../../services/carro-service';
import { CarroFormData } from '../../../entities/carroFormData.model';

@Component({
  selector: 'app-lista-carro',
  imports: [],
  templateUrl: './lista-carro.html',
  styleUrl: './lista-carro.css'
})
export class ListaCarro implements OnInit{

  constructor(private carroService: CarroService) {}

  listaCarros: CarroFormData[] = [];

  ngOnInit(){
    this.carroService.buscar
  }


}

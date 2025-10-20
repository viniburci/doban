import { Component, OnInit } from '@angular/core';
import { RecursoService } from '../../services/recurso-service';
import { RecursoCarroResponseDTO } from '../../entities/recursoCarroResponseDTO.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recurso-carro',
  imports: [CommonModule],
  templateUrl: './recurso-carro.html',
  styleUrl: './recurso-carro.css'
})
export class RecursoCarro implements OnInit{
  recursosCarros: RecursoCarroResponseDTO[] = [];

  constructor(private recursoService: RecursoService) { }

  ngOnInit(): void {
    this.recursoService.getRecursosCarros().subscribe({
      next: data => {
        this.recursosCarros = data
      },
      error: error => {
        console.error('Erro ao carregar recursos celulares', error);
      }
    }
    );
  }
}

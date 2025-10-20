import { Component, OnInit } from '@angular/core';
import { RecursoCelularResponseDTO } from '../../entities/recursoCelularResponseDTO.model';
import { RecursoService } from '../../services/recurso-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recurso-celular',
  imports: [CommonModule],
  templateUrl: './recurso-celular.html',
  styleUrl: './recurso-celular.css'
})
export class RecursoCelular implements OnInit {
  recursosCelulares: RecursoCelularResponseDTO[] = [];

  constructor(private recursoService: RecursoService) { }

  ngOnInit(): void {
    this.recursoService.getRecursosCelulares().subscribe({
      next: data => {
        this.recursosCelulares = data
      },
      error: error => {
        console.error('Erro ao carregar recursos celulares', error);
      }
    }
    );
  }
}

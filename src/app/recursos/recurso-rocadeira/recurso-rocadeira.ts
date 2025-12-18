import { Component, OnInit } from '@angular/core';
import { RecursoService } from '../../services/recurso-service';
import { RecursoRocadeiraResponseDTO } from '../../entities/recursoRocadeiraResponseDTO.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recurso-rocadeira',
  imports: [CommonModule],
  templateUrl: './recurso-rocadeira.html',
  styleUrl: './recurso-rocadeira.css'
})
export class RecursoRocadeira implements  OnInit {

  recursosRocadeiras: RecursoRocadeiraResponseDTO[] = [];

  constructor(private recursoService: RecursoService) { }

  ngOnInit(): void {
    this.recursoService.getRecursosRocadeiras().subscribe({
      next: data => {
        this.recursosRocadeiras = data
      },
      error: error => {
        console.error('Erro ao carregar recursos roçadeiras', error);
      }
    }
    );
  }
}

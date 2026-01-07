import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RocadeiraService } from '../../../services/rocadeira-service';
import { RocadeiraResponseDTO } from '../../../entities/rocadeiraResponseDTO.model';

@Component({
  selector: 'app-lista-rocadeira',
  imports: [RouterLink],
  templateUrl: './lista-rocadeira.html',
  styleUrl: './lista-rocadeira.css'
})
export class ListaRocadeira {
  constructor(private rocadeiraService: RocadeiraService, private router: Router) { }

  listaRocadeiras = signal<RocadeiraResponseDTO[]>([]);

  ngOnInit() {
    this.rocadeiraService.listarRocadeiras().subscribe(response => {
      this.listaRocadeiras.set(response);
      console.log(response);
    })
  }
}

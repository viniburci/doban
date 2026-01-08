import { Component, input, OnInit, signal } from '@angular/core';
import { RocadeiraService } from '../../../services/rocadeira-service';
import { RocadeiraResponseDTO } from '../../../entities/rocadeiraResponseDTO.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhes-rocadeira',
  imports: [RouterLink],
  templateUrl: './detalhes-rocadeira.html',
  styleUrl: './detalhes-rocadeira.css'
})
export class DetalhesRocadeira implements OnInit {

  constructor(private rocadeiraService: RocadeiraService) { }

  rocadeiraId = input<string | null>(null);
  rocadeira = signal<RocadeiraResponseDTO | null>(null);

  ngOnInit() {
    if (this.rocadeiraId() != null) {
      this.rocadeiraService.buscarPorId(Number(this.rocadeiraId())).subscribe(response => {
        this.rocadeira.set(response);
        console.log(response);
      });
    }
  }

}

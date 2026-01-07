import { Component, signal } from '@angular/core';
import { CelularService } from '../../../services/celular-service';
import { Router, RouterLink } from '@angular/router';
import { CelularFormData } from '../../../entities/celularFormData.model';

@Component({
  selector: 'app-lista-celular',
  imports: [RouterLink],
  templateUrl: './lista-celular.html',
  styleUrl: './lista-celular.css'
})
export class ListaCelular {
  constructor(private celularService: CelularService, private router: Router) { }

  listaCelulares = signal<CelularFormData[]>([]);

  ngOnInit() {
    this.celularService.buscarTodos().subscribe(response => {
      this.listaCelulares.set(response);
      console.log(response);
    })
  }

}

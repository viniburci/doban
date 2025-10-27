import { Component, input, OnInit, output, signal } from '@angular/core';
import { VagaFormData } from '../../entities/vagaFormData.model';

@Component({
  selector: 'app-card-vaga',
  imports: [],
  templateUrl: './card-vaga.html',
  styleUrl: './card-vaga.css'
})
export class CardVaga implements OnInit {

  vaga = input<VagaFormData | null>(null);

  editarVaga = output<string>();

  isCollapsed = signal(true);

  ngOnInit() {

  }

  toggleCollapse() {
    this.isCollapsed.update(value => !value);
  }

  onEditarVaga() {
    const vagaId = this.vaga()?.id;

    if (vagaId) {
      this.editarVaga.emit(vagaId);
    }
  }

}

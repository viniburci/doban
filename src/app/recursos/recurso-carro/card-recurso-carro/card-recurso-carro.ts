import { Component, computed, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RecursoCarroResponseDTO } from '../../../entities/recursoCarroResponseDTO.model';
import { RecursoService } from '../../../services/recurso-service';
import { CardRecursoBase } from '../../shared/card-recurso-base/card-recurso-base';
import { RecursoCardConfig } from '../../shared/recurso-card-config.interface';

@Component({
  selector: 'app-card-recurso-carro',
  imports: [CardRecursoBase],
  template: `
    <app-card-recurso-base
      [recurso]="recurso()"
      [config]="cardConfig()"
      (editarRecurso)="editarRecurso.emit($event)"
      (updated)="updated.emit()">
    </app-card-recurso-base>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRecursoCarro {
  recurso = input<RecursoCarroResponseDTO | null>(null);

  private recursoService = inject(RecursoService);

  editarRecurso = output<string>();
  updated = output<void>();

  cardConfig = computed<RecursoCardConfig<RecursoCarroResponseDTO>>(() => ({
    fieldConfig: {
      titleField: 'modeloCarro',
      subtitleField: 'placa',
      titleFallback: 'Modelo não disponível',
      subtitleFallback: 'Placa não disponível',
      resourceTypeLabel: 'Carro',
      resourceIdField: 'carroId',
      detailFields: [
        { label: 'Chassi:', field: 'chassi', fallback: 'N/D' },
        { label: 'Cor:', field: 'cor', fallback: 'N/D' },
        { label: 'Ano/Modelo:', field: 'anoModelo', fallback: 'N/D' }
      ]
    },
    routeBase: 'carros',
    deleteFn: (id: number) => this.recursoService.deleteRecursoCarro(id)
  }));
}

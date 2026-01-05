import { Component, computed, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RecursoCelularResponseDTO } from '../../../entities/recursoCelularResponseDTO.model';
import { RecursoService } from '../../../services/recurso-service';
import { CardRecursoBase } from '../../shared/card-recurso-base/card-recurso-base';
import { RecursoCardConfig } from '../../shared/recurso-card-config.interface';

@Component({
  selector: 'app-card-recurso-celular',
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
export class CardRecursoCelular {
  recurso = input<RecursoCelularResponseDTO | null>(null);

  private recursoService = inject(RecursoService);

  editarRecurso = output<string>();
  updated = output<void>();

  cardConfig = computed<RecursoCardConfig<RecursoCelularResponseDTO>>(() => ({
    fieldConfig: {
      titleField: 'modeloCelular',
      subtitleField: 'imei',
      titleFallback: 'Modelo não disponível',
      subtitleFallback: 'IMEI não disponível',
      resourceTypeLabel: 'Celular',
      resourceIdField: 'celularId',
      detailFields: [
        { label: 'IMEI:', field: 'imei', fallback: 'N/D' }
      ]
    },
    routeBase: 'celulares',
    deleteFn: (id: number) => this.recursoService.deleteRecursoCelular(id)
  }));
}

import { Component, computed, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RecursoRocadeiraResponseDTO } from '../../../entities/recursoRocadeiraResponseDTO.model';
import { RecursoService } from '../../../services/recurso-service';
import { CardRecursoBase } from '../../shared/card-recurso-base/card-recurso-base';
import { RecursoCardConfig } from '../../shared/recurso-card-config.interface';

@Component({
  selector: 'app-card-recurso-rocadeira',
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
export class CardRecursoRocadeira {
  recurso = input<RecursoRocadeiraResponseDTO | null>(null);

  private recursoService = inject(RecursoService);

  editarRecurso = output<string>();
  updated = output<void>();

  cardConfig = computed<RecursoCardConfig<RecursoRocadeiraResponseDTO>>(() => ({
    fieldConfig: {
      titleField: 'marca',
      subtitleField: 'numeroSerie',
      titleFallback: 'Marca não disponível',
      subtitleFallback: 'Número de série não disponível',
      resourceTypeLabel: 'Roçadeira',
      resourceIdField: 'rocadeiraId',
      detailFields: [
        { label: 'Marca:', field: 'marca', fallback: 'N/D' },
        { label: 'Número de Série:', field: 'numeroSerie', fallback: 'N/D' }
      ]
    },
    routeBase: 'rocadeiras',
    deleteFn: (id: number) => this.recursoService.deleteRecursoRocadeira(id)
  }));
}

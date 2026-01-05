import { Component, computed, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateDisplayPipe } from '../../../pipes/date-display-pipe';
import { ConfirmDeleteDirective } from '../../../directives/confirm-delete';
import { Recurso } from '../../../entities/recurso.model';
import { RecursoCardConfig } from '../recurso-card-config.interface';

@Component({
  selector: 'app-card-recurso-base',
  imports: [DateDisplayPipe, ConfirmDeleteDirective, RouterLink],
  templateUrl: './card-recurso-base.html',
  styleUrl: './card-recurso-base.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRecursoBase<T extends Recurso> {
  recurso = input<T | null>(null);
  config = input.required<RecursoCardConfig<T>>();

  editarRecurso = output<string>();
  updated = output<void>();

  isCollapsed = signal(true);

  isRecursoAtivo = computed<boolean>(() => {
    const recursoData = this.recurso();
    if (!recursoData) {
      return false;
    }

    if (!recursoData.dataDevolucao) {
      return true;
    }

    const dataDevolucao = this.parseDateString(recursoData.dataDevolucao);

    if (!dataDevolucao) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dataDevolucao.getTime() > today.getTime();
  });

  getFieldValue(fieldName: string): any {
    const recursoData = this.recurso();
    return recursoData ? (recursoData as any)[fieldName] : null;
  }

  toggleCollapse() {
    this.isCollapsed.update(value => !value);
  }

  private parseDateString(dateString: string | null | undefined): Date | null {
    if (!dateString) {
      return null;
    }
    try {
      const datePart = dateString.substring(0, 10);
      return new Date(datePart);
    } catch (e) {
      return null;
    }
  }

  onEditarRecurso() {
    const recursoId = this.recurso()?.id;

    if (recursoId) {
      this.editarRecurso.emit(recursoId.toString());
    }
  }

  onConfirmDelete(event: boolean) {
    if (event === true) {
      this.onDeletarRecurso();
    }
  }

  onDeletarRecurso() {
    const recursoId = this.recurso()?.id;
    const cfg = this.config();

    if (recursoId && cfg.deleteFn) {
      cfg.deleteFn(+recursoId).subscribe({
        next: () => {
          console.log(`Recurso ${cfg.fieldConfig.resourceTypeLabel} deletado com sucesso:`, recursoId);
          this.updated.emit();
        },
        error: (error) => {
          console.error(`Erro ao deletar recurso ${cfg.fieldConfig.resourceTypeLabel}:`, error);
        }
      });
    }
  }
}

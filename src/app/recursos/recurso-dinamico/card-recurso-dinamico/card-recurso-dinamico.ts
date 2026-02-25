import { Component, computed, input, output, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateDisplayPipe } from '../../../pipes/date-display-pipe';
import { ConfirmDeleteDirective } from '../../../directives/confirm-delete';
import { RecursoDinamicoDTO } from '../../../entities/recurso-dinamico.model';
import { RecursoDinamicoService } from '../../../services/recurso-dinamico.service';
import { NotificationService } from '../../../services/notification.service';
import { parseDateString } from '../../../utils/date-utils';

@Component({
  selector: 'app-card-recurso-dinamico',
  imports: [DateDisplayPipe, ConfirmDeleteDirective, RouterLink],
  templateUrl: './card-recurso-dinamico.html',
  styleUrl: './card-recurso-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRecursoDinamico {
  private recursoDinamicoService = inject(RecursoDinamicoService);
  private notifications = inject(NotificationService);

  recurso = input.required<RecursoDinamicoDTO>();
  editarRecurso = output<RecursoDinamicoDTO>();
  updated = output<void>();

  isCollapsed = signal(true);

  isRecursoAtivo = computed<boolean>(() => {
    const recursoData = this.recurso();

    if (!recursoData.dataDevolucao) {
      return true;
    }

    const dataDevolucao = parseDateString(recursoData.dataDevolucao);

    if (!dataDevolucao) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dataDevolucao.getTime() > today.getTime();
  });

  atributosFormatados = computed(() => {
    const recurso = this.recurso();
    const atributos = recurso?.atributosSnapshot ?? recurso?.item?.atributos;
    if (!atributos) return [];

    return Object.entries(atributos).map(([key, value]) => ({
      key: this.formatarNomeCampo(key),
      value: value || 'N/D'
    }));
  });

  toggleCollapse() {
    this.isCollapsed.update(value => !value);
  }

  private formatarNomeCampo(nome: string): string {
    return nome
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  onEditarRecurso() {
    this.editarRecurso.emit(this.recurso());
  }

  onConfirmDelete(event: boolean) {
    if (event === true) {
      this.onDeletarRecurso();
    }
  }

  onDeletarRecurso() {
    const recursoId = this.recurso()?.id;

    if (recursoId) {
      this.recursoDinamicoService.deletar(recursoId).subscribe({
        next: () => {
          this.updated.emit();
        },
        error: () => {
          this.notifications.error('Erro ao deletar recurso. Tente novamente.');
        }
      });
    }
  }
}

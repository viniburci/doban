import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RecursoCarroResponseDTO } from '../../../entities/recursoCarroResponseDTO.model';
import { RecursoService } from '../../../services/recurso-service';
import { DateDisplayPipe } from "../../../pipes/date-display-pipe";
import { ConfirmDialog } from "../../../utils/confirm-dialog/confirm-dialog";
import { RouterLink } from '@angular/router';
import { ConfirmDeleteDirective } from '../../../directives/confirm-delete';

@Component({
  selector: 'app-card-recurso-carro',
  imports: [DateDisplayPipe, ConfirmDialog, ConfirmDeleteDirective, RouterLink],
  templateUrl: './card-recurso-carro.html',
  styleUrl: './card-recurso-carro.css'
})
export class CardRecursoCarro {
  recurso = input<RecursoCarroResponseDTO | null>(null);

  private recursoService = inject(RecursoService);

  editarRecurso = output<string>();
  updated = output<void>();

  isCollapsed = signal(true);

  ngOnInit() { }

  toggleCollapse() {
    this.isCollapsed.update(value => !value);
  }

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
    if (event == true) {
      this.onDeletarRecurso()
      console.log('onconfirmdelete true')
    }
    console.log('onconfirmdelete false')
  }

  onDeletarRecurso() {
    const recursoId = this.recurso()?.id;
    if (recursoId) {
      this.recursoService.deleteRecursoCarro(+recursoId).subscribe({
        next: () => {
          console.log('Recurso celular deletado com sucesso:', recursoId);
          this.updated.emit();
        },
        error: (error) => {
          console.error('Erro ao deletar recurso celular:', error);
        }
      });
    }
  }
}

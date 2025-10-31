import { Component, computed, input, output, signal } from '@angular/core';
import { RecursoCelularResponseDTO } from '../../../entities/recursoCelularResponseDTO.model';
import { DateDisplayPipe } from "../../../pipes/date-display-pipe";

@Component({
  selector: 'app-card-recurso-celular',
  imports: [DateDisplayPipe],
  templateUrl: './card-recurso-celular.html',
  styleUrl: './card-recurso-celular.css'
})
export class CardRecursoCelular {
  recurso = input<RecursoCelularResponseDTO | null>(null);

  editarRecurso = output<string>();

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

    // 1. Condição: O recurso está ATIVO se não há data de devolução
    if (!recursoData.dataDevolucao) {
      return true;
    }

    // 2. Condição: Verifica se a data de devolução é futura
    const dataDevolucao = this.parseDateString(recursoData.dataDevolucao);

    // Se não conseguimos analisar a data, assumimos inativo por segurança
    if (!dataDevolucao) {
      return false;
    }

    // Cria uma data de referência para HOJE (meia-noite local, para comparação justa)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compara. O recurso só está INATIVO se a data de devolução for HOJE ou no passado.
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
}

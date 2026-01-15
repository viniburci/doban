import { Component, computed, input, output, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateDisplayPipe } from '../../../pipes/date-display-pipe';
import { ConfirmDeleteDirective } from '../../../directives/confirm-delete';
import { RecursoDinamicoDTO } from '../../../entities/recurso-dinamico.model';
import { RecursoDinamicoService } from '../../../services/recurso-dinamico.service';

@Component({
  selector: 'app-card-recurso-dinamico',
  imports: [DateDisplayPipe, ConfirmDeleteDirective, RouterLink],
  templateUrl: './card-recurso-dinamico.html',
  styleUrl: './card-recurso-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRecursoDinamico {
  private recursoDinamicoService = inject(RecursoDinamicoService);

  recurso = input.required<RecursoDinamicoDTO>();
  editarRecurso = output<number>();
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

  atributosFormatados = computed(() => {
    const recurso = this.recurso();
    // Usa atributosSnapshot (dados no momento do empréstimo) se disponível,
    // senão fallback para atributos atuais do item
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
      this.editarRecurso.emit(recursoId);
    }
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
          console.log('Recurso dinamico deletado com sucesso:', recursoId);
          this.updated.emit();
        },
        error: (error) => {
          console.error('Erro ao deletar recurso dinamico:', error);
        }
      });
    }
  }
}

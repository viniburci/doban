import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { VagaFormData } from '../../entities/vagaFormData.model';
import { TimeDisplayPipe } from '../../pipes/time-display-pipe';
import { DateDisplayPipe } from "../../pipes/date-display-pipe";
import { parseDateString } from '../../utils/date-utils';

@Component({
  selector: 'app-card-vaga',
  imports: [TimeDisplayPipe, DateDisplayPipe],
  templateUrl: './card-vaga.html',
  styleUrl: './card-vaga.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardVaga {

  vaga = input<VagaFormData | null>(null);

  editarVaga = output<string>();

  isCollapsed = signal(true);

  toggleCollapse() {
    this.isCollapsed.update(value => !value);
  }

  isVagaAtiva = computed<boolean>(() => {
    const vagaData = this.vaga();
    if (!vagaData) {
      return false;
    }

    if (!vagaData.dataDemissao) {
      return true;
    }

    const dataDemissao = parseDateString(vagaData.dataDemissao);

    if (!dataDemissao) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dataDemissao.getTime() > today.getTime();
  });

  onEditarVaga() {
    const vagaId = this.vaga()?.id;

    if (vagaId) {
      this.editarVaga.emit(vagaId);
    }
  }
}

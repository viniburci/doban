import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { VagaFormData } from '../../entities/vagaFormData.model';
import { TimeDisplayPipe } from '../../pipes/time-display-pipe';
import { DateDisplayPipe } from "../../pipes/date-display-pipe";

@Component({
  selector: 'app-card-vaga',
  imports: [TimeDisplayPipe, DateDisplayPipe],
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

  isVagaAtiva = computed<boolean>(() => {
    const vagaData = this.vaga();
    if (!vagaData) {
      return false;
    }

    // 1. Condição: A vaga está ATIVA se não há data de demissão
    if (!vagaData.dataDemissao) {
      return true;
    }

    // 2. Condição: Verifica se a data de demissão é futura
    const dataDemissao = this.parseDateString(vagaData.dataDemissao);

    // Se não conseguimos analisar a data, assumimos inativo por segurança
    if (!dataDemissao) {
      return false;
    }

    // Cria uma data de referência para HOJE (meia-noite local, para comparação justa)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compara. A vaga só está INATIVA se a data de demissão for HOJE ou no passado.
    // dataDemissao.getTime() > today.getTime() -> Significa que a demissão é AMANHÃ ou depois
    return dataDemissao.getTime() > today.getTime();
  });

  private parseDateString(dateString: string | null | undefined): Date | null {
    if (!dateString) {
      return null;
    }
    // Cria um objeto Date diretamente da string ISO (que seu formato se assemelha),
    // ou manipula a string para garantir que o formato seja YYYY-MM-DD.
    try {
      // Pega apenas a parte da data e cria um objeto Date (ex: "2024-07-09")
      // O Date() criado a partir de YYYY-MM-DD é à meia-noite UTC, 
      // o que facilita a comparação de 'dia'.
      const datePart = dateString.substring(0, 10);
      return new Date(datePart);
    } catch (e) {
      return null;
    }
  }

  onEditarVaga() {
    const vagaId = this.vaga()?.id;

    if (vagaId) {
      this.editarVaga.emit(vagaId);
    }
  }
}

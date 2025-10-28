import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  convertISOToDateBR = (isoDate: string | null | undefined): string => {
    if (!isoDate) return '';

    // Verifica se está no formato ISO esperado
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return '';

    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  };

  convertDateToISO = (rawDate: string): string => {
    if (!rawDate) return '';

    // Remove qualquer caractere que não seja número
    const onlyDigits = rawDate.replace(/\D/g, '');

    if (onlyDigits.length !== 8) return '';

    const dia = onlyDigits.slice(0, 2);
    const mes = onlyDigits.slice(2, 4);
    const ano = onlyDigits.slice(4, 8);

    return `${ano}-${mes}-${dia}`;
  };

  convertToLocalTime(timeValue: string | null | undefined): string | null {
    // 1. Checa se o valor existe
    if (!timeValue) {
      return null;
    }

    // 2. Garante que é uma string de horário completa (HH:mm:ss tem 8 caracteres)
    // Se for 'HH:mm:ss', ele tem 8 caracteres. Queremos 'HH:mm' (5 caracteres).
    if (timeValue.length >= 5 && timeValue.includes(':')) {
      // 3. Retorna os 5 primeiros caracteres (HH:mm)
      // Exemplo: "12:12:00" -> "12:12"
      return timeValue.substring(0, 5);
    }

    // Retorna nulo se o formato for inválido ou muito curto
    return null;
  }

  formatTimeForBackend(timeValue: string | null | undefined): string | null {
    if (!timeValue) {
      return null;
    }

    if (timeValue.length === 4 && !timeValue.includes(':')) {
      const hours = timeValue.substring(0, 2);
      const minutes = timeValue.substring(2, 4);

      return `${hours}:${minutes}`;
    }

    // O valor do formulário deve ser "HH:mm" (5 caracteres)
    if (timeValue.length === 5 && timeValue.includes(':')) {
      // Simplesmente concatena ":00"
      return timeValue + ':00'; // Ex: "08:00" -> "08:00:00"
    }

    // Retorna nulo ou o valor original se o formato não for o esperado (evitando erros)
    return null;
  }

}

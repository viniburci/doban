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

}

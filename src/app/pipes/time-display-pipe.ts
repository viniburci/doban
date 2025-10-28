import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDisplayPipe'
})
export class TimeDisplayPipe implements PipeTransform {

  transform(value: string | null | undefined, defaultValue: string = 'N/D'): string {
    if (!value) {
      return defaultValue;
    }

    // Tenta encontrar o último separador (o segundo ':')
    const lastColonIndex = value.lastIndexOf(':');

    // Se a string tem mais de 5 caracteres E um segundo ':' existe, trunca.
    // Ex: '12:00:00'.lastIndexOf(':') retorna 5.
    if (value.length > 5 && lastColonIndex > 0) {
      // Retorna a substring do início até o índice do último ':'
      return value.substring(0, lastColonIndex); // Retorna '12:00'
    }

    // Se já estiver em 'HH:MM' ou em um formato inesperado, retorna o valor original.
    return value;
  }
}

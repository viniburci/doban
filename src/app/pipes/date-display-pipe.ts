import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDisplayPipe'
})
export class DateDisplayPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value); // Cria um objeto Date a partir da string
    const day = String(date.getDate()).padStart(2, '0'); // Adiciona o zero à esquerda
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona o zero à esquerda (meses começam de 0)
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

}

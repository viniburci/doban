import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDisplayPipe'
})
export class DateDisplayPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

}

import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date, format = 'dd/MM/yyyy', local = 'fr-FR'): string {
    return formatDate(value, format, local);
  }
}

import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date, format: string = 'dd/MM/yyyy', local: string = 'fr-FR'): string {
    return formatDate(value, format, local);
  }
}

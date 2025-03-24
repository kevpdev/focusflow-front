import { Pipe, PipeTransform } from '@angular/core';
import { EStatus } from '../../core/models';

@Pipe({
  name: 'translateTaskStatus',
  standalone: true,
})
export class TranslateTaskStatusPipe implements PipeTransform {
  private statusLabels: Record<EStatus, string> = {
    [EStatus.PENDING]: 'A faire',
    [EStatus.IN_PROGRESS]: 'En cours',
    [EStatus.DONE]: 'Terminée',
    [EStatus.CANCELLED]: 'Annulée',
    [EStatus.NO_STATUS]: 'Sans statut',
  };

  transform(value: EStatus): string {
    return this.statusLabels[value] || 'Statut inconnu';
  }
}

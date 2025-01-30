import { Pipe, PipeTransform } from '@angular/core';
import { ETaskStatus } from '../../core/models/task.model';

@Pipe({
  name: 'translateTaskStatus',
  standalone: true
})
export class TranslateTaskStatusPipe implements PipeTransform {

  private statusLabels: Record<ETaskStatus, string> = {
    [ETaskStatus.PENDING]: "A faire",
    [ETaskStatus.IN_PROGRESS]: "En cours",
    [ETaskStatus.DONE]: "Terminée",
    [ETaskStatus.CANCELLED]: "Annulée",
    [ETaskStatus.NO_STATUS]: "Sans statut",
  }

  transform(value: ETaskStatus): string {
    return this.statusLabels[value] || "Statut inconnu";
  }

}

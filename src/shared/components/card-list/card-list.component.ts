import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Identifiable } from 'src/core/models';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent<T extends Identifiable> {
  @Input()
  public recordTData!: Record<string, Observable<T[]> | T[]>;
}

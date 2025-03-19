import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Identifiable } from 'src/core/models';

@Component({
  selector: 'app-card-list-mobile',
  standalone: true,
  imports: [],
  templateUrl: './card-list-mobile.component.html',
  styleUrl: './card-list-mobile.component.scss'
})
export class CardListMobileComponent<T extends Identifiable> {

  @Input()
  public recordTData!: Record<string, Observable<T[]> | T[]>;

}

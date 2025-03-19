import { AsyncPipe } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Identifiable } from 'src/core/models';
import { EStatusActive } from 'src/core/models/enums/status.enum';
import { ResponsiveService } from 'src/core/services';
import { CardListMobileComponent } from '../card-list-mobile/card-list-mobile.component';
import { KanbanComponent } from "../kanban/kanban.component";

@Component({
  selector: 'app-screen-wrapper',
  standalone: true,
  imports: [KanbanComponent, CardListMobileComponent, AsyncPipe],
  templateUrl: './screen-wrapper.component.html',
  styleUrl: './screen-wrapper.component.scss'
})
export class ScreenWrapperComponent<T extends Identifiable> {

  @Input() recordItems: Record<EStatusActive, Observable<T[]>> = {
    [EStatusActive.PENDING]: of([]),
    [EStatusActive.IN_PROGRESS]: of([]),
    [EStatusActive.DONE]: of([])
  };
  @Input() templateRef: TemplateRef<{ $implicit: T }> | null = null;
  isSmallScreen$: Observable<boolean> = of(false);


  constructor(private responsiveService: ResponsiveService) { }

  ngOnInit(): void {
    console.log('ScreenWrapperComponent : templateRef', this.templateRef);

    this.isSmallScreen$ = this.responsiveService.isSmallScreen();
  }

}

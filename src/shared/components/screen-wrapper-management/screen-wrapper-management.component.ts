import { AsyncPipe } from '@angular/common';
import { Component, Input, TemplateRef, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KanbanComponent } from 'src/app/project/project-page/kanban/kanban.component';
import { Identifiable } from 'src/core/models';
import { EStatusActive } from 'src/core/models/enums/status.enum';
import { EditItemFormComponent } from 'src/core/models/interfaces/edit-form-component.interface';
import { LayoutService } from 'src/core/services';
import { CardListComponent } from '../card-list/card-list.component';

@Component({
  selector: 'app-screen-wrapper-management',
  standalone: true,
  imports: [KanbanComponent, CardListComponent, AsyncPipe],
  templateUrl: './screen-wrapper-management.component.html',
  styleUrl: './screen-wrapper-management.component.scss',
})
export class ScreenWrapperManagementComponent<T extends Identifiable> {
  @Input() recordItems: Record<EStatusActive, Observable<T[]>> = {
    [EStatusActive.PENDING]: of([]),
    [EStatusActive.IN_PROGRESS]: of([]),
    [EStatusActive.DONE]: of([]),
  };
  @Input() templateRef: TemplateRef<{ $implicit: T }> | null = null;
  @Input() editFormComponent: Type<EditItemFormComponent> | null = null;
  isSmallScreen$: Observable<boolean> = of(false);

  constructor(private responsiveService: LayoutService) {}

  ngOnInit(): void {
    this.isSmallScreen$ = this.responsiveService.isSmallScreen();
  }
}

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { Identifiable } from 'src/core/models';
import { EStatusActive } from 'src/core/models/enums/status.enum';
import { TranslationService } from 'src/core/services';
import { ItemsColumnComponent } from '../items-column/items-column.component';

export type ColumnMetaData = {
  id: EStatusActive;
  title: string;
  connectTo: EStatusActive[];
};

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ItemsColumnComponent
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent<T extends Identifiable> implements OnInit {

  @Input() recordItems: Record<EStatusActive, Observable<T[]>> = {
    [EStatusActive.PENDING]: of([]),
    [EStatusActive.IN_PROGRESS]: of([]),
    [EStatusActive.DONE]: of([])
  };
  @Input() templateRef: TemplateRef<{ $implicit: T }> | null = null;

  constructor(private translationService: TranslationService) { }

  columns: ColumnMetaData[] = [
    {
      id: EStatusActive.PENDING,
      title: this.translationService.instant('KANBAN.COLUMN.PENDING'),
      connectTo: [EStatusActive.IN_PROGRESS, EStatusActive.DONE]
    },
    {
      id: EStatusActive.IN_PROGRESS,
      title: this.translationService.instant('KANBAN.COLUMN.IN_PROGRESS'),
      connectTo: [EStatusActive.PENDING, EStatusActive.DONE]
    },
    {
      id: EStatusActive.DONE,
      title: this.translationService.instant('KANBAN.COLUMN.DONE'),
      connectTo: [EStatusActive.PENDING, EStatusActive.IN_PROGRESS]
    }
  ];

  ngOnInit(): void {

  }

  addItem(): void {
    console.log('add item');
  }

  saveChanges(): void {
    console.log('save changes');
  }

  onDrop(event: CdkDragDrop<T[]>) {
    console.log('drop', event);
    if (event.previousContainer === event.container) {
      console.log('move');

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('transfer');

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}

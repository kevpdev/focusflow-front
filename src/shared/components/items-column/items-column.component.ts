import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, TrackByFunction } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable, of } from 'rxjs';
import { TaskCardComponent } from 'src/app/task/task-card/task-card.component';
import { Identifiable } from 'src/core/models';
import { EStatusActive } from 'src/core/models/enums/status.enum';
import { ColumnMetaData } from '../kanban/kanban.component';

@Component({
  selector: 'app-items-column',
  standalone: true,
  imports: [AsyncPipe,
    CommonModule,
    CdkDropList,
    MatCardModule,
    CdkDrag, TaskCardComponent],
  templateUrl: './items-column.component.html',
  styleUrl: './items-column.component.scss'
})
export class ItemsColumnComponent<T extends Identifiable> implements OnInit {

  @Input() title: string = '';
  @Input() columnMetaData: ColumnMetaData = {
    id: EStatusActive.PENDING,
    title: '',
    connectTo: []
  };
  @Input() items$: Observable<T[]> = of([]);
  @Input() templateRef: TemplateRef<{ $implicit: T }> | null = null;
  @Output() dropEvent = new EventEmitter<CdkDragDrop<T[]>>();

  ngOnInit(): void {

  }

  drop(event: CdkDragDrop<T[]>) {
    this.dropEvent.emit(event);
  }

  trackByItemId: TrackByFunction<T> = (index: number, item: T) => item.id;
}

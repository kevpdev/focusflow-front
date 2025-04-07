import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  Injector,
  input,
  OnInit,
  output,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ETaskType, Task } from 'src/core/models';
import { BugTask } from 'src/core/models/bug-task.model';
import { ColumnMetaData } from '../kanban.component';
import { TaskCardComponent } from './task/task-card/task-card.component';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [AsyncPipe, CommonModule, CdkDropList, MatCardModule, CdkDrag, TaskCardComponent],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent implements OnInit {
  columnMetaData = input.required<ColumnMetaData>();
  dropEvent = output<CdkDragDrop<Task[]>>();

  @ViewChild('taskCardTemplate', { static: true }) taskTemplate: TemplateRef<{
    $implicit: Task;
  }> | null = null;
  @ViewChild('bugCardTemplate', { static: true }) bugTemplate: TemplateRef<{
    $implicit: BugTask;
  }> | null = null;

  mapTemplate: Record<ETaskType, TemplateRef<{ $implicit: Task }>> | null = null;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.initMapTemplate();
  }

  drop(event: CdkDragDrop<Task[]>) {
    this.dropEvent.emit(event);
  }

  trackByTaskId: TrackByFunction<Task> = (index: number, item: Task) => item.id;

  /**
   *  Init the mapTemplate with the taskTemplate and bugTemplate
   */
  initMapTemplate(): void {
    if (this.taskTemplate && this.bugTemplate) {
      this.mapTemplate = {
        [ETaskType.TASK]: this.taskTemplate,
        [ETaskType.BUG]: this.bugTemplate,
      };
    } else {
      throw new Error('The taskTemplate and bugTemplate are required');
    }
  }

  getTaskTemplate(taskType: ETaskType): TemplateRef<{ $implicit: Task }> {
    return this.mapTemplate![taskType] ?? this.taskTemplate;
  }
}

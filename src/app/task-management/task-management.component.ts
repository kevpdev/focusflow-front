import { Component, Type } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EStatusActive } from 'src/core/models/enums/status.enum';
import { Task } from 'src/core/models/task.model';
import { TaskStoreService } from 'src/core/services/task/task-store.service';
import { ScreenWrapperManagementComponent } from "../../shared/components/screen-wrapper-management/screen-wrapper-management.component";
import { EditTaskCardComponent } from '../project/project-page/kanban/kanban-column/task/edit-task-card/edit-task-card.component';
import { TaskCardComponent } from '../project/project-page/kanban/kanban-column/task/task-card/task-card.component';

@Component({
  selector: 'app-task-mangagement-container',
  standalone: true,
  imports: [ScreenWrapperManagementComponent,
    TranslateModule,
    TaskCardComponent],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss'
})
export class TaskManagementComponent {

  recordTasks!: Record<EStatusActive, Observable<Task[]>>;
  editTaskFormComponent: Type<EditTaskCardComponent> = EditTaskCardComponent;

  constructor(private taskStoreService: TaskStoreService,
  ) { }

  ngOnInit(): void {
    this.recordTasks = {
      PENDING: this.taskStoreService.pendingTasks$,
      IN_PROGRESS: this.taskStoreService.inProgressTasks$,
      DONE: this.taskStoreService.doneTasks$
    }
  }
}

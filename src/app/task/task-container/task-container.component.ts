import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EStatusActive } from 'src/core/models/enums/status.enum';
import { Task } from 'src/core/models/task.model';
import { TaskStoreService } from 'src/core/services/task/task-store.service';
import { ScreenWrapperComponent } from "../../../shared/components/screen-wrapper/screen-wrapper.component";
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-container',
  standalone: true,
  imports: [ScreenWrapperComponent,
    TranslateModule,
    TaskCardComponent,
    CdkDrag],
  templateUrl: './task-container.component.html',
  styleUrl: './task-container.component.scss'
})
export class TaskContainerComponent {

  recordTasks!: Record<EStatusActive, Observable<Task[]>>;
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

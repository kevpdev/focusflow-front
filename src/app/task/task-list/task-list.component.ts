import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ETaskStatus, Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { TaskListCardComponent } from '../task-list-card/task-list-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskListCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  public inProgressTasks$!: Observable<Task[]>;
  public pendingTasks$!: Observable<Task[]>;
  public finishedTasks$!: Observable<Task[]>;
  public tasksStatus = ETaskStatus;
  public inProgessTasksTitleCard = "Tâches en cours";
  public pendingTasksTitleCard = "Tâches à faire";
  public finishedTasksTitleCard = "Tâches terminées";

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.inProgressTasks$ = this.taskService.fetchAllInProgressTasks();
    this.pendingTasks$ = this.taskService.fetchAllPendingTasks();
    this.finishedTasks$ = this.taskService.fetchFinishedTasks();
  }



}

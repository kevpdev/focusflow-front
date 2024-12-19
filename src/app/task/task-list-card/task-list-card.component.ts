import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { ETaskStatus, Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [AsyncPipe,
    DatePipe,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule],
  templateUrl: './task-list-card.component.html',
  styleUrl: './task-list-card.component.scss'
})
export class TaskListCardComponent {

  @Input()
  public tasks$: Observable<Task[]> | undefined;
  @Input()
  public title: string | undefined;

  public tasksStatus = ETaskStatus;


  public delete(tasks: any): void {
    console.log(tasks.selectedOptions);

  }

}

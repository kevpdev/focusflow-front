import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { ETaskStatus, Task } from '../../../core/models/task.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-task-list-card',
  standalone: true,
  imports: [AsyncPipe,
    DatePipe,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule],
  templateUrl: './task-list-card.component.html',
  styleUrl: './task-list-card.component.scss'
})
export class TaskListCardComponent {

  @Input()
  public tasks$: Observable<Task[]> | undefined;
  @Input()
  public title: string | undefined;
  @Input()
  public connectTo: ETaskStatus[] = [];
  @Input()
  public tasksColumnId = ETaskStatus.PENDING;
  @Output()
  public dropEvent = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output()
  public deleteTaskEvent = new EventEmitter<Task>();
  @Output()
  public updateTaskEvent = new EventEmitter<Task>();
  public modifiedTasks: Task[] = [];

  constructor(private dialog: MatDialog) { }

  public delete(task: Task): void {

    console.log("tâche à supprimer : ", task);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: `Voulez-vous vraiment supprimer la tâche : \n ${task.title} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result", result);
        this.deleteTaskEvent.emit(task);
      }
    })

  }

  public update(task: Task) {
    this.updateTaskEvent.emit(task);
  }

  public onDrop(event: CdkDragDrop<Task[]>) {
    this.dropEvent.emit(event);
  }






}

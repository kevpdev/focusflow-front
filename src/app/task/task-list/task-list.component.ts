import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable } from 'rxjs';
import { ETaskStatus, Task } from '../../../core/models/task.model';
import { TaskStoreService } from '../../../core/services/task/task-store.service';
import { UtilityService } from '../../../core/services/utility.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { TaskListCardComponent } from '../task-list-card/task-list-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskListCardComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  public inProgressTasks$!: Observable<Task[]>;
  public pendingTasks$!: Observable<Task[]>;
  public finishedTasks$!: Observable<Task[]>;
  public inProgessTasksTitleCard = "Tâches en cours";
  public pendingTasksTitleCard = "Tâches à faire";
  public finishedTasksTitleCard = "Tâches terminées";
  public tasksColumnId = ETaskStatus;
  public modifiedTasks: Task[] = [];
  public isEditMode = false;


  constructor(private taskService: TaskStoreService,
    private dialog: MatDialog,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.inProgressTasks$ = this.taskService.fetchAllInProgressTasks();
    this.pendingTasks$ = this.taskService.fetchAllPendingTasks();
    this.finishedTasks$ = this.taskService.fetchFinishedTasks();

  }

  public saveChanges(): void {
    console.log('saveChanges');
    console.log(this.modifiedTasks);
    this.taskService.updateTaskStatus(this.modifiedTasks);

  }



  public drop(event: CdkDragDrop<Task[]>) {

    console.log('event', event);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    let eventContainer = event.container;

    // Mise à jour du statut 
    this.updateTaskStatus(eventContainer, event.currentIndex);

  }

  private updateTaskStatus(eventContainer: CdkDropList<Task[]>, currentIndex: number) {
    let newTaskStatus = this.utilityService.getEnumKeyFromValue(ETaskStatus, eventContainer.id, ETaskStatus.NO_STATUS);
    let selectedTask = eventContainer.data[currentIndex];

    // Pour eliminer les taches qui se déplacent dans la même colonne
    if (selectedTask.status !== newTaskStatus) {

      selectedTask.status = newTaskStatus as ETaskStatus;

      // Mise à jour du tableau drag & drop avec le nouveau status
      eventContainer.data.splice(currentIndex, 1, selectedTask);

      // Ajout de la tache dans la liste des tâches modifiées
      let taskFound = this.modifiedTasks.find(task => selectedTask.id === task.id);
      console.log(taskFound);

      if (!taskFound) {
        this.modifiedTasks.push(selectedTask);
      }
    }
  }



  public addNewTask(): void {
    this.isEditMode = false;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: { isEditMode: this.isEditMode }
    });
  }

  public updateTask(task: Task): void {
    console.log('updateTask', task);
    this.isEditMode = true;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: {
        isEditMode: this.isEditMode,
        task: task
      }
    });
  }

  public deleteTask(task: Task): void {

    console.log('deleteTask', task.status);

    let updatedTasks$;

    switch (task.status) {
      case ETaskStatus.PENDING:
        updatedTasks$ = this.pendingTasks$.pipe(
          map(tasks => {
            return tasks.filter(pendingTask => pendingTask.id != task.id)
          })
        );
        this.pendingTasks$ = updatedTasks$;
        break;
      case ETaskStatus.IN_PROGRESS:
        updatedTasks$ = this.inProgressTasks$.pipe(
          map(tasks => {
            return tasks.filter(inProgressTasks => inProgressTasks.id != task.id)
          })
        );
        this.inProgressTasks$ = updatedTasks$;
        break;
      case ETaskStatus.DONE:
        updatedTasks$ = this.finishedTasks$.pipe(
          map(tasks => {
            return tasks.filter(finishedTasks => finishedTasks.id != task.id)
          })
        );
        this.finishedTasks$ = updatedTasks$;
        break;
    }

    console.log('updatedTasks$', updatedTasks$);

    if (updatedTasks$) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        console.log("La tâche a bien été supprimée : ", task.id);
      })
    }
  }



}

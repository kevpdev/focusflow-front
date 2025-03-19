import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { EStatus } from 'src/core/models';
import { Task } from '../../../core/models/task.model';
import { TaskStoreService } from '../../../core/services/task/task-store.service';
import { TranslationService } from '../../../core/services/ui/translation/translation.service';
import { UtilityService } from '../../../core/services/ui/utility/utility.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { TaskListCardComponent } from '../task-list-card/task-list-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskListCardComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    TranslateModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  public inProgressTasks$!: Observable<Task[]>;
  public pendingTasks$!: Observable<Task[]>;
  public finishedTasks$!: Observable<Task[]>;
  public inProgessTasksTitleCard: string | undefined;
  public pendingTasksTitleCard: string | undefined;
  public finishedTasksTitleCard: string | undefined;
  public tasksColumnId = EStatus;
  public modifiedTasks: Task[] = [];
  public isEditMode = false;


  constructor(private taskService: TaskStoreService,
    private dialog: MatDialog,
    private utilityService: UtilityService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {

    this.pendingTasksTitleCard = this.translationService.instant('TASK_MANAGEMENT.CARD.LIST.TITLES.PENDING');
    this.inProgessTasksTitleCard = this.translationService.instant('TASK_MANAGEMENT.CARD.LIST.TITLES.IN_PROGRESS');
    this.finishedTasksTitleCard = this.translationService.instant('TASK_MANAGEMENT.CARD.LIST.TITLES.DONE');
    this.taskService.fetchAllTasks().subscribe();
    this.pendingTasks$ = this.taskService.pendingTasks$;
    this.inProgressTasks$ = this.taskService.inProgressTasks$;
    this.finishedTasks$ = this.taskService.doneTasks$;

  }

  public saveChanges(): void {
    this.taskService.updateTaskStatus(this.modifiedTasks).subscribe(() => this.modifiedTasks = []);

  }



  public drop(event: CdkDragDrop<Task[]>) {

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
    let newTaskStatus = this.utilityService.getEnumKeyFromValue(EStatus, eventContainer.id, EStatus.NO_STATUS);
    let selectedTask = eventContainer.data[currentIndex];

    // Pour eliminer les taches qui se déplacent dans la même colonne
    if (selectedTask.status !== newTaskStatus) {

      selectedTask.status = newTaskStatus as EStatus;

      // Mise à jour du tableau drag & drop avec le nouveau status
      eventContainer.data.splice(currentIndex, 1, selectedTask);

      // Ajout de la tache dans la liste des tâches modifiées
      let taskFound = this.modifiedTasks.find(task => selectedTask.id === task.id);

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
    this.isEditMode = true;
    const dialogRef = this.dialog.open(EditTaskComponent, {
      data: {
        isEditMode: this.isEditMode,
        task: task
      }
    });
  }

  public deleteTask(task: Task): void {

    let updatedTasks$;

    switch (task.status) {
      case EStatus.PENDING:
        updatedTasks$ = this.pendingTasks$.pipe(
          map(tasks => {
            return tasks.filter(pendingTask => pendingTask.id != task.id)
          })
        );
        this.pendingTasks$ = updatedTasks$;
        break;
      case EStatus.IN_PROGRESS:
        updatedTasks$ = this.inProgressTasks$.pipe(
          map(tasks => {
            return tasks.filter(inProgressTasks => inProgressTasks.id != task.id)
          })
        );
        this.inProgressTasks$ = updatedTasks$;
        break;
      case EStatus.DONE:
        updatedTasks$ = this.finishedTasks$.pipe(
          map(tasks => {
            return tasks.filter(finishedTasks => finishedTasks.id != task.id)
          })
        );
        this.finishedTasks$ = updatedTasks$;
        break;
    }

    if (updatedTasks$) {
      this.taskService.deleteTask(task.id).subscribe();
    }
  }



}

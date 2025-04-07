import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, input, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { Task } from 'src/core/models';
import { EStatus, EStatusActive } from 'src/core/models/enums/status.enum';
import { ProjectStoreService, TaskStoreService, TranslationService } from 'src/core/services';
import { ConfirmationDialogComponent } from 'src/shared/components/confirmation-dialog/confirmation-dialog.component';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';
import { EditTaskCardComponent } from './kanban-column/task/edit-task-card/edit-task-card.component';

export interface ColumnMetaData {
  id: EStatusActive;
  title: Signal<string>;
  connectTo: EStatusActive[];
  tasks$: Observable<Task[]>;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, KanbanColumnComponent, MatMenuModule, TranslateModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnInit {
  readonly recordTasks: Record<EStatusActive, Observable<Task[]>> = {
    PENDING: this.taskStoreService.pendingTasks$,
    IN_PROGRESS: this.taskStoreService.inProgressTasks$,
    DONE: this.taskStoreService.doneTasks$,
  };

  readonly columnsMetaData: ColumnMetaData[] = [
    {
      id: EStatusActive.PENDING,
      title: this.translationService.getTranslationToSignal('KANBAN.COLUMN.PENDING'),
      connectTo: [EStatusActive.IN_PROGRESS, EStatusActive.DONE],
      tasks$: this.recordTasks[EStatusActive.PENDING],
    },
    {
      id: EStatusActive.IN_PROGRESS,
      title: this.translationService.getTranslationToSignal('KANBAN.COLUMN.IN_PROGRESS'),
      connectTo: [EStatusActive.PENDING, EStatusActive.DONE],
      tasks$: this.recordTasks[EStatusActive.IN_PROGRESS],
    },
    {
      id: EStatusActive.DONE,
      title: this.translationService.getTranslationToSignal('KANBAN.COLUMN.DONE'), // TODO: translate
      connectTo: [EStatusActive.PENDING, EStatusActive.IN_PROGRESS],
      tasks$: this.recordTasks[EStatusActive.DONE],
    },
  ];

  isEditMode = false;
  projectId = input.required<number>();

  constructor(
    private taskStoreService: TaskStoreService,
    private projectStoreService: ProjectStoreService,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskStoreService.fetchAllTasksByProjectId(this.projectId()).pipe(take(1)).subscribe();
  }

  addItem(): void {
    this.dialog.open(EditTaskCardComponent, {
      data: { isEditMode: this.isEditMode, projectId: this.projectId() },
      panelClass: 'my-custom-dialog',
    });
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Mise à jour du statut
      const selectedTask = event.container.data[event.currentIndex];
      const newTaskStatus = EStatus[event.container.id as keyof typeof EStatusActive];

      this.taskStoreService.updateTaskStatus(selectedTask, newTaskStatus).pipe(take(1)).subscribe();
    }
  }

  deleteProject(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Suppression du projet',
        message: 'Êtes-vous sûr de vouloir supprimer ce projet ?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.projectStoreService
            .deleteProject(this.projectId())
            .pipe(take(1))
            .subscribe(() => {
              this.router.navigate(['/dashboard']);
            });
        }
      });
  }
}

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { Task } from 'src/core/models';
import { EStatus, EStatusActive } from 'src/core/models/enums/status.enum';
import { ProjectStoreService, TaskStoreService, TranslationService } from 'src/core/services';
import { ConfirmationDialogComponent } from 'src/shared/components/confirmation-dialog/confirmation-dialog.component';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';
import { EditTaskCardComponent } from './kanban-column/task/edit-task-card/edit-task-card.component';

export interface ColumnMetaData {
  id: EStatusActive;
  title: string;
  connectTo: EStatusActive[];
  tasks$: Observable<Task[]>;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, KanbanColumnComponent, MatMenuModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnInit {
  recordTasks: Record<EStatusActive, Observable<Task[]>> = {
    [EStatusActive.PENDING]: of([]),
    [EStatusActive.IN_PROGRESS]: of([]),
    [EStatusActive.DONE]: of([]),
  };
  columnsMetaData: ColumnMetaData[] = [];
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

    this.recordTasks = {
      PENDING: this.taskStoreService.pendingTasks$,
      IN_PROGRESS: this.taskStoreService.inProgressTasks$,
      DONE: this.taskStoreService.doneTasks$,
    };

    this.initColumns();
  }

  initColumns(): void {
    this.columnsMetaData.push(
      ...[
        {
          id: EStatusActive.PENDING,
          title: this.translationService.instant('KANBAN.COLUMN.PENDING'),
          connectTo: [EStatusActive.IN_PROGRESS, EStatusActive.DONE],
          tasks$: this.recordTasks[EStatusActive.PENDING],
        },
        {
          id: EStatusActive.IN_PROGRESS,
          title: this.translationService.instant('KANBAN.COLUMN.IN_PROGRESS'),
          connectTo: [EStatusActive.PENDING, EStatusActive.DONE],
          tasks$: this.recordTasks[EStatusActive.IN_PROGRESS],
        },
        {
          id: EStatusActive.DONE,
          title: this.translationService.instant('KANBAN.COLUMN.DONE'), // TODO: translate
          connectTo: [EStatusActive.PENDING, EStatusActive.IN_PROGRESS],
          tasks$: this.recordTasks[EStatusActive.DONE],
        },
      ]
    );
  }

  addItem(): void {
    this.dialog.open(EditTaskCardComponent, {
      data: { isEditMode: this.isEditMode },
    });
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    console.log('drop', event);
    if (event.previousContainer === event.container) {
      console.log('move');

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('transfer');

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
    console.log('deleteProject', this.projectId);
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

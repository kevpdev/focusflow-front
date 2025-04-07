import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatActionList } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Task } from 'src/core/models';
import { TaskStoreService, TranslationService } from 'src/core/services';
import { ConfirmationDialogComponent } from 'src/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CustomDatePipe } from 'src/shared/pipes/custom-date.pipe';
import { TranslateTaskStatusPipe } from 'src/shared/pipes/translate-task-status.pipe';
import { EditTaskCardComponent } from '../edit-task-card/edit-task-card.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatActionList,
    TranslateModule,
    CustomDatePipe,
    TranslateTaskStatusPipe,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  taskInput = input<Task>();
  readonly task = computed(() => this.taskInput() ?? new Task());

  dropEvent = output<CdkDragDrop<Task[]>>();
  modifiedTasks: Task[] = [];
  unSubscribe$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private translationService: TranslationService,
    private taskStoreService: TaskStoreService
  ) {}

  delete(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `${this.translationService.instant('CARD.LIST.DELETE')} \n ${task.title} ?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(result => {
        if (result) {
          this.taskStoreService.deleteTask(task.id).subscribe();
        }
      });
  }

  isExpired(dueDateMillisValue: number) {
    return dueDateMillisValue < Date.now();
  }

  update(task: Task): void {
    this.dialog.open(EditTaskCardComponent, {
      data: {
        isEditMode: true,
        task,
      },
      panelClass: 'my-custom-dialog',
    });
  }
}

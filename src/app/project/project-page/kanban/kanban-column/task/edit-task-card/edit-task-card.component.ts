import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { EStatus, ETaskType, Task } from 'src/core/models';
import { BugTask } from 'src/core/models/bug-task.model';
import { EditItemFormComponent } from 'src/core/models/interfaces/edit-form-component.interface';
import { TaskStoreService, TranslationService } from 'src/core/services';

@Component({
  selector: 'app-edit-task-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogClose,
    MatDialogActions,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './edit-task-card.component.html',
  styleUrl: './edit-task-card.component.scss',
})
export class EditTaskCardComponent implements OnInit, OnDestroy, EditItemFormComponent {
  unsubscribe$ = new Subject<void>();
  title!: string;
  isEditMode: boolean;
  task: Task;
  ETaskType = ETaskType;
  editForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    dueDate: new FormControl(new Date(), [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  constructor(
    private taskStoreService: TaskStoreService,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) data: { isEditMode: boolean; task: Task }
  ) {
    this.task = data.task;
    this.isEditMode = data.isEditMode;
  }

  ngOnInit(): void {
    if (this.task && this.isEditMode) {
      this.initForm(this.editForm);
      this.setEditMode();
    } else {
      this.setAddMode();
    }
  }

  initForm(form: FormGroup): void {
    form.patchValue({
      title: this.task.title || '',
      description: this.task.description || '',
      priority: this.task.priority ? String(this.task.priority) : '',
      status: this.task.status ? String(this.task.status) : '',
      dueDate: this.task.dueDate || '',
      type: this.task.type ? String(this.task.type) : '',
    });
  }

  /**
   * Configuration spécifique au mode édition
   */
  private setEditMode(): void {
    this.title = this.translationService.instant('TASK_MANAGEMENT.CARD.EDIT.EDIT_MODE_TITLE');
    this.editForm.get('status')?.enable(); // S'assure que le champ est actif
  }

  /**
   * Configuration spécifique au mode ajout
   */
  private setAddMode(): void {
    this.title = this.translationService.instant('TASK_MANAGEMENT.CARD.EDIT.ADD_MODE_TITLE');
    this.editForm.get('status')?.disable();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const baseData = this.buildBaseTaskData();
      const newTask = this.getTaskFromType(baseData);

      if (this.isEditMode) {
        this.taskStoreService.updateTask(newTask).pipe(takeUntil(this.unsubscribe$)).subscribe();
      } else {
        this.taskStoreService.addNewTask(newTask).pipe(takeUntil(this.unsubscribe$)).subscribe();
      }
    }
  }

  private buildBaseTaskData(): Task {
    const formData = this.editForm.value;
    return {
      id: this.isEditMode ? this.task.id : undefined,
      title: formData.title,
      description: formData.description,
      status: this.isEditMode ? formData.status : EStatus.PENDING,
      priority: Number(formData.priority),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      projectId: this.isEditMode ? this.task.projectId : undefined,
      type: formData.type,
    } as Task;
  }

  private getTaskFromType(data: Task): Task {
    switch (data.type) {
      case ETaskType.BUG:
        return new BugTask(data);
      default:
        return new Task(data);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
  }
}

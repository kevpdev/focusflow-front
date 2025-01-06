import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ETaskStatus, Task } from '../../../core/models/task.model';
import { TaskStoreService } from '../../../core/services';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogClose,
    MatDialogActions,
    MatSelectModule,
    TranslateModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit, OnDestroy {

  public unsubscribe$ = new Subject<void>();
  public title: string | undefined;
  public isEditMode: boolean;
  public task: Task;
  public editForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    dueDate: new FormControl(new Date(), [Validators.required]),

  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { isEditMode: boolean, task: Task },
    private taskService: TaskStoreService,
    private translationService: TranslationService) {

    this.task = data.task;
    this.isEditMode = data.isEditMode;
    console.log('data', data);
    console.log('isEditMode', this.isEditMode);


  }


  ngOnInit(): void {

    if (this.task) {
      this.initTaskForm();
    }

    this.isEditMode ? this.title = this.translationService.instant('TASK.CARD.EDIT.EDIT_MODE_TITLE')
      : this.title = this.translationService.instant('TASK.CARD.EDIT.ADD_MODE_TITLE');
  }


  private initTaskForm(): void {
    this.task.title ? this.editForm.get('title')?.setValue(this.task.title) : '';
    this.task.description ? this.editForm.get('description')?.setValue(this.task.description) : '';
    this.task.priority ? this.editForm.get('priority')?.setValue(String(this.task.priority)) : '';
    this.task.priority ? this.editForm.get('status')?.setValue(String(this.task.status)) : '';
    this.task.dueDate ? this.editForm.get('dueDate')?.setValue(this.task.dueDate) : '';
  }



  public onSubmit(): void {
    console.log('form', this.editForm);

    if (this.editForm.valid) {

      const formData = this.editForm.value;

      const newTask = new Task({
        id: this.isEditMode ? this.task.id : undefined,
        title: formData.title as string,
        description: formData.description as string,
        status: this.isEditMode ? formData.status as ETaskStatus : ETaskStatus.PENDING,
        priority: Number(formData.priority),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
      });

      console.log('Nouvelle tâche à créer ou mdofier :', newTask);

      if (this.isEditMode) {
        this.taskService.updateTask(newTask).
          pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      } else {
        this.taskService.addNewTask(newTask)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      }

    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
  }

}

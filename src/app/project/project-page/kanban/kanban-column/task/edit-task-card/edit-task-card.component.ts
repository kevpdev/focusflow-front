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
import { EStatus, Task } from 'src/core/models';
import { EditItemFormComponent } from 'src/core/models/interfaces/edit-form-component.interface';
import { TaskStoreService, TranslationService } from 'src/core/services';

@Component({
  selector: 'app-edit-task-card',
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
  templateUrl: './edit-task-card.component.html',
  styleUrl: './edit-task-card.component.scss'
})
export class EditTaskCardComponent implements OnInit, OnDestroy, EditItemFormComponent {

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
    type: new FormControl('', [Validators.required]),

  });

  constructor(
    private taskStoreService: TaskStoreService,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: { isEditMode: boolean, task: Task }) {

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
    this.editForm.get('status')?.enable();  // S'assure que le champ est actif
  }

  /** 
   * Configuration spécifique au mode ajout 
   */
  private setAddMode(): void {
    this.title = this.translationService.instant('TASK_MANAGEMENT.CARD.EDIT.ADD_MODE_TITLE');
    this.editForm.get('status')?.disable();
  }



  public onSubmit(): void {
    if (this.editForm.valid) {

      const formData = this.editForm.value;

      const newTask = new Task({
        id: this.isEditMode ? this.task.id : undefined,
        title: formData.title as string,
        description: formData.description as string,
        status: this.isEditMode ? formData.status as EStatus : EStatus.PENDING,
        priority: Number(formData.priority),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        projectId: this.isEditMode ? this.task.projectId : undefined,
        type: this.isEditMode ? this.task.type : undefined
      });

      if (this.isEditMode) {
        this.taskStoreService.updateTask(newTask).
          pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      } else {
        this.taskStoreService.addNewTask(newTask)
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

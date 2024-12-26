import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ETaskStatus, Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services';

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
    MatSelectModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent {

  public title: string | undefined;
  public isEditMode: boolean;
  public task: Task;
  public editForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),

  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { isEditMode: boolean, task: Task },
    private taskService: TaskService) {

    this.task = data.task;

    if (this.task) {
      this.initTaskForm();
    }

    this.isEditMode = data.isEditMode;
    console.log();

    this.isEditMode ? this.title = 'Modifier une tâche' : this.title = 'Créer une tâche';

  }


  private initTaskForm(): void {
    this.task.title ? this.editForm.get('title')?.setValue(this.task.title) : '';
    this.task.description ? this.editForm.get('description')?.setValue(this.task.description) : '';
    this.task.priority ? this.editForm.get('priority')?.setValue(String(this.task.priority)) : '';
    this.task.dueDate ? this.editForm.get('dueDate')?.setValue(this.task.dueDate.toDateString()) : '';
  }



  public onSubmit(): void {
    console.log('form', this.editForm);
    if (this.editForm.valid) {
      // Récupérer les données du formulaire
      const formData = this.editForm.value;

      // Construire un objet Task à partir des données du formulaire
      const newTask = new Task({
        title: formData.title as string,
        description: formData.description as string,
        status: ETaskStatus.PENDING,
        priority: Number(formData.priority),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
      });

      console.log('Nouvelle tâche à créer :', newTask);

      // Appeler le service pour créer ou modifier la tâche

      this.editForm ?
        this.taskService.updateTask(newTask).subscribe() :
        this.taskService.addNewTask(newTask).subscribe();
    } else {
      console.log('Formulaire invalide');
    }

  }

}

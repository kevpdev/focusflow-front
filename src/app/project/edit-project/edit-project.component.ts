import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { Project } from 'src/core/models';
import { ProjectStoreService } from 'src/core/services';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent {
  project: Project;
  isEditMode = false;
  projectForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { project: Project; isEditMode: boolean },
    private projectStoreService: ProjectStoreService
  ) {
    this.project = data.project;
    this.isEditMode = data.isEditMode;
  }

  onSubmit(): void {
    //get values from form
    const formData = this.projectForm.value;
    const project = this.buildProject(formData);

    if (!this.isEditMode) {
      this.projectStoreService.fetchCreateProject(project).pipe(take(1)).subscribe();
    }
  }

  private buildProject(formData: Project): Project {
    return {
      id: this.isEditMode ? formData.id : undefined,
      name: formData.name,
      description: formData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Project;
  }
}

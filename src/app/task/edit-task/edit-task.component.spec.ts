import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { TaskStoreService } from '../../../core/services';
import { testProviders } from '../../app.test.config';
import { EditTaskComponent } from './edit-task.component';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;

  beforeEach(async () => {

    const data = {
      isEditMode: false,
      task: new Task({
        id: 1,
        title: "Laver le linge",
        description: "",
        user: new User({ email: 'toto@gmail.com' })
      })
    };

    await TestBed.configureTestingModule({
      imports: [EditTaskComponent],
      providers: [
        ...testProviders,
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data }
        },
        TaskStoreService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

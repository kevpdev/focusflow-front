import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

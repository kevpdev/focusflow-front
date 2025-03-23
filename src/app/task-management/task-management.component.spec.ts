import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagementComponent } from './task-management.component';

describe('TaskContainerComponent', () => {
  let component: TaskManagementComponent;
  let fixture: ComponentFixture<TaskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { TaskListCardComponent } from './task-list-card.component';

describe('TaskListCardComponent', () => {
  let component: TaskListCardComponent;
  let fixture: ComponentFixture<TaskListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListCardComponent, TranslateModule.forRoot()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

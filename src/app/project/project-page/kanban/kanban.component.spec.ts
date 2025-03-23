import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanComponent } from './kanban.component';

describe('KanbanComponent', () => {
  let component: KanbanComponent<any>;
  let fixture: ComponentFixture<KanbanComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanColumnComponent } from './kanban-column.component';

describe('KanbanColumnComponent', () => {
  let component: KanbanColumnComponent<any>;
  let fixture: ComponentFixture<KanbanColumnComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanColumnComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KanbanColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

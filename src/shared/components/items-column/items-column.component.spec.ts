import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsColumnComponent } from './items-column.component';

describe('ItemsColumnComponent', () => {
  let component: ItemsColumnComponent<any>;
  let fixture: ComponentFixture<ItemsColumnComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsColumnComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemsColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

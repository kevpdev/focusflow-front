import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListMobileComponent } from './card-list-mobile.component';

describe('CardListMobileComponent', () => {
  let component: CardListMobileComponent<any>;
  let fixture: ComponentFixture<CardListMobileComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListMobileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardListMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

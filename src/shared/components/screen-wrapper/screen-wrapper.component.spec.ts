import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenWrapperComponent } from './screen-wrapper.component';

describe('ScreenWrapperComponent', () => {
  let component: ScreenWrapperComponent<any>;
  let fixture: ComponentFixture<ScreenWrapperComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenWrapperComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScreenWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

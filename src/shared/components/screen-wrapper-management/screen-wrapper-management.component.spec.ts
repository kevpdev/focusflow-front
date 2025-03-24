import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenWrapperManagementComponent } from './screen-wrapper-management.component';

describe('ScreenWrapperComponent', () => {
  let component: ScreenWrapperManagementComponent<any>;
  let fixture: ComponentFixture<ScreenWrapperManagementComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenWrapperManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenWrapperManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

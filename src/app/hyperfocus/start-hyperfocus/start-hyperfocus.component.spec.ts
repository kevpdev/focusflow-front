import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartHyperfocusComponent } from './start-hyperfocus.component';

describe('StartHyperfocusComponent', () => {
  let component: StartHyperfocusComponent;
  let fixture: ComponentFixture<StartHyperfocusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartHyperfocusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartHyperfocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

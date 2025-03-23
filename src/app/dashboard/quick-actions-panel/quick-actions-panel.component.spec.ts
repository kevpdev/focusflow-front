import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickActionsPanelComponent } from './quick-actions-panel.component';

describe('QuickActionsPanelComponent', () => {
  let component: QuickActionsPanelComponent;
  let fixture: ComponentFixture<QuickActionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickActionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

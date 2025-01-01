import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthStoreService } from '../core/services';
import { AppComponent } from './app.component';
import { testProviders } from './app.test.config';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(async () => {



    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        AuthStoreService,
        ...testProviders,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'focusflow' title`, () => {
    expect(component.title).toEqual('focusflow');
  });
});

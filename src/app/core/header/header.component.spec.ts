import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        FontAwesomeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidenav', () => {
    // Test open sidenav
    component.isActive = false;
    fixture.detectChanges();
    component.toggleMenu();
    expect(component.isActive).toBeTruthy();
    // Test close sidenav
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.isActive).toBeFalsy();
  });
});

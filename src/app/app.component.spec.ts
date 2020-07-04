import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Mock Header Component
 */
@Component({
  selector: 'app-header',
  template: ''
})
export class MockHeaderComponent {}

/**
 * Mock Note modal component
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'note-modal',
  template: ''
})
export class MockModalComponent {}

/**
 * Mock Float buttom Component
 */
@Component({
  selector: 'app-float-btn',
  template: ''
})
export class MockFloatBtnComponent {}
let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule
      ],
      declarations: [
        AppComponent,
        MockHeaderComponent,
        MockFloatBtnComponent,
        MockModalComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have modal component defined in HTML', () => {
    const modalComponent = fixture.debugElement.query(By.css('note-modal'));
    expect(modalComponent).toBeTruthy();
  });

});

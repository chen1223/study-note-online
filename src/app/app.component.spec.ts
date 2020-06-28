import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';

/**
 * Mock Header Component
 */
@Component({
  selector: 'app-header',
  template: ''
})
export class MockHeaderComponent {}

/**
 * Mock Float buttom Component
 */
@Component({
  selector: 'app-float-btn',
  template: ''
})
export class MockFloatBtnComponent {}

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
        MockFloatBtnComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});

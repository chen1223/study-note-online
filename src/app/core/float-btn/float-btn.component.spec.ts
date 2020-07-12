import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FloatBtnComponent } from './float-btn.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: ''
})
export class MockHomeComponent {}

@Component({
  selector: 'app-new-vocab',
  template: ''
})
export class MockNewVocabComponent {}

describe('FloatBtnComponent', () => {
  let component: FloatBtnComponent;
  let fixture: ComponentFixture<FloatBtnComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FloatBtnComponent,
        MockHomeComponent,
        MockNewVocabComponent
      ],
      imports: [RouterTestingModule.withRoutes([
        {
          path: '',
          pathMatch: 'full',
          component: MockHomeComponent
        },
        {
          path: 'vocab/new',
          component: MockNewVocabComponent
        }
      ])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatBtnComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle float button', () => {
    component.isOpen = false;
    fixture.detectChanges();
    // Test open menu
    component.toggleOpen();
    fixture.detectChanges();
    expect(component.isOpen).toBeTruthy();
    // Test close menu
    component.toggleOpen();
    fixture.detectChanges();
    expect(component.isOpen).toBeFalsy();
  });

  it('should not show float button in path that include "new"', fakeAsync(() => {
    expect(component.router).toBeDefined();
    expect(component.canShow).toBeDefined();
    router.navigateByUrl('');
    tick();
    expect(component.canShow()).toBeTruthy();
    router.navigateByUrl('/vocab/new');
    tick();
    expect(component.canShow()).toBeFalsy();
  }));

  it('should bind the canShow function to action-box', fakeAsync(() => {
    router.navigateByUrl('');
    tick();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.action-box'));
    expect(el).toBeTruthy();
    router.navigateByUrl('/vocab/new');
    tick();
    fixture.detectChanges();
    const updatedEl = fixture.debugElement.query(By.css('.action-box'));
    expect(updatedEl).toBeFalsy();
  }));
});

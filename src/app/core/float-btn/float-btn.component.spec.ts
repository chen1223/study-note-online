import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FloatBtnComponent } from './float-btn.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

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
      ])],
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

  it('should define isHome', () => {
    expect(component.isHome).toBeDefined();
  });

  it('should only show float button on home page', () => {
    component.isHome = true;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.action-box'));
    expect(el).toBeTruthy();

    component.isHome = false;
    fixture.detectChanges();
    const updatedEl = fixture.debugElement.query(By.css('.action-box'));
    expect(updatedEl).toBeFalsy();
  });

  it('should close the float button on link click', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('.--vocab .link'));
    link.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.isOpen).toBeFalsy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatBtnComponent } from './float-btn.component';

describe('FloatBtnComponent', () => {
  let component: FloatBtnComponent;
  let fixture: ComponentFixture<FloatBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatBtnComponent);
    component = fixture.componentInstance;
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
});

import { MaterialModule } from './../../share/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { LoginService } from '../login-dialog/login.service';

class MockLoginService {
  loadUserData() {}
}

@Component({
  selector: 'app-login-dialog',
  template: ''
})
export class MockLoginDialogComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  let mockLoginService: LoginService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        MockLoginDialogComponent
      ],
      imports: [
        FontAwesomeModule,
        MaterialModule
      ],
      providers: [
        { provide: LoginService, useClass: MockLoginService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockLoginService = TestBed.inject(LoginService);
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

  it('should close sidenav on closeMenu called', () => {
    component.isActive = true;
    fixture.detectChanges();
    component.closeMenu();
    fixture.detectChanges();
    expect(component.isActive).toBeFalsy();
  });

  it('should call closeMenu function on menu backdrop clicked', () => {
    const el = fixture.debugElement.query(By.css('.menu-backdrop'));
    const fnc = spyOn(component, 'closeMenu').and.callFake(() => {});
    el.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });

  it('should define matDialog', () => {
    expect(component.matDialog).toBeTruthy();
    expect(component.matDialog).toBeInstanceOf(MatDialog);
  });

  // Login button related tests
  it('should define openLoginDialog function', () => {
    expect(component.openLoginDialog).toBeTruthy();
  });
  it('should call openLoginDialog on login / signup click', () => {
    component.isLogin = false;
    fixture.detectChanges();
    const el = (fixture.debugElement.query(By.css('.action-item.__login')).nativeElement) as HTMLButtonElement;
    const fnc = spyOn(component, 'openLoginDialog').and.callFake(() => {});
    el.click();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should show dialog on openLoginDialog called', () => {
    const fnc = spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openLoginDialog(new Event('click'));
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });


  /**
   * afterViewInit related tests
   */
  it('should call LoginService.loadUserData in ngAfterViewInit', () => {
    const fnc = spyOn(mockLoginService, 'loadUserData');
    component.ngAfterViewInit();
    expect(fnc).toHaveBeenCalled();
  });
});

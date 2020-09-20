import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginService } from '../login-dialog/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  isLogin = false;
  isActive = false;
  constructor(public readonly matDialog: MatDialog,
              public readonly loginService: LoginService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loginService.loadUserData();
    setTimeout(() => {
      this.setLoginStatus();
    }, 0);
  }

  setLoginStatus(): void {
    this.isLogin = this.loginService.userObj !== null;
  }

  toggleMenu() {
    this.isActive = !this.isActive;
    const body = document.querySelector('body') as HTMLBodyElement;
    if (this.isActive) {
      // Lock page from scrolling when menu is opened
      body.classList.add('--menu-opened');
    } else {
      body.classList.remove('--menu-opened');
    }
  }

  // Force close the menu
  closeMenu(): void {
    this.isActive = false;
    const body = document.querySelector('body') as HTMLBodyElement;
    body.classList.remove('--menu-opened');
  }

  // On user clicks on login / signup
  openLoginDialog(event): void {
    event.stopPropagation();
    const dialogRef = this.matDialog.open(LoginDialogComponent, {
      panelClass: 'login-panel',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isLogin = result;
      if (this.isLogin) {
        this.loginService.loadUserData();
        const userObj = this.loginService.userObj.user;
        const picKey = 'picture';
        if (!userObj[picKey]) {
          this.loginService.getPicLink(userObj.fbid);
        }
      }
      this.closeMenu();
    });
  }
}

import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogin = false;
  isActive = false;
  constructor(public readonly matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.isActive = !this.isActive;
  }

  // Force close the menu
  closeMenu(): void {
    this.isActive = false;
  }

  // On user clicks on login / signup
  openLoginDialog(): void {
    const dialogRef = this.matDialog.open(LoginDialogComponent, {
      panelClass: 'login-panel',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}

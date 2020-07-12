import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-float-btn',
  templateUrl: './float-btn.component.html',
  styleUrls: ['./float-btn.component.scss']
})
export class FloatBtnComponent implements OnInit {

  isOpen = false;
  constructor(public readonly router: Router) { }

  ngOnInit(): void {
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Determine if the float button can be shown:
   *  P.S. Hide the button if current path contains the "new" keyword
   */
  canShow(): boolean {
    const currentPath = this.router.url;
    return currentPath.indexOf('new') < 0;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-float-btn',
  templateUrl: './float-btn.component.html',
  styleUrls: ['./float-btn.component.scss']
})
export class FloatBtnComponent implements OnInit {

  isOpen = false;
  isHome = true;
  constructor(public readonly router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.isHome = this.activatedRoute.snapshot.firstChild.data.isHome ? true : false;
      }
    });
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}

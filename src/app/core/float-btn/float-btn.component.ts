import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-float-btn',
  templateUrl: './float-btn.component.html',
  styleUrls: ['./float-btn.component.scss']
})
export class FloatBtnComponent implements OnInit {

  isOpen = false;
  constructor() { }

  ngOnInit(): void {
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}

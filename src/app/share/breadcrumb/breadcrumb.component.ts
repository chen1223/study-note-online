import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbList: Array<Breadcrumb> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
export interface Breadcrumb {
  text: string;
  link: string;
}

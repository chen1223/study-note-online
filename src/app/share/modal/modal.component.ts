import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'note-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(public readonly swalTarget: SwalPortalTargets) { }

  ngOnInit(): void {
  }

}

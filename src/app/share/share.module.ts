import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SweetAlert2Module
  ],
  exports: [
    FontAwesomeModule,
    ModalComponent
  ]
})
export class ShareModule { }

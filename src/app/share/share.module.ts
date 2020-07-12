import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ModalComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SweetAlert2Module,
    RouterModule
  ],
  exports: [
    FontAwesomeModule,
    ModalComponent,
    BreadcrumbComponent
  ]
})
export class ShareModule { }

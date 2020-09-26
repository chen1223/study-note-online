import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';



@NgModule({
  declarations: [
    ModalComponent,
    BreadcrumbComponent,
    LoadingDialogComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SweetAlert2Module,
    RouterModule,
    MatDialogModule
  ],
  entryComponents: [
    LoadingDialogComponent
  ],
  exports: [
    FontAwesomeModule,
    ModalComponent,
    BreadcrumbComponent
  ]
})
export class ShareModule { }

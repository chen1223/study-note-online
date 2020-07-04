import { CoreRoutingModule } from './core-routing.module';
import { ShareModule } from './../share/share.module';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatBtnComponent } from './float-btn/float-btn.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../share/material.module';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FloatBtnComponent,
    HomeComponent,
    LoginDialogComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    ShareModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    FloatBtnComponent
  ],
  entryComponents: [
    LoginDialogComponent
  ]
})
export class CoreModule { }

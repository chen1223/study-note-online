import { ShareModule } from './../share/share.module';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatBtnComponent } from './float-btn/float-btn.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FloatBtnComponent
  ],
  imports: [
    CommonModule,
    ShareModule
  ],
  exports: [
    HeaderComponent,
    FloatBtnComponent
  ]
})
export class CoreModule { }

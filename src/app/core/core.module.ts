import { CoreRoutingModule } from './core-routing.module';
import { ShareModule } from './../share/share.module';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatBtnComponent } from './float-btn/float-btn.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FloatBtnComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    ShareModule
  ],
  exports: [
    HeaderComponent,
    FloatBtnComponent
  ]
})
export class CoreModule { }

import { MaterialModule } from './../share/material.module';
import { ShareModule } from './../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VocabRoutingModule } from './vocab-routing.module';
import { VocabDetailComponent } from './vocab-detail/vocab-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexCardComponent } from './vocab-detail/index-card/index-card.component';


@NgModule({
  declarations: [
    VocabDetailComponent,
    IndexCardComponent
  ],
  imports: [
    CommonModule,
    VocabRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class VocabModule { }

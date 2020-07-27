import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { MaterialModule } from './../share/material.module';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { ShareModule } from '../share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [NoteDetailComponent],
  imports: [
  CommonModule,
    NoteRoutingModule,
    MaterialModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NoteModule { }

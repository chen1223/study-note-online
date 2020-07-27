import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteDetailComponent } from './note-detail/note-detail.component';


const routes: Routes = [
  {
    path: 'new',
    component: NoteDetailComponent,
    data: {
      mode: 'create'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule { }

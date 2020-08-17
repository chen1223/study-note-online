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
  },
  {
    path: 'view/:id',
    component: NoteDetailComponent,
    data: {
      mode: 'view'
    }
  },
  {
    path: 'update/:id',
    component: NoteDetailComponent,
    data: {
      mode: 'update'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule { }

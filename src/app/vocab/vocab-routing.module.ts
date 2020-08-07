import { VocabDetailComponent } from './vocab-detail/vocab-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'new',
    component: VocabDetailComponent,
    data: {
      mode: 'create'
    }
  },
  {
    path: 'view/:id',
    component: VocabDetailComponent,
    data: {
      mode: 'view'
    }
  },
  {
    path: 'update/:id',
    component: VocabDetailComponent,
    data: {
      mode: 'update'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VocabRoutingModule { }

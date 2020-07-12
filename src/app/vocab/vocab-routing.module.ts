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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VocabRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    data: {
      isHome: true
    },
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
  },
  {
    path: 'vocab',
    loadChildren: () => import('./vocab/vocab.module').then(m => m.VocabModule)
  },
  {
    path: 'note',
    loadChildren: () => import('./note/note.module').then(m => m.NoteModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

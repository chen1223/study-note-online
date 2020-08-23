import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  dummyProfile = {
    id: 1,
    name: 'Bill Chen',
    username: 'billchen',
    profilePic: 'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60',
    followers: 13,
    followings: 12,
    totalVocabs: 10,
    totalNotes: 10,
    totalBooks: 10,
    vocabs: [
      {
        id: 1,
        title: 'Fruta'
      },
      {
        id: 2,
        title: 'Technología'
      },
      {
        id: 3,
        title: 'Comida'
      },
      {
        id: 4,
        title: 'Edificío'
      }
    ],
    notes: [
      {
        id: 1,
        title: '123'
      },
      {
        id: 2,
        title: '234'
      },
      {
        id: 3,
        title: '345'
      },
      {
        id: 4,
        title: 'asd'
      }
    ],
    books: [
      {
        id: 1,
        title: 'Book1'
      },
      {
        id: 2,
        title: 'Book2'
      },
      {
        id: 3,
        title: 'Book3'
      },
      {
        id: 4,
        title: 'Book4'
      }
    ]
  };

  constructor() { }

  /**
   * Get a single profile detail
   */
  getProfile(id: string): Observable<object> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          data: this.dummyProfile
        });
        observer.complete();
      }, 50);
    });
  }
}

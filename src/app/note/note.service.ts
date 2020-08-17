import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  dummyNote = {
    id: 1,
    publishedDate: '2020/06/13',
    likes: 103,
    saves: 50,
    author: {
      name: 'Bill Chen',
      username: 'billchen',
      profilePic: 'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60'
    },
    title: 'test note',
    note: '<p>asdf <strong>zxcv</strong> <span style="color: rgb(73, 201, 221);">asdfasdfasdf</span></p>'
  };

  constructor() { }

  /**
   * Get single note data
   */
  getNote(id): Observable<object> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          data: this.dummyNote
        });
        observer.complete();
      }, 50);
    });
  }
}

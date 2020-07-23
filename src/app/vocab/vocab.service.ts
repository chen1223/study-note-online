import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VocabService {

  constructor(public readonly http: HttpClient) { }

  postVocab(body): Observable<object> {
    console.log('postVocab called');
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({});
        observer.complete();
      }, 50);
    });
  }

  patchVocab(body): Observable<object> {
    console.log('patchVocab called');
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({});
        observer.complete();
      }, 50);
    });
  }
}

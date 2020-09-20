import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../share/api.model';

@Injectable({
  providedIn: 'root'
})
export class VocabService {


  dummyVocabPack = {
    id: 1,
    title: 'Test vocab title',
    publishedDate: '2020/06/13',
    likes: 103,
    saves: 50,
    author: {
      name: 'Bill Chen',
      username: 'billchen',
      profilePic: 'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60'
    },
    vocabs: [
      {
        vocab: 'micronda',
        desc: 'noun. microwave'
      },
      {
        vocab: 'televición',
        desc: 'noun. television'
      },
      {
        vocab: 'ordenador',
        desc: 'noun. computer'
      },
      {
        vocab: 'patalla',
        desc: 'noun. monitor'
      },
      {
        vocab: 'batería',
        desc: 'noun. battary'
      }
    ]
  };

  constructor(public readonly http: HttpClient) { }

  /**
   * Get single vocab pack
   */
  getVocabPack(id): Observable<object> {
    const url = `${API.VOCABS}/${id}`;
    return this.http.get(url);
  }

  postVocab(body): Observable<object> {
    const url = API.VOCABS;
    return this.http.post(url, body);
  }

  patchVocab(id, body): Observable<object> {
    const url = `${API.VOCABS}/${id}`;
    return this.http.patch(url, body);
  }
}

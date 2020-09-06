import { Injectable } from '@angular/core';
import { API } from '../../share/api.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // User data object
  userObj = null;

  constructor(private http: HttpClient) { }

  // Login
  login(fbid, email, name): Observable<object> {
    const body = {
      fbid,
      email,
      name
    };
    return this.http.post(API.LOGIN, body);
  }

  // Load user data from localStorage
  loadUserData(): void {
    const data = localStorage.getItem('userObj');
    this.userObj = data ? JSON.parse(data) : null;
  }

  // Clear user data
  clearUserData(): void {
    this.userObj = null;
    localStorage.clear();
  }
}

import { Injectable } from '@angular/core';
import { API } from '../../share/api.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var FB;

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

  // Update user's profile picture
  updatePicture(pictureData): Observable<object> {
    const body = {
      picture: pictureData
    };
    return this.http.put(API.USERS_PIC, body);
  }

  getPicLink(id) {
    FB.api(`${id}/picture?type=large`, 'GET', {
      redirect: false,
      width: '300',
      height: '300'
    }, (response) => {
      const picLink = response.data.url;
      this.updateUserPic(picLink);
    })
  }

  updateUserPic(picLink): void {
    this.updatePicture(picLink)
        .subscribe(res => {
          console.log('update picture response', res);
        });
  }
}

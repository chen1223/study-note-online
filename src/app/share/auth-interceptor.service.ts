import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../core/login-dialog/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('login') === -1 && this.loginService.userObj) {
      const authReq = req.clone({ setHeaders: {
        Authorization: `Bearer ${this.loginService.userObj.token}`,
        'Content-Type': 'application/json'
      } });
      return this.handleResponse(next.handle(authReq));
    }
    return this.handleResponse(next.handle(req));
  }

  handleResponse(stream): Observable<HttpEvent<any>> {
    return stream.pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.loginService.clearUserData();
          return throwError(error);
        } else {
          return throwError(error);
        }
      })
    );
  }
}

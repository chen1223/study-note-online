import { API_ENDPOINT } from './../../environments/environment';
import { TestBed } from '@angular/core/testing';

import { AuthInterceptorService } from './auth-interceptor.service';
import { LoginService } from '../core/login-dialog/login.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { VocabService } from '../vocab/vocab.service';

class MockLoginService {
  userObj = {
    token: 'test token'
  };
}

describe('AuthInterceptorService', () => {
  let service: AuthInterceptorService;
  let loginService: LoginService;
  let httpMock: HttpTestingController;
  let vocabService: VocabService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: HttpClient },
        { provide: LoginService, useClass: MockLoginService },
        { provide: VocabService },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
      ]
    });
    service = TestBed.inject(AuthInterceptorService);
    httpMock = TestBed.inject(HttpTestingController);
    loginService = TestBed.inject(LoginService);
    vocabService = TestBed.inject(VocabService);
    http = TestBed.inject(HttpClient);
  });
});

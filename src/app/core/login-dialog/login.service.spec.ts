import { TestBed, fakeAsync } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { API } from '../../share/api.model';
import { HttpClient } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    localStorage.clear();
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should define login function', () => {
    expect(service.login).toBeDefined();
  });
  it('should send POST request to login endpoint when login is called', fakeAsync(() => {
    const mockFbid = '123';
    const mockEmail = 'email';
    const mockName = 'name';
    service.login(mockFbid, mockEmail, mockName)
           .subscribe(
             res => {
               const mockRequest = httpMock.expectOne(API.LOGIN);
               expect(mockRequest.request.method).toBe('POST');
             }
           );
  }));
  it('should pass fbid, email, and name as body to the login API', fakeAsync(() => {
    const mockFbid = '123';
    const mockEmail = 'email';
    const mockName = 'name';
    const fnc = spyOn(http, 'post');
    service.login(mockFbid, mockEmail, mockName);
    const mockBody = {
      fbid: mockFbid,
      email: mockEmail,
      name: mockName
    };
    expect(fnc).toHaveBeenCalledWith(API.LOGIN, mockBody);
  }));

  /**
   * loadUserData related tests
   */
  it('should define userObj property', () => {
    expect(service.userObj).toBeDefined();
  });
  it('should define loadUserData function', () => {
    expect(service.loadUserData).toBeDefined();
  });
  it('should store user data from localStorage to userObj when loadUserData is called', () => {
    const mockUserData = {
      token: '123',
      user: {
        fbid: '123',
        email: 'test@gmail.com',
        name: 'John Doe',
        username: 'johnDoe1'
      }
    };
    service.userObj = null;
    localStorage.setItem('userObj', JSON.stringify(mockUserData));
    service.loadUserData();
    expect(service.userObj).toEqual(mockUserData);
  });

  /**
   * clearUserData related tests
   */
  it('should define clearUserData function', () => {
    expect(service.clearUserData).toBeDefined();
  });
  it('should set userObj to null on clearUserData called', () => {
    service.userObj = 3;
    service.clearUserData();
    expect(service.userObj).toBeNull();
  });
  it('should clear localStorage on clearUserData called', () => {
    const fnc = spyOn(localStorage, 'clear');
    service.clearUserData();
    expect(fnc).toHaveBeenCalled();
  });
});

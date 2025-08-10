/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { AuthServiceService } from './auth-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

describe('AuthServiceService', () => {
  let service: AuthServiceService;
  let httpMock: HttpTestingController;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  const tokenPayload = {
    exp: Math.floor(Date.now() / 1000) + 60, 
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'company',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': 'user123',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'John Doe'
  };
  const fakeToken =
    'header.' + btoa(JSON.stringify(tokenPayload)) + '.signature';

  beforeEach(() => {
    mockToastr = jasmine.createSpyObj('ToastrService', ['info', 'success', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthServiceService,
        { provide: ToastrService, useValue: mockToastr }
      ]
    });

    service = TestBed.inject(AuthServiceService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login, store token, and update status', () => {
    service.login('test@example.com', 'password123').subscribe();

    const req = httpMock.expectOne(`${environment.api}/Account/login`);
    expect(req.request.method).toBe('POST');

    req.flush({ data: { token: fakeToken } });

    expect(localStorage.getItem('token')).toBe(fakeToken);
    expect(service.isUserLoggedIn).toBeTrue();
  });

  it('should logout and clear token', () => {
    localStorage.setItem('token', fakeToken);
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockToastr.info).toHaveBeenCalledWith('Please log in again to your account');
  });

  it('should detect expired token', () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 10 };
    const expiredToken = 'h.' + btoa(JSON.stringify(expiredPayload)) + '.s';
    localStorage.setItem('token', expiredToken);
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('should detect valid token', () => {
    localStorage.setItem('token', fakeToken);
    expect(service.isTokenExpired()).toBeFalse();
  });

  it('should return correct role from token', () => {
    localStorage.setItem('token', fakeToken);
    expect(service.isRole('Admin')).toBeTrue();
    expect(service.isRole('User')).toBeFalse();
  });

  it('should return username from token', () => {
    localStorage.setItem('token', fakeToken);
    expect(service.getUsernameFromToken()).toBe('John Doe');
  });

  it('should return nameIdentifier from token', () => {
    localStorage.setItem('token', fakeToken);
    expect(service.getNameIdentifier()).toBe('user123');
  });

  it('should get headers with token', () => {
    localStorage.setItem('token', fakeToken);
    const headers = service.getHeaders();
    expect(headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
  });
});

import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('stores authentication state after successful login', () => {
    let isLogged = false;
    service.IsLogged.subscribe(value => isLogged = value);

    service.login({ email: 'user@example.local', password: 'Password-Aa1!' }).subscribe();

    const request = http.expectOne(candidate => candidate.url.endsWith('api/auth/login'));
    expect(request.request.method).toBe('POST');
    request.flush({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer'
    });

    expect(sessionStorage.getItem('token')).toBe('access-token');
    expect(sessionStorage.getItem('login')).toBe('user@example.local');
    expect(service.UserInfo).toBe('user@example.local');
    expect(isLogged).toBe(true);
  });

  it('clears authentication state on logout', () => {
    sessionStorage.setItem('token', 'access-token');
    sessionStorage.setItem('login', 'user@example.local');

    service.logout();

    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('login')).toBeNull();
    expect(service.UserInfo).toBe('');
  });
});

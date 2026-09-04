import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  const router = { navigate: vi.fn() };

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    router.navigate.mockReset();
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('adds the bearer token to requests', () => {
    sessionStorage.setItem('token', 'access-token');

    httpClient.get('/api/test').subscribe();

    const request = http.expectOne('/api/test');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({});
  });

  it('clears the session after a 401 response', () => {
    sessionStorage.setItem('token', 'expired-token');
    sessionStorage.setItem('login', 'user@example.local');

    httpClient.get('/api/test').subscribe({ error: () => undefined });
    http.expectOne('/api/test').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('login')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

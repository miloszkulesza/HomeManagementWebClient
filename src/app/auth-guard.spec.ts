import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthGuard } from './auth-guard';
import { AuthService } from './core/auth/auth-service';

describe('AuthGuard', () => {
  const isLogged = new BehaviorSubject(false);

  beforeEach(() => {
    isLogged.next(false);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { IsLogged: isLogged.asObservable() } }
      ]
    });
  });

  it('redirects unauthenticated users and preserves the requested URL', async () => {
    const guard = TestBed.inject(AuthGuard);
    const router = TestBed.inject(Router);

    const result = await firstValueFrom(guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/tasks' } as RouterStateSnapshot
    ));

    expect(result).not.toBe(true);
    expect(router.serializeUrl(result as ReturnType<Router['createUrlTree']>))
      .toBe('/login?returnUrl=%2Ftasks');
  });

  it('allows authenticated users', async () => {
    isLogged.next(true);
    const guard = TestBed.inject(AuthGuard);

    const result = await firstValueFrom(guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/calendar' } as RouterStateSnapshot
    ));

    expect(result).toBe(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth } from './auth';
import { AuthService } from './auth-service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;
  const authService = {
    login: vi.fn()
  };
  const router = {
    navigateByUrl: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({ returnUrl: '/tasks' }) } }
        },
        provideNoopAnimations(),
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService.login.mockReset();
    router.navigateByUrl.mockReset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the required message for an empty password', () => {
    component.loginForm.controls.password.markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hasło jest wymagane');
  });

  it('returns to the guarded URL after login', () => {
    authService.login.mockReturnValue(of({
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
      tokenType: 'Bearer'
    }));
    component.loginForm.setValue({
      email: 'user@example.local',
      password: 'Password-Aa1!'
    });

    component.login();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/tasks');
  });
});

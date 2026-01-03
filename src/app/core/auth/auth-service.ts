import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginInterface } from '../interface/auth/login-interface';
import { LoginResponseInterface } from '../interface/auth/login-response-interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private url = `${environment.homeManagementServiceUrl}api/auth/`;
  private isLogged$ = new BehaviorSubject<boolean>(false);
  private userLogin$ = new BehaviorSubject<string>('');
  private http = inject(HttpClient);

  constructor() {
      this.userLogin$.next(sessionStorage.getItem('login'));
      if (this.userLogin$.getValue())
      {
        this.isLogged$.next(true);
      }
  }

  get UserInfo(): string {
      return this.userLogin$.getValue();
  }

  get IsLogged(): Observable<boolean> {
      return this.isLogged$.asObservable();
  }

  logout(): void {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('login');
      this.userLogin$.next('');
      this.isLogged$.next(false);
  }

  login(data: LoginInterface): Observable<LoginResponseInterface> {
    return this.http.post<any>(`${this.url}login`, data).pipe(tap(res => {
        this.userLogin$.next(data.email);
        this.isLogged$.next(true);
    }));
  }
}

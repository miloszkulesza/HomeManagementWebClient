import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginInterface } from '../interface/login-interface';
import { LoginResponseInterface } from '../interface/login-response-interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private url = `${environment.homeManagementServiceUrl}api/auth/`;
  private isLogged$ = new BehaviorSubject<boolean>(false);
  private userLogin$ = new BehaviorSubject<string>('');
  private http = inject(HttpClient);

  get UserInfo(): string {
      return this.userLogin$.getValue();
  }

  get IsLogged(): Observable<boolean> {
      return this.isLogged$.asObservable();
  }

  logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('login');
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

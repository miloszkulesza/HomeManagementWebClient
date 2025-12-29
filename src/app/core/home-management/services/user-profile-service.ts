import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationUserInterface } from '../../interface/application-users-interface';
import { Observable } from 'rxjs';
import { ApplicationUserUpdateInterface } from '../../interface/application-user-update-interface';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private urlAdmin = `${environment.homeManagementServiceUrl}api/Admin`;
  private http = inject(HttpClient);

  private createTokenHeader(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  public getCurrentUserInfo(): Observable<ApplicationUserInterface> {
    const headers = this.createTokenHeader();
    const email = sessionStorage.getItem('login');
    return this.http.get<ApplicationUserInterface>(`${this.urlAdmin}/Users/${email}`, { headers });
  }

  public updateUserProfile(id: string, request: ApplicationUserUpdateInterface): Observable<ApplicationUserInterface> {
    const headers = this.createTokenHeader();
    return this.http.put<ApplicationUserInterface>(`${this.urlAdmin}/Users/${id}`, request, { headers });
  }
}

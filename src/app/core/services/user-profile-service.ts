import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApplicationUserInterface } from '../interface/application-user/application-users-interface';
import { Observable } from 'rxjs';
import { ApplicationUserUpdateInterface } from '../interface/application-user/application-user-update-interface';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private url = `${environment.homeManagementServiceUrl}api/Profile/me`;
  private http = inject(HttpClient);

  public getCurrentUserInfo(): Observable<ApplicationUserInterface> {
    return this.http.get<ApplicationUserInterface>(this.url);
  }

  public updateUserProfile(request: ApplicationUserUpdateInterface): Observable<ApplicationUserInterface> {
    return this.http.put<ApplicationUserInterface>(this.url, request);
  }

  public getHouseholdUsers(): Observable<ApplicationUserInterface[]> {
    return this.http.get<ApplicationUserInterface[]>(`${environment.homeManagementServiceUrl}api/Profile/users`);
  }
}

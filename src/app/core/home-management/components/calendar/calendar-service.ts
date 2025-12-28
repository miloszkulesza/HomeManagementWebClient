import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarEventInterface } from '../../../interface/calendar-event-interface';
import { ApplicationUserInterface } from '../../../interface/application-users-interface';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private url = `${environment.homeManagementServiceUrl}api/CalendarEvent`;
  private urlAdmin = `${environment.homeManagementServiceUrl}api/Admin`;
  private http = inject(HttpClient);

  private createTokenHeader(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  public getCalendarEvents(): Observable<CalendarEventInterface[]> {
    const headers = this.createTokenHeader();
    return this.http.get<CalendarEventInterface[]>(`${this.url}`, { headers }).pipe(map(events => events.map(e =>({
      ...e,
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate)
    }))));
  }

  public getCurrentUserInfo(): Observable<ApplicationUserInterface> {
    const headers = this.createTokenHeader();
    const email = sessionStorage.getItem('login');
    return this.http.get<ApplicationUserInterface>(`${this.urlAdmin}/Users/${email}`, { headers });
  }
}

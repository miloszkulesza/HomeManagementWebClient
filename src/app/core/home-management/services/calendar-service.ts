import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarEventInterface } from '../../interface/calendar-event-interface';
import { ApplicationUserInterface } from '../../interface/application-users-interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private url = `${environment.homeManagementServiceUrl}api/CalendarEvent`;
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
}

import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarEventInterface } from '../interface/calendar/calendar-event-interface';
import { environment } from '../../../environments/environment.development';
import { CalendarEventUpdateInterface } from '../interface/calendar/calendar-event-update-interface';

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

  public deleteCalendarEvent(id: string): Observable<any> {
    const headers = this.createTokenHeader();
    return this.http.delete<any>(`${this.url}/${id}`, { headers });
  }

  public putCalendarEvent(id: string, body: CalendarEventUpdateInterface): Observable<CalendarEventInterface> {
    const headers = this.createTokenHeader();
    return this.http.put<CalendarEventInterface>(`${this.url}/${id}`, body, { headers });
  }

  public postCalendarEvent(body: CalendarEventUpdateInterface): Observable<CalendarEventInterface> {
    const headers = this.createTokenHeader();
    return this.http.post<CalendarEventInterface>(`${this.url}`, body, { headers });
  }
}

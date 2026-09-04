import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CalendarEventInterface } from '../interface/calendar/calendar-event-interface';
import { environment } from '../../../environments/environment';
import { CalendarEventUpdateInterface } from '../interface/calendar/calendar-event-update-interface';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private url = `${environment.homeManagementServiceUrl}api/CalendarEvent`;
  private http = inject(HttpClient);

  public getCalendarEvents(): Observable<CalendarEventInterface[]> {
    return this.http.get<CalendarEventInterface[]>(`${this.url}`).pipe(map(events => events.map(e =>({
      ...e,
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate)
    }))));
  }

  public deleteCalendarEvent(id: string): Observable<any> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  public putCalendarEvent(id: string, body: CalendarEventUpdateInterface): Observable<CalendarEventInterface> {
    return this.http.put<CalendarEventInterface>(`${this.url}/${id}`, body);
  }

  public postCalendarEvent(body: CalendarEventUpdateInterface): Observable<CalendarEventInterface> {
    return this.http.post<CalendarEventInterface>(`${this.url}`, body);
  }
}

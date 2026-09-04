import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkItemInterface } from '../interface/work-item/work-item-interface';
import { WorkItemRequestInterface } from '../interface/work-item/work-item-request-interface';

@Injectable({ providedIn: 'root' })
export class WorkItemService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.homeManagementServiceUrl}api/WorkItem`;

  getAll(): Observable<WorkItemInterface[]> {
    return this.http.get<WorkItemInterface[]>(this.url);
  }

  create(request: WorkItemRequestInterface): Observable<WorkItemInterface> {
    return this.http.post<WorkItemInterface>(this.url, request);
  }

  update(id: string, request: WorkItemRequestInterface): Observable<WorkItemInterface> {
    return this.http.put<WorkItemInterface>(`${this.url}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  deleteDone(): Observable<void> {
    return this.http.delete<void>(`${this.url}/done`);
  }
}

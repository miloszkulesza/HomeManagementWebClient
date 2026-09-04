import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WorkItemService } from './work-item-service';

describe('WorkItemService', () => {
  let service: WorkItemService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WorkItemService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should load the household task list', () => {
    service.getAll().subscribe(items => expect(items).toEqual([]));

    const request = http.expectOne(candidate => candidate.url.endsWith('api/WorkItem'));
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should create a task', () => {
    const body = {
      title: 'Zadanie',
      priority: true,
      isDone: false,
      assignedToUserId: 'user-id'
    };

    service.create(body).subscribe(item => expect(item.title).toBe('Zadanie'));

    const request = http.expectOne(candidate => candidate.url.endsWith('api/WorkItem'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush({ id: 'task-id', ...body });
  });

  it('should update a task', () => {
    const body = {
      title: 'Zmienione zadanie',
      priority: false,
      isDone: true,
      assignedToUserId: 'user-id'
    };

    service.update('task-id', body).subscribe(item => expect(item.isDone).toBe(true));

    const request = http.expectOne(candidate => candidate.url.endsWith('api/WorkItem/task-id'));
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(body);
    request.flush({ id: 'task-id', ...body });
  });

  it('should delete a task', () => {
    service.delete('task-id').subscribe();

    const request = http.expectOne(candidate => candidate.url.endsWith('api/WorkItem/task-id'));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should delete all completed tasks', () => {
    service.deleteDone().subscribe();

    const request = http.expectOne(candidate => candidate.url.endsWith('api/WorkItem/done'));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});

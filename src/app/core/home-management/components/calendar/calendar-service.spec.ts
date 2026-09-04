import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CalendarService } from '../../../services/calendar-service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

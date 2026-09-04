import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendar } from './calendar';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendar],
      providers: [provideHttpClient(), MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the user color in FullCalendar extended properties after save', () => {
    component.events = [];

    component.onEditDialogSave({
      id: 'event-id',
      title: 'Wydarzenie',
      start: new Date('2030-01-01T10:00:00Z'),
      end: new Date('2030-01-01T11:00:00Z'),
      userId: 'user-id',
      userEmail: 'user@example.local',
      calendarEventBackgroundColor: '#123456'
    });

    const savedEvents = component.calendarOptions.events as Array<{
      extendedProps?: Record<string, unknown>
    }>;
    expect(savedEvents[0].extendedProps?.['calendarEventBackgroundColor']).toBe('#123456');
  });
});

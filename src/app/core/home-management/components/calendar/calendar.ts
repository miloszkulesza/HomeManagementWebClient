import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { CardModule } from 'primeng/card';
import plLocale from '@fullcalendar/core/locales/pl';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { CalendarService } from './calendar-service';
import { ApplicationUserInterface } from '../../../interface/application-users-interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule,
    FullCalendarModule,
    CardModule,
    Popover,
    ButtonModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {
  @ViewChild('eventPopover') eventPopover!: Popover;
  calendarService = inject(CalendarService);

  selectedEvent: any;
  events: EventInput[] = null;
  currentUser: ApplicationUserInterface = null;

  ngOnInit() {
    forkJoin({
      user: this.calendarService.getCurrentUserInfo(),
      events: this.calendarService.getCalendarEvents()
    }).subscribe(({ user, events }) => {
      this.currentUser = user;
      this.events = events.map(e => ({
        id: e.id,
        title: e.title,
        start: e.startDate,
        end: e.endDate,
        editable: true,
        extendedProps: { priority: 'high' },
        backgroundColor: this.currentUser.calendarEventBackgroundColor,
        borderColor: this.currentUser.calendarEventBackgroundColor,
        userEmail: e.userEmail
      }));
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    editable: true,
    selectable: true,
    contentHeight: 'auto',
    plugins: [dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      interactionPlugin],
    locale: plLocale,
    initialDate: new Date(),
    views: {
      dayGridMonth: { buttonText: 'Miesiąc' },
      timeGridWeek: { buttonText: 'Tydzień' },
      timeGridDay: { buttonText: 'Dzień' },
      listWeek: { buttonText: 'Lista' },
      multiMonthYear: { buttonText: 'Rok' },
    },
     footerToolbar: {
      left: 'prevYear',
      center: '',
      right: 'nextYear',
    },
    nowIndicator: true,
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    slotDuration: '00:30:00',
    snapDuration: '00:15:00',
    allDaySlot: true,
    expandRows: true,
    height: 'auto',
    selectMirror: true,
    droppable: true,
    eventResizableFromStart: true,
    eventStartEditable: true,
    eventDurationEditable: true,
    longPressDelay: 500,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    datesSet: this.handleDatesSet.bind(this),
    events: this.events,
    eventColor: '#1976d2',
    eventTextColor: '#fff',
    eventBorderColor: '#0d47a1',
    eventDisplay: 'block',
    dayMaxEvents: true,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    lazyFetching: true,
    progressiveEventRendering: true,
    rerenderDelay: 10
  };

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Nazwa wydarzenia');
    if (title) {
      this.events = [
        ...this.events,
        {
          title,
          start: selectInfo.start,
          end: selectInfo.end,
          allDay: selectInfo.allDay,
        },
      ];
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();
    if (this.eventPopover) {
      this.eventPopover.hide();
    }
    this.selectedEvent = {
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      userEmail: clickInfo.event.extendedProps['userEmail']
    };
    this.eventPopover.show(clickInfo.jsEvent, clickInfo.el);
  }

  handleDatesSet() {
    this.eventPopover?.hide();
  }

  handleEventDrop(info: any) {
    console.log('Przeniesiono event:', info.event);
  }

  handleEventResize(info: any) {
    console.log('Zmieniono rozmiar:', info.event);
  }
}

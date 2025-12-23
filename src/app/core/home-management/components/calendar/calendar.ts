import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { CardModule } from 'primeng/card';
import plLocale from '@fullcalendar/core/locales/pl';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule,
    FullCalendarModule,
    CardModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar {
  events: EventInput[] = [
    {
      id: '1',
      title: 'Spotkanie zespołu',
      start: new Date(),
      editable: true,
      extendedProps: {
        priority: 'high',
      },
      backgroundColor: '#ff0000',
      borderColor: '#ff0000'
    },
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthYear',
    },
    editable: true,
    selectable: true,
    contentHeight: 'auto',
    plugins: [dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      interactionPlugin,
      multiMonthPlugin,
      resourceTimeGridPlugin,
      resourceDayGridPlugin],
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
    datesSet: info => console.log('Zakres:', info),
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
    rerenderDelay: 10,
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
    if (confirm(`Usunąć "${clickInfo.event.title}"?`)) {
      clickInfo.event.remove();
    }
  }

  handleEventDrop(info: any) {
    console.log('Przeniesiono event:', info.event);
  }

  handleEventResize(info: any) {
    console.log('Zmieniono rozmiar:', info.event);
  }
}

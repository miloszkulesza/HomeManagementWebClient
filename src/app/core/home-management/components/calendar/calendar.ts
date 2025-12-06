import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CardModule } from 'primeng/card';
import plLocale from '@fullcalendar/core/locales/pl';

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
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    contentHeight: 'auto',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [
      { title: 'event 1', date: '2025-12-06' },
      { title: 'event 2', date: '2025-12-06' }
    ],
    locale: plLocale,
  };
}

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
import { ApplicationUserInterface } from '../../../interface/application-user/application-users-interface';
import { forkJoin } from 'rxjs';
import { CalendarService } from '../../../services/calendar-service';
import { UserProfileService } from '../../../services/user-profile-service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarEventFullCalendarInterface } from '../../../interface/calendar/calendar-event-full-calendar-interface';
import { EditEventDialog } from './dialogs/edit-event-dialog/edit-event-dialog';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule,
    FullCalendarModule,
    CardModule,
    Popover,
    ButtonModule,
    ConfirmDialog,
    EditEventDialog
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  providers: [ConfirmationService]
})
export class Calendar implements OnInit {
  @ViewChild('eventPopover') eventPopover!: Popover;
  @ViewChild('editDialog') editDialog!: EditEventDialog;
  @ViewChild('fullcalendar') fullcalendar!: any;
  readonly calendarService = inject(CalendarService);
  readonly userProfileService = inject(UserProfileService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);

  selectedEvent: CalendarEventFullCalendarInterface;
  events: EventInput[] = null;
  currentUser: ApplicationUserInterface = null;
  dialogEvent!: CalendarEventFullCalendarInterface;

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    forkJoin({
      user: this.userProfileService.getCurrentUserInfo(),
      events: this.calendarService.getCalendarEvents()
    }).subscribe(({ user, events }) => {
      this.currentUser = user;
      this.events = events.map(e => ({
        id: e.id,
        title: e.title,
        start: e.startDate,
        end: e.endDate,
        editable: true,
        extendedProps: {
          userId: e.userId,
          userEmail: e.userEmail,
          calendarEventBackgroundColor: e.calendarEventBackgroundColor
        },
        backgroundColor: e.calendarEventBackgroundColor,
        borderColor: e.calendarEventBackgroundColor,
        userEmail: e.userEmail
      }));
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: `W czasie pobierania danych wystąpił błąd.` });
    });
  }

  calendarOptions: CalendarOptions = {
    timeZone: 'local',
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
    this.dialogEvent = {
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      userEmail: this.currentUser?.email,
      id: null,
      userId: this.currentUser?.id,
      calendarEventBackgroundColor: this.currentUser?.calendarEventBackgroundColor
    };
    this.editDialog.showDialog(this.dialogEvent);
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
      userEmail: clickInfo.event.extendedProps['userEmail'],
      id: clickInfo.event.id,
      userId: clickInfo.event.extendedProps['userId'],
      calendarEventBackgroundColor: clickInfo.event.extendedProps['calendarEventBackgroundColor']
    };
    this.eventPopover.show(clickInfo.jsEvent, clickInfo.el);
  }

  handleDatesSet() {
    this.eventPopover?.hide();
  }

  handleEventDrop(info: any) {
    this.persistCalendarChange(info);
  }

  handleEventResize(info: any) {
    this.persistCalendarChange(info);
  }

  onDeleteClick(event: Event) {
    this.eventPopover.hide();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Czy na pewno chcesz usunąć wydarzenie?',
      header: 'Usuń wydarzenie',
      closable: true,
      closeOnEscape: true,
      icon: "pi pi-trash",
      rejectButtonProps: {
        label: 'Anuluj',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Usuń',
        severity: 'danger',
      },
      accept: () => {
        this.calendarService.deleteCalendarEvent(this.selectedEvent.id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Sukces', detail: `Wydarzenie '${this.selectedEvent.title}' zostało usunięte` });
          const eventIndex = this.events.findIndex(e => e.id === this.selectedEvent.id);
          if (eventIndex !== -1)
            this.events.splice(eventIndex, 1);
          this.calendarOptions = {
            ...this.calendarOptions,
            events: [...this.events]
          };
        }, err => {
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: `W czasie usuwania wydarzenia wystąpił błąd. ${err.message}` });
        });
      },
    })
  }

  onEditClick() {
    this.eventPopover.hide();
    this.dialogEvent = this.selectedEvent;
    this.editDialog.showDialog(this.dialogEvent);
  }

  onEditDialogSave(event: CalendarEventFullCalendarInterface) {
    const eventInput: EventInput = {
      id: event.id,
      start: new Date(event.start),
      end: new Date(event.end),
      title: event.title,
      editable: true,
      extendedProps: {
        userEmail: event.userEmail,
        userId: event.userId,
        calendarEventBackgroundColor: event.calendarEventBackgroundColor
      },
      backgroundColor: event.calendarEventBackgroundColor,
      borderColor: event.calendarEventBackgroundColor
    }
    const eventIndex = this.events.findIndex(e => e.id === eventInput.id);
    if (eventIndex !== -1)
      this.events[eventIndex] = eventInput;
    else
      this.events.push(eventInput);
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.events]
    };
    this.selectedEvent = null;
    this.dialogEvent = null;
  }

  onEditDialogCancel() {
    this.selectedEvent = null;
    this.dialogEvent = null;
  }

  private persistCalendarChange(info: any) {
    const event = info.event;
    if (!event.end) {
      info.revert();
      return;
    }

    this.calendarService.putCalendarEvent(event.id, {
      title: event.title,
      startDate: event.start.toISOString(),
      endDate: event.end.toISOString()
    }).subscribe({
      error: (err) => {
        info.revert();
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: `Nie udało się zapisać zmiany wydarzenia. ${err.message}`
        });
      }
    });
  }
}

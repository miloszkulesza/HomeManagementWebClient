import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarEventEditFormInterface } from '../../../../../interface/calendar/calendar-event-edit-form-interface';
import { CalendarEventFullCalendarInterface } from '../../../../../interface/calendar/calendar-event-full-calendar-interface';
import { dateRangeValidator } from '../../validators/date-range-validator';
import { CommonModule } from '@angular/common';
import { CalendarEventUpdateInterface } from '../../../../../interface/calendar/calendar-event-update-interface';
import { MessageService } from 'primeng/api';
import { CalendarService } from '../../../../../services/calendar-service';
import { DatePicker } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-edit-event-dialog',
  imports: [Dialog, 
    ButtonModule, 
    InputTextModule,
    ReactiveFormsModule,
    CommonModule, 
    DatePicker,
    InputGroupModule,
    InputGroupAddonModule],
  templateUrl: './edit-event-dialog.html',
  styleUrl: './edit-event-dialog.scss',
})
export class EditEventDialog implements OnInit {
  @Input() event: CalendarEventFullCalendarInterface;
  @Output() save = new EventEmitter<CalendarEventFullCalendarInterface>();
  @Output() cancel = new EventEmitter<void>();

  private readonly messageService = inject(MessageService);
  private readonly calendarService = inject(CalendarService);

  form: FormGroup<CalendarEventEditFormInterface> = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    start: new FormControl(new Date(), { nonNullable: true }),
    end: new FormControl(new Date(), { nonNullable: true })
  });
  visible: boolean = false;
  mode: 'create' | 'edit' = 'create';

  ngOnInit() {
    if (this.visible)
      this.createForm();
  }

  private createForm() {
    this.form = new FormGroup(
    {
      title: new FormControl(
        this.event?.title ?? '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      start: new FormControl(
        this.event?.start!,
        { nonNullable: true, validators: [Validators.required] }
      ),
      end: new FormControl(
        this.event?.end!,
        { nonNullable: true, validators: [Validators.required] }
      )
    },
    { validators: dateRangeValidator('start', 'end') }
    );
  }

  showDialog(event?: CalendarEventFullCalendarInterface) {
    this.event = event;
    this.mode = event.id == null ? 'create' : 'edit';    
    this.createForm();
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  submit() {
    if (this.form.valid) {
      if (this.mode == 'edit') {
        this.updateCalendarEvent();
      }
      else {
        this.createCalendarEvent();
      }
      this.hideDialog();
    }
  }

  private updateCalendarEvent() {
    const data: CalendarEventUpdateInterface = {
        title: this.form.value.title,
        startDate: this.form.value.start.toISOString(),
        endDate: this.form.value.end.toISOString(),
        userEmail: this.event.userEmail
      }
      this.calendarService.putCalendarEvent(this.event.id, data).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Sukces', detail: `Zaktualizowano wydarzenie '${this.event.title}'`});
        const mappedEvent: CalendarEventFullCalendarInterface = {
          id: res.id,
          title: res.title,
          start: res.startDate,
          end: res.endDate,
          userEmail: res.userEmail,
          userId: res.userId,
          calendarEventBackgroundColor: res.calendarEventBackgroundColor
        };
        this.save.emit(mappedEvent);
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: `W czasie edycji wydarzenia wystąpił błąd. ${err.message}` });
      });
  }

  private createCalendarEvent() {
    const data: CalendarEventUpdateInterface = {
        title: this.form.value.title,
        startDate: this.form.value.start.toISOString(),
        endDate: this.form.value.end.toISOString(),
        userEmail: this.event.userEmail
      }
      this.calendarService.postCalendarEvent(data).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Sukces', detail: `Utworzono wydarzenie '${data.title}'`});
        const mappedEvent: CalendarEventFullCalendarInterface = {
          id: res.id,
          title: res.title,
          start: res.startDate,
          end: res.endDate,
          userEmail: res.userEmail,
          userId: res.userId,
          calendarEventBackgroundColor: res.calendarEventBackgroundColor
        };
        this.save.emit(mappedEvent);
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: `W czasie edycji wydarzenia wystąpił błąd. ${err.message}` });
      });
  }

  onCancelClick() {
    this.cancel.emit();
    this.hideDialog();
  }
}

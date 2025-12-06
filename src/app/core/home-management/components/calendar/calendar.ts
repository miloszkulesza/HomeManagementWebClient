import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

interface CalendarEvent {
  title: string;
  date: Date;
  color?: string;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule,
    CardModule,
    DividerModule,
    ButtonModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar {
  weekdays = ['Pon','Wt','Śr','Czw','Pt','Sob','Ndz'];

  currentDate = new Date();
  leftMonth!: { label: string; weeks: Date[][] };
  rightMonth!: { label: string; weeks: Date[][] };

  events: CalendarEvent[] = [
    { title: 'Spotkanie zespołu', date: new Date(), color: '#1976d2' },
    { title: 'Urodziny', date: new Date(new Date().setDate(new Date().getDate() + 3)), color: '#8e24aa' },
  ];

  constructor() {
    this.updateMonths();
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateMonths();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateMonths();
  }

  updateMonths() {
    this.leftMonth = this.generateMonth(this.currentDate);
    const next = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.rightMonth = this.generateMonth(next);
  }

  generateMonth(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result: Date[] = [];

    let startDow = start.getDay();
    if (startDow === 0) startDow = 7; // Sunday -> 7

    // previous month days
    for (let i = 1; i < startDow; i++) {
      result.push(new Date(start.getFullYear(), start.getMonth(), -(startDow - 1 - i)));
    }

    // current month days
    for (let i = 1; i <= end.getDate(); i++) {
      result.push(new Date(start.getFullYear(), start.getMonth(), i));
    }

    // next month padding
    while (result.length < 42) {
      const last = result[result.length - 1];
      result.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < 42; i += 7) {
      weeks.push(result.slice(i, i + 7));
    }

    return {
      label: start.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' }),
      weeks
    };
  }

  getEventsForDay(day: Date) {
    return this.events.filter(e => e.date.toDateString() === day.toDateString());
  }

  isCurrentMonth(month: { weeks: Date[][] }, day: Date) {
    const middleWeekDay = month.weeks[2][0];
    return day.getMonth() === middleWeekDay.getMonth();
  }
}

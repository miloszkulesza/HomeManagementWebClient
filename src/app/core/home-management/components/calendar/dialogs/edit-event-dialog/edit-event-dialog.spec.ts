import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventDialog } from './edit-event-dialog';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('EditEventDialog', () => {
  let component: EditEventDialog;
  let fixture: ComponentFixture<EditEventDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventDialog],
      providers: [provideHttpClient(), MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEventDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

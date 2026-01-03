import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventDialog } from './edit-event-dialog';

describe('EditEventDialog', () => {
  let component: EditEventDialog;
  let fixture: ComponentFixture<EditEventDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventDialog]
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

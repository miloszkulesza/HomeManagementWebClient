import { FormControl } from "@angular/forms";

export interface CalendarEventEditFormInterface {
    title: FormControl<string>,
    start: FormControl<Date>,
    end: FormControl<Date>,
}
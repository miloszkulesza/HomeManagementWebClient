import { FormControl } from "@angular/forms";

export interface EditProfileFormInterface {
    email: FormControl<string>,
    roles: FormControl<string[]>,
    calendarEventBackgroundColor: FormControl<string>
}
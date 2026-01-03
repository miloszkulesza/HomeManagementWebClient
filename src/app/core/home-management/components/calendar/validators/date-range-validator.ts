import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator = (
  startKey: string,
  endKey: string
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const startControl = control.get(startKey);
    const endControl = control.get(endKey);

    if (!startControl || !endControl) {
      return null;
    }

    const start = startControl.value;
    const end = endControl.value;

    if (!start || !end) {
      return null;
    }

    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return null;
    }

    return startDate < endDate ? null : { dateRange: true };
  };
};
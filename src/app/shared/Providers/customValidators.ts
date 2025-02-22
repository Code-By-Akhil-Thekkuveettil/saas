import {AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';


export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

export const whitespace = function (control: AbstractControl): ValidationErrors | null {
  let value: string = control.value || '';
  if (!value) {
    return null
  }
  if(control.value.startsWith(' ') || control.value.endsWith(' ')){
    return { whitespace: `Upper case required` };
  }

  return null;
}
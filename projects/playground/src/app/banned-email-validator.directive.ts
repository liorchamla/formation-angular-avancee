import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector:
    '[ngModel][bannedEmail],[formControl][bannedEmail],[formControlName][bannedEmail]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: BannedEmailValidator, multi: true },
  ],
})
export class BannedEmailValidator implements Validator {
  @Input() bannedEmail: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value === this.bannedEmail) {
      return { bannedEmail: this.bannedEmail };
    }

    return null;
  }
}

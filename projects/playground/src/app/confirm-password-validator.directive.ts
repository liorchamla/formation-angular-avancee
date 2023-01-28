import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector:
    '[ngModelGroup][confirmPassword], [formGroup][confirmPassword], [formGroupName][confirmPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmPasswordValidator,
      multi: true,
    },
  ],
})
export class ConfirmPasswordValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirm');

    if (password?.value !== confirm?.value) {
      confirm?.setErrors({ confirmPassword: true });

      return { confirmPassword: true };
    }

    return null;
  }
}

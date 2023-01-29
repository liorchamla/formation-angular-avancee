import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';
/**
 * Il est extrêmement important d'interpeler notre système d'injection de dépenances
 * grâce aux providers pour expliquer que cette directive est un validateur asynchrone.
 *
 * On utilise pour cela le jeton NG_VALIDATORS.
 *
 * Quand un champ demandera au système de lui passer tous les NG_ASYNC_VALIDATORS,
 * notre directive en fera partie !
 */
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

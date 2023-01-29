import { Directive, Input } from '@angular/core';
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

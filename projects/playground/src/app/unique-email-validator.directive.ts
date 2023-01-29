import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';

/**
 * Il est extrêmement important d'interpeler notre système d'injection de dépenances
 * grâce aux providers pour expliquer que cette directive est un validateur asynchrone.
 *
 * On utilise pour cela le jeton NG_ASYNC_VALIDATORS.
 *
 * Quand un champ demandera au système de lui passer tous les NG_ASYNC_VALIDATORS,
 * notre directive en fera partie !
 */
@Directive({
  selector:
    '[ngModel][uniqueEmail], [formControl][uniqueEmail], [formControlName][uniqueEmail]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueEmailValidator,
      multi: true,
    },
  ],
})
export class UniqueEmailValidator implements AsyncValidator {
  /**
   * Cette méthode est appelée par Angular pour valider le champ.
   * Elle doit retourner un Promise qui contient soit null si le champ est valide,
   * soit un objet qui contient les erreurs.
   */
  validate(control: AbstractControl): Promise<ValidationErrors | null> {
    return fetch(
      'https://jsonplaceholder.typicode.com/users?email=' + control.value
    )
      .then((response) => response.json())
      .then((users) => {
        // Si on a trouvé un utilisateur, c'est que l'email est déjà utilisé
        // On retourne donc un objet qui contient une erreur
        // sinon, on retourne null
        return users.length > 0 ? { uniqueEmail: true } : null;
      });
  }
}

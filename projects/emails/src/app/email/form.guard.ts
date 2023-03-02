import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { EmailCreationComponent } from './email-creation.component';

export class FormGuard implements CanDeactivate<EmailCreationComponent> {
  canDeactivate(
    component: EmailCreationComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot | undefined
  ): boolean {
    if (component.isFormTouched()) {
      return window.confirm(
        "Vous n'avez pas terminé l'édition du mail, voulez vous vraiment quitter cette page ?"
      );
    }

    return true;
  }
}

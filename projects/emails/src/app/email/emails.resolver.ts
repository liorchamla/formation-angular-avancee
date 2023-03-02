import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { delay, Observable, of } from 'rxjs';
import { FAKE_EMAILS_DATA } from '../data';
import { Email } from './types';

export class EmailsResolver implements Resolve<Email[]> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Email[]> {
    // On récupère le type de la route
    const type = route.paramMap.get('type');

    // On filtre les emails en fonction du type
    let emails: Email[] = [];

    // Si il n'y a pas de type, c'est qu'on est sur l'écran de boîte de réception
    if (!type) {
      // On récupère donc les emails dont le status est INBOX
      emails = FAKE_EMAILS_DATA.filter((e) => e.status === 'INBOX') as Email[];
    } else {
      // Sinon on récupère les emails dont le status correspond au type
      emails = FAKE_EMAILS_DATA.filter(
        (e) => e.status === type.toUpperCase()
      ) as Email[];
    }

    // On retourne un observable qui émettra les emails après 2 secondes
    // On simule ainsi un appel à un serveur qui prendrait du temps
    return of(emails).pipe(delay(2000));
  }
}

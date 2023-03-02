import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

export class TitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
    // En fonction du type qui se trouve dans l'URL, on retourne un titre différent
    const type = route.paramMap.get('type');

    // Si on n'a pas de type particulier, c'est qu'on est sur l'écran de boîte de réception
    if (!type) {
      return 'Boîte de réception';
    }

    // Sinon on retourne un titre différent en fonction du type
    return type === 'sent' ? 'Messages envoyés' : 'Corbeille';
  }
}

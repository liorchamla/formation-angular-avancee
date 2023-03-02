import { BehaviorSubject } from 'rxjs';

/**
 * Cette classe est un "faux" service d'authentification, elle permet de simuler une connexion et une déconnexion
 * en émettant des valeurs sur un BehaviorSubject qui pourra être écouté par les composants
 */
export class AuthService {
  authStatus$ = new BehaviorSubject<boolean>(true);

  login() {
    this.authStatus$.next(true);
  }

  logout() {
    this.authStatus$.next(false);
  }
}

import { Observable, of } from 'rxjs';
import { TokenManager } from './token.manager';

/**
 * Cette classe permet de stocker le token dans le sessionStorage
 */
export class SessionStorageTokenManager implements TokenManager {
  storeToken(token: string): Observable<string> {
    window.sessionStorage.setItem('authToken', token);

    return of(token);
  }

  loadToken(): Observable<string | null> {
    const token = window.sessionStorage.getItem('authToken');

    return of(token);
  }

  removeToken(): Observable<boolean> {
    window.sessionStorage.removeItem('authToken');

    return of(true);
  }
}

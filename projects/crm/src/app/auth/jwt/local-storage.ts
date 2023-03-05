import { Observable, of } from 'rxjs';
import { TokenManager } from './token.manager';

/**
 * Cette classe permet de stocker le token dans le localStorage
 */
export class LocalStorageTokenManager implements TokenManager {
  storeToken(token: string): Observable<string> {
    window.localStorage.setItem('authToken', token);

    return of(token);
  }

  loadToken(): Observable<string | null> {
    const token = window.localStorage.getItem('authToken');

    return of(token);
  }

  removeToken(): Observable<boolean> {
    window.localStorage.removeItem('authToken');

    return of(true);
  }
}

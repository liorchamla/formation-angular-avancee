import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

// Il vaut toujours mieux utiliser un InjectionToken plutôt qu'une simple string lorsqu'on veut indiquer
// à l'injection de dépendances quel objet on souhaite injecter
export const TOKEN_MANAGER = new InjectionToken<TokenManager>(
  'Le tokenManager à utiliser'
);

/**
 * Cette interface définit comment se comporteront les différents TokenManager qui existeront dans le projet
 * Les services qui souhaitent travailler avec le Token n'ont pas à savoir si le token est dans le localStorage,
 * dans le sessionStorage, dans une base de données, dans un cookie, etc.
 *
 * Deux services sont fournis par défaut dans le projet :
 * - LocalStorageTokenManager : stocke le token dans le localStorage
 * - SessionStorageTokenManager : stocke le token dans le sessionStorage
 */
export interface TokenManager {
  storeToken(token: string): Observable<string>;
  loadToken(): Observable<string | null>;
  removeToken(): Observable<boolean>;
}

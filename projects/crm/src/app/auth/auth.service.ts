import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { TokenManager, TOKEN_MANAGER } from './jwt/token.manager';

export type RegisterData = {
  email: string;
  password: string;
  name: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ApiLoginResponse = {
  authToken: string;
};

export type ApiExistsResponse = {
  exists: boolean;
};

@Injectable()
export class AuthService {
  // Ce Subject est un Observable qu'on pourra suivre et écouter partout dans l'application
  // Il permet d'être au courant de l'état de l'authentification
  authStatus$ = new BehaviorSubject<boolean>(false);

  constructor(
    // Notez qu'on ne demande pas ici en particulier le LocalStorageTokenManager, mais bien un TokenManager
    // Le système d'injection nous donnera donc un TokenManager sans qu'on ait à se soucier de si il s'agit
    // d'un LocalStorageTokenManager, d'un SessionStorageTokenManager, d'un CookieTokenManager, etc.
    // Si demain, on change de stratégie pour le stockage du token, il suffira de changer le provider dans le
    // SharedModule et tous les services qui utilisent un TokenManager seront automatiquement mis à jour
    @Inject(TOKEN_MANAGER) private tokenManager: TokenManager,
    private http: HttpClient
  ) {
    // Dès la construction du service, on souhaite que notre authStatus$ soit raccord par rapport
    // au fait qu'on ait un token ou pas, on appelle donc le TokenManager (qui sait où se trouve le token)
    // et si on a un token, on met à jour notre authStatus$ avec la valeur true, sinon false
    this.tokenManager.loadToken().subscribe((token) => {
      this.authStatus$.next(!!token);
    });
  }

  register(registerData: RegisterData) {
    return this.http.post(
      'https://x8ki-letl-twmt.n7.xano.io/api:UwMsW9-l/auth/signup',
      registerData
    );
  }

  login(loginData: LoginData) {
    return this.http
      .post<ApiLoginResponse>(
        'https://x8ki-letl-twmt.n7.xano.io/api:UwMsW9-l/auth/login',
        loginData
      )
      .pipe(
        // On reçoit la réponse qui contient un token, et on extrait ce token
        map((response) => response.authToken),
        // On stocke le token dans le TokenManager et on met à jour notre authStatus$
        // Tous ceux qui écoutent ce authStatus$ seront notifiés de la mise à jour
        tap((authToken) => {
          this.tokenManager.storeToken(authToken);
          this.authStatus$.next(true);
        })
      );
  }

  logout() {
    this.authStatus$.next(false);
    this.tokenManager.removeToken();
  }

  exists(email: string) {
    return this.http
      .post<ApiExistsResponse>(
        `https://x8ki-letl-twmt.n7.xano.io/api:UwMsW9-l/user/validation/exists`,
        {
          email,
        }
      )
      .pipe(map((response) => response.exists));
  }
}

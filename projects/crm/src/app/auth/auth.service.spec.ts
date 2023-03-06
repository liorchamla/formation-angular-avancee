import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { catchError, combineLatest, Observable, of, skip } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService, RegisterData } from './auth.service';
import { TokenManager, TOKEN_MANAGER } from './jwt/token.manager';

describe('AuthService', () => {
  let spectator: SpectatorHttp<AuthService>;

  // Dans nos tests, on ne veut pas s'appuyer sur un TokenManager réel qui va attaquer un SessionStorage ou un LocalStorage
  // On veut un faux TokenManager qu'on pourra piloter, notamment le token en lui même
  let storedToken: string | null = null;

  const fakeTokenManager: TokenManager = {
    storeToken(token: string): Observable<string> {
      storedToken = token;

      return of(token);
    },
    loadToken(): Observable<string | null> {
      return of(storedToken);
    },
    removeToken(): Observable<boolean> {
      storedToken = null;

      return of(true);
    },
  };

  const createHttp = createHttpFactory({
    service: AuthService,
    // On explique aux injecteurs que le TOKEN_MANAGER que demandera le AuthService sera le fakeTokenManager
    providers: [{ provide: TOKEN_MANAGER, useValue: fakeTokenManager }],
  });

  it('should set authStatus$ to true if a token is stored', (done: DoneFn) => {
    // On imagine qu'on a déjà un token :
    storedToken = 'MOCK_TOKEN';

    // On demande la construction du service :
    spectator = createHttp();

    // En théorie, on devrait avoir un authStatus$ à true :
    spectator.service.authStatus$.subscribe((status) => {
      expect(status).toBeTrue();
      done();
    });
  });

  it('should set authStatus$ to false if no token is stored', (done: DoneFn) => {
    // On imagine qu'on n'a pas de token
    storedToken = null;

    // On demande la construction du service :
    spectator = createHttp();

    // En théorie, on devrait avoir un authStatus$ à false :
    spectator.service.authStatus$.subscribe((status) => {
      expect(status).toBeFalse();
      done();
    });
  });

  it('should store token and set authStatus$ to true if login() succeeds', (done: DoneFn) => {
    spectator = createHttp();

    // Dans ce test, nous souhaitons tester deux observables : la méthode login() et sa requête HTTP qu'il nous faut
    // attendre pour voir si elle fonctionne correctement, et aussi le authStatus$ qui doit être à true si le login a fonctionné
    const login$ = spectator.service.login({
      email: 'john@doe.com',
      password: 't3sttest',
    });

    // Attention, authStatus$ est un BehaviourSubject, donc il émettra une valeur dès qu'on s'y abonne.
    // Or cette première valeur ne nous intéresse pas, on utilise donc skip(1) pour ne pas la prendre en compte.
    const authStatus$ = spectator.service.authStatus$.pipe(skip(1));

    // On peut demander à attendre que les deux observables aient émis une valeur (la requête de login et la NOUVELLE valeur de authStatus$)
    combineLatest([login$, authStatus$]).subscribe(([token, status]) => {
      // Et ainsi testé tout ce que l'on souhaite concernant ces deux observables
      expect(token).toBe('MOCK_TOKEN');
      expect(storedToken).toBe('MOCK_TOKEN');
      expect(status).toBeTrue();
      done();
    });

    // On vérifie que la requête est correcte et on simule la réponse du serveur
    spectator
      .expectOne(environment.apiUrl + '/auth/login', HttpMethod.POST)
      .flush({
        authToken: 'MOCK_TOKEN',
      });
  });

  it('should not store token and set authStatus$ to false if login() fails', (done: DoneFn) => {
    // On part du principe qu'on n'a pas de token, on s'attend à ce qu'il n'y en ait toujours pas après l'échec du login
    storedToken = null;

    spectator = createHttp();

    // Attention, dans ce test, la requête HTTP pour le login va échouer, notre astuce pour subscribe va donc foirer
    // car l'observable va émettre une erreur et non une valeur. On utilise donc catchError() pour transformer l'erreur
    // en une valeur, et ainsi pouvoir subscribe à l'observable.
    const login$ = spectator.service
      .login({
        email: 'john@doe.com',
        password: 't3sttest',
      })
      .pipe(catchError(() => of('error')));

    // Attention, comme la fonction login a échoué, le tap() qui était sensé émettre une valeur sur authStatus$ n'a pas été appelé.
    // On écoutera donc la première valeur de l'observable, qui est false.
    const authStatus$ = spectator.service.authStatus$;

    combineLatest([login$, authStatus$]).subscribe(([loginError, status]) => {
      expect(storedToken).toBeNull();
      expect(status).toBeFalse();
      done();
    });

    spectator
      .expectOne(environment.apiUrl + '/auth/login', HttpMethod.POST)
      .flush('error', { status: 401, statusText: 'Unauthorized' });
  });

  it('should register a new account', () => {
    spectator = createHttp();

    const registerData: RegisterData = {
      email: 'john@doe.com',
      password: 't3sttest',
      name: 'John Doe',
    };

    // On n'attend pas spécialement grand chose de cet observable, on n'a donc pas de test à faire sur le subscribe
    spectator.service.register(registerData).subscribe();

    const req = spectator.expectOne(
      environment.apiUrl + '/auth/signup',
      HttpMethod.POST
    );

    req.flush({});

    // On peut vérifier que la requête est correcte et porte les bonnes données
    expect(req.request.body).toEqual(registerData);
  });

  it('should verify if an email already exists', (done: DoneFn) => {
    spectator = createHttp();

    const email = 'john@doe.com';

    // Ici la seule chose qu'on veuille tester, c'est que la méthode retourne bien un Observable d'un boolean
    spectator.service.exists(email).subscribe((exists) => {
      expect(exists).toBeTrue();
      done();
    });

    spectator
      .expectOne(
        environment.apiUrl + '/user/validation/exists',
        HttpMethod.POST
      )
      .flush({
        exists: true,
      });
  });
});

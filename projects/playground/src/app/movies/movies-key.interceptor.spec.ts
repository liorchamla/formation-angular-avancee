import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { MoviesKeyInterceptor } from './movies-key.interceptor';
/**
 * Nous allons tester si notre intercepteur HTTP fonctionne correctement.
 * Son fonctionnement est très simple : quelque soit l'URL appelée avec le HttpClient,
 * il est censé ajouter les paramètres de clé et de langue à l'URL.
 *
 * Commençons avec l'approche TestBed (classique)
 */
describe('MoviesKeyInterceptor avec TestBed', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Nous travaillons avec le faux HttpClient
      providers: [
        // Nous précisons bien à Angular que nous voulons utiliser notre intercepteur
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MoviesKeyInterceptor,
          multi: true,
        },
      ],
    });
  });

  // Vérifions que l'interceptur agit correctement
  it('should add key and language to a request URL', (done: DoneFn) => {
    // Utilisons le HttpClient pour envoyer une requête vers une URL à la con
    TestBed.inject(HttpClient)
      .get('http://mock-url.com')
      .subscribe(() => {
        // On n'a rien à tester de particulier, on fait donc un test juste pour
        // que la console ne nous crie pas dessus
        expect(true).toBe(true);
        done();
      });

    // On vérifie que la requête a bien été envoyée avec les paramètres attendus
    TestBed.inject(HttpTestingController)
      .expectOne(
        'http://mock-url.com?api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR'
      )
      .flush({}); // On est obligé de flush pour que le subscribe() soit appelé
  });

  // Vérifions que l'intercepteur est intelligent et choisisse entre ? et &
  it('should use & as separator if needed', (done: DoneFn) => {
    // Utilisons le HttpClient pour envoyer une requête vers une URL à la con
    TestBed.inject(HttpClient)
      .get('http://mock-url.com?page=1')
      .subscribe(() => {
        expect(true).toBe(true);
        done();
      });

    TestBed.inject(HttpTestingController)
      .expectOne(
        'http://mock-url.com?page=1&api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR'
      )
      .flush({});
  });
});

/**
 * Maintenant, passons à l'approche Spectator
 */
describe('MoviesKeyInterceptor avec Spectator', () => {
  // Ici on précise qu'on veut tester le MoviesKeyInterceptor mais ça ne sert pas
  // à grand chose car on ne l'utilise pas directement
  let spectator: SpectatorHttp<MoviesKeyInterceptor>;
  const createHttp = createHttpFactory({
    service: MoviesKeyInterceptor,
    providers: [
      // Nous précisons bien à Angular que nous voulons utiliser notre intercepteur
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MoviesKeyInterceptor,
        multi: true,
      },
    ],
    // Notez qu'on n'a PAS BESOIN de préciser HttpClientTestingModule ici car nous
    // utilisons SpectatorHttp qui le fait pour nous
  });

  beforeEach(() => (spectator = createHttp()));

  it('should add key and language to a request URL', (done: DoneFn) => {
    spectator
      .inject(HttpClient)
      .get('http://mock-url.com')
      .subscribe(() => {
        expect(true).toBe(true);
        done();
      });
    spectator
      .expectOne(
        'http://mock-url.com?api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR',
        HttpMethod.GET
      )
      .flush({});
  });

  it('should use & as separator if needed', (done: DoneFn) => {
    spectator
      .inject(HttpClient)
      .get('http://mock-url.com?page=1')
      .subscribe(() => {
        expect(true).toBe(true);
        done();
      });
    spectator
      .expectOne(
        'http://mock-url.com?page=1&api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR',
        HttpMethod.GET
      )
      .flush({});
  });
});

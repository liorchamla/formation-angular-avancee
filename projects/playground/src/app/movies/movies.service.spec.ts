import { HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { MoviesService } from './movies.service';
import { ApiGenresResponse } from './types';

const MOCK_API_GENRES_RESPONSE: ApiGenresResponse = {
  genres: [
    {
      id: 1,
      name: 'Action',
    },
    {
      id: 2,
      name: 'Comedie',
    },
  ],
};

const MOCK_API_POPULAR_RESPONSE = {
  page: 1,
  results: [
    {
      title: 'MOCK_TITLE_1',
      overview: 'MOCK_OVERVIEW_1',
      poster_path: 'MOCK_IMAGE_1',
      vote_average: 5,
    },
    {
      title: 'MOCK_TITLE_2',
      overview: 'MOCK_OVERVIEW_2',
      poster_path: 'MOCK_IMAGE_2',
      vote_average: 5,
    },
  ],
};

/**
 * Nous allons tester que les méthodes du MoviesService font bien ce qu'elles sont
 * censées faire. Pour cela, nous allons utiliser le module HttpClientTestingModule
 * qui permet de mocker les requêtes HTTP.
 *
 * Commençons par l'approche TestBed
 */
describe('MoviesService avec TestBed', () => {
  let service: MoviesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    // Nous configurons un faux module Angular qui nous permettra de tester
    TestBed.configureTestingModule({
      // Ce module fournira le MoviesService et l'intercepteur HTTP
      providers: [
        MoviesService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MoviesKeyInterceptor,
          multi: true,
        },
      ],
      // Nous utilisons le module HttpClientTestingModule qui permet de mocker les requêtes HTTP
      // Nous nous assurons ainsi qu'il sera facile à piloter et qu'aucune requête ne sera envoyée
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(MoviesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  /**
   * Testons que la méthode getGenres va bien appeler le réseau et renvoyer des
   * genres transformés
   */
  it('should get transformed genres', (done: DoneFn) => {
    // Appelons getGenres() : le .subscribe() est obligatoire, sans ça la requête
    // ne partira pas sur le réseau (on appelle ça un Observable "froid")
    service.getGenres().subscribe((genres) => {
      expect(genres.length).toBe(2);
      expect(genres[0].name).toBe('Action');
      done();
    });

    // Grâce à httpController, nous allons pouvoir piloter les requêtes HTTP
    // et nous précisons que nous attendons une requête GET sur l'URL suivante
    httpController
      .expectOne(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR'
      )
      // Avec flush, nous simulons la réponse du serveur
      .flush(MOCK_API_GENRES_RESPONSE);
  });

  /**
   * Testons que la méthode getPopularMovies va bien appeler le réseau et renvoyer des
   * films transformés
   */
  it('should get transformed popular movies', (done: DoneFn) => {
    // Appelons getPopularMovies et souscrivons à l'Observable (sinon la requête ne partira pas)
    service.getPopularMovies().subscribe((movies) => {
      // On s'attend bien à recevoir 2 films
      expect(movies.length).toBe(2);
      // Si le film a la propriété "description", c'est qu'il a été transformé car la
      // vraie réponse de l'API contient la propriété "overview"
      expect(movies[0].description).toBe('MOCK_OVERVIEW_1');
      done();
    });

    httpController
      .expectOne(
        'https://api.themoviedb.org/3/movie/popular?page=1&api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR'
      )
      .flush(MOCK_API_POPULAR_RESPONSE);
  });
});

/**
 * Maintenant, testons avec l'approche Spectator
 */
describe('MoviesService avec Specator', () => {
  // La classe SpectatorHttp permet de tester des services qui utilisent HttpClient
  // elle fournie elle même le HttpClienTestingModule derrière le rideau
  // ce qui nous permet de ne pas nous embêter avec les imports
  let spectator: SpectatorHttp<MoviesService>;
  const createHttpService = createHttpFactory({
    service: MoviesService,
    // Nous fournissons le MoviesKeyInterceptor
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MoviesKeyInterceptor,
        multi: true,
      },
    ],
  });

  beforeEach(() => (spectator = createHttpService()));

  // Testons l'appel à getGenres()
  it('should get transformed genres', (done: DoneFn) => {
    spectator = createHttpService();

    // On demande à Spectator de nous fournir l'instance de MoviesService
    // puis on appel getGenres() et on souscrit à l'Observable
    spectator.service.getGenres().subscribe((genres) => {
      expect(genres.length).toBe(2);
      expect(genres[0].name).toBe('Action');
      done();
    });

    // On précise qu'on attend donc une requête GET sur l'URL suivante
    spectator
      .expectOne(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR',
        HttpMethod.GET
      )
      // Et on simule la réponse du serveur
      .flush(MOCK_API_GENRES_RESPONSE);
  });

  // Testons l'appel à getPopularMovies()
  it('should get transformed popular movies', (done: DoneFn) => {
    spectator.service.getPopularMovies().subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies[0].description).toBe('MOCK_OVERVIEW_1');
      done();
    });

    spectator
      .expectOne(
        'https://api.themoviedb.org/3/movie/popular?page=1&api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR',
        HttpMethod.GET
      )
      .flush(MOCK_API_POPULAR_RESPONSE);
  });
});

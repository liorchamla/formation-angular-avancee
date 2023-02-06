import { Component, OnInit } from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  forkJoin,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  switchMap,
  tap,
} from 'rxjs';
import { MoviesService } from './movies.service';
import { Genres, Movies } from './types';

@Component({
  selector: 'app-movies',
  template: `
    <ng-container *ngIf="data$ | async as data">
      <div class="mb-5">
        <div class="badge bg-light" *ngFor="let genre of data.genres">
          {{ genre.name }}
        </div>
      </div>
      <div class="row movies">
        <div class="movie col-4" *ngFor="let movie of data.movies">
          <div class="card">
            <img [src]="movie.image" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <span class="badge bg-light" *ngFor="let id of movie.genres">
                {{ getGenreLabel(id) }}
              </span>
              <p class="card-text">{{ movie.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class MoviesComponent implements OnInit {
  genresCache: Genres = [];

  data$?: Observable<{ movies: Movies; genres: Genres }>;

  page = 1;

  getGenreLabel(id: number): string {
    return this.genresCache.find((genre) => genre.id === id)?.name || '';
  }

  constructor(private service: MoviesService) {}

  ngOnInit(): void {
    // L'observable scroll$ va emettre une liste de films à cahque fois que
    // l'utilisateur scroll jusqu'en bas de la page (en augmentant la valeur de page)
    const scroll$ = fromEvent(window, 'scroll').pipe(
      map(() => this.isAtTheBottomOfThePage()),
      distinctUntilChanged(),
      filter((isBottom) => isBottom === true),
      tap(() => this.page++),
      switchMap(() => this.service.getPopularMovies(this.page))
    );

    // L'observable genres$ va emettre la liste des genres
    const genres$ = this.service
      .getGenres()
      // On veut tout de même garder les genres dans un tableau disponible
      // dans la classe, pour pouvoir les réutiliser dans la méthode getGenreLabel
      .pipe(tap((genres) => (this.genresCache = genres)));

    // L'observable movies$ va emettre lorsque la liste des films arrivera au départ
    // mais aussi à chaque fois que scroll$ emettra une nouvelle liste de films
    // au final, c'est bien un observable qui émet une liste de films
    const movies$ = merge(
      this.service.getPopularMovies(this.page),
      scroll$
    ).pipe(
      // On utilise scan pour concaténer les listes de films au fil du temps
      // La première fois, oldMovies sera égal à [], et newMovies à la liste de films
      // de la page 1
      // La deuxième fois, oldMovies sera égal à la liste de films de la page 1, et
      // newMovies à la liste de films de la page 2
      // Ce que l'on fait ici, c'est que l'on émet un tableau qui contient la totalité des films
      scan(
        (oldMovies: Movies, newMovies: Movies) => [...oldMovies, ...newMovies],
        []
      )
    );

    // data$ est un observable qui émettra une première fois lorsque genres$ ET movies$ auront émis une valeur,
    // puis à chaque fois que movies$ émettra une nouvelle valeur
    this.data$ = combineLatest([genres$, movies$]).pipe(
      // On ne veut pas un tableau avec les genres et les films, mais un objet
      // qui contient les genres et les films et qui sera exploité dans le template
      map(([genres, movies]) => ({
        genres,
        movies,
      }))
    );
  }

  isAtTheBottomOfThePage() {
    return (
      document.documentElement.scrollTop +
        document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 300
    );
  }
}

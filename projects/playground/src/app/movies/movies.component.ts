import { Component, OnInit } from '@angular/core';
import { MoviesService } from './movies.service';
import { Genres, Movies } from './types';

@Component({
  selector: 'app-movies',
  template: `
    <div class="mb-5">
      <div class="badge bg-light" *ngFor="let genre of genres">
        {{ genre.name }}
      </div>
    </div>
    <div class="row movies">
      <div class="movie col-4" *ngFor="let movie of movies">
        <div class="card">
          <img [src]="movie.image" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">{{ movie.title }}</h5>
            <p class="card-text">{{ movie.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MoviesComponent implements OnInit {
  movies: Movies = [];
  genres: Genres = [];

  constructor(private service: MoviesService) {}

  ngOnInit(): void {
    // Du point de vue de notre composant, on ne s'occupe pas de savoir comment
    // les données sont récupérées, on s'occupe juste de les demander au service
    // et de les afficher
    // Notez qu'on ne sait pas à quoi ressemblaient ces données dans l'API
    // On ne sait pas non plus si elles sont récupérées en HTTP ou en WebSocket
    // ou dans des fichiers JSON etc...
    // En plus, on les récupère sous la forme choisie (un tableau de Genres et un tableau de Movies)
    this.service.getGenres().subscribe((genres) => (this.genres = genres));

    this.service
      .getPopularMovies()
      .subscribe((movies) => (this.movies = movies));
  }
}

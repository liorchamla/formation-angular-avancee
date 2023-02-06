import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiGenresResponse, ApiPopularResponse, Genres, Movie } from './types';

// Le service doit être Injectable pour qu'Angular puisse analyser les dépendances
// dans le constructeur et les injecter
@Injectable()
export class MoviesService {
  // On demande à Angular de nous injecter un objet HttpClient
  // Angular saura le faire car nous avons importer le HttpClientModule
  // qui contient les instructions (provider) permettant de l'instancier
  constructor(private http: HttpClient) {}

  /**
   * Permet d'obtenir un tableau de Genres
   */
  getGenres() {
    // On lance un appel HTTP en GET vers l'API et on précise que les données reçues
    // seront une ApiGenresResponse
    return (
      this.http
        .get<ApiGenresResponse>('https://api.themoviedb.org/3/genre/movie/list')
        // Attention, nous ne souhaitons pas renvoyer une ApiGenresResponse mais un tableau de Genres
        // On utilise donc un pipe() pour transformer les données reçues
        .pipe(
          // On utilise l'opérateur "map" qui reçoit un objet de type ApiGenresResponse
          // mais qui retourne uniquement la propriété "genres" qui est bel et bien
          // un tableau de Genres
          map((genresResponse) => genresResponse.genres)
        )
    );
  }

  /**
   * Permet d'obtenir un tableau de Movies
   */
  getPopularMovies(page: number = 1) {
    // On appelle l'API en GET en précisant bien qu'on devrait recevoir un objet de type
    // ApiPopularResponse, qui n'est pas un tableau de movies, on devra donc transformer
    // les données reçues
    return this.http
      .get<ApiPopularResponse>(
        'https://api.themoviedb.org/3/movie/popular?page=' + page
      )
      .pipe(
        // On utilise l'opérateur "map" qui reçoit un objet de type ApiPopularResponse
        // mais qui retourne uniquement la propriété "results" qui est bel et bien
        // un tableau de ApiMovie
        map((popularResponse) => popularResponse.results),
        // Mais mes composants se foutent d'obtenir des ApiMovies, ils veulent des Movies
        // Il faut donc transformer le tableau d'ApiMovies en tableau de Movies
        map((apiMovies) =>
          // On prend le tableau d'ApiMovies et on le transforme en tableau de Movies
          apiMovies.map(
            (apiMovie) =>
              ({
                id: apiMovie.id,
                title: apiMovie.title,
                description: apiMovie.overview,
                image: `https://image.tmdb.org/t/p/w500${apiMovie.poster_path}`,
                rating: apiMovie.vote_average,
                genres: apiMovie.genre_ids,
              } as Movie)
          )
        )
      );
  }
}

export type Movie = {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  genres: number[];
};

export type Movies = Movie[];

export type Genre = {
  id: number;
  name: string;
};

export type Genres = Genre[];

export type ApiGenresResponse = {
  genres: Genre[];
};

export type ApiPopularResponse = {
  /**
   * La page actuelle
   */
  page: number;
  /**
   * Les films concernés par cette page
   */
  results: ApiMovie[];
  /**
   * Le nombre de pages totales
   */
  total_pages: number;
  /**
   * Le nombre total de films
   */
  total_results: number;
};

export type ApiMovie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

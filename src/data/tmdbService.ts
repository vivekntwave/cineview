import { tmdbFetch } from "../core/tmdbClient";
import * as schemas from "../core/tmdbSchemas";

export const tmdbService = {
  getTrending: (
    type: "movie" | "tv" | "all" = "all",
    timeWindow: "day" | "week" = "day",
    page = 1,
  ) => {
    return tmdbFetch(
      `/trending/${type}/${timeWindow}?page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getPopularMovies: (page = 1) => {
    return tmdbFetch(
      `/movie/popular?page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getTopRatedMovies: (page = 1) => {
    return tmdbFetch(
      `/movie/top_rated?page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getUpcomingMovies: (page = 1) => {
    return tmdbFetch(
      `/movie/upcoming?page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getMovieGenres: () => {
    return tmdbFetch(`/genre/movie/list`, schemas.GenreListResponseSchema);
  },

  getMoviesByGenre: (genreId: number | string, page = 1) => {
    return tmdbFetch(
      `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
      schemas.PaginatedResponseSchema,
    );
  },

  searchMulti: (query: string, page = 1) => {
    const encodedQuery = encodeURIComponent(query);
    return tmdbFetch(
      `/search/multi?query=${encodedQuery}&page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getMovieDetails: (id: string | number) => {
    return tmdbFetch(`/movie/${id}`, schemas.MovieDetailSchema);
  },

  getMovieRecommendations: (id: string | number) => {
    return tmdbFetch(
      `/movie/${id}/recommendations`,
      schemas.PaginatedResponseSchema,
    );
  },

  getMovieCredits: (id: string | number) => {
    return tmdbFetch(`/movie/${id}/credits`, schemas.CreditsResponseSchema);
  },

  getTVShowDetails: (id: string | number) => {
    return tmdbFetch(`/tv/${id}`, schemas.TVShowDetailSchema);
  },

  getTVSeasonDetails: (
    showId: string | number,
    seasonNumber: string | number,
  ) => {
    return tmdbFetch(
      `/tv/${showId}/season/${seasonNumber}`,
      schemas.SeasonDetailSchema,
    );
  },
  getPopularTVShows: (page = 1) => {
    return tmdbFetch(
      `/tv/popular?page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getTopRatedTVShows: (page = 1) => {
    return tmdbFetch(
      `/tv/top_rated?page=${page}`,
      schemas.PaginatedResponseSchema,
    );
  },

  getTVGenres: () => {
    return tmdbFetch(`/genre/tv/list`, schemas.GenreListResponseSchema);
  },

  getTVShowsByGenre: (genreId: number | string, page = 1) => {
    return tmdbFetch(
      `/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
      schemas.PaginatedResponseSchema,
    );
  },
};

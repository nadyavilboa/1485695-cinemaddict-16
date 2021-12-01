import { isFilmInWatchlist, isFilmWatched, isFilmFavorite } from '../utils';

const filmToFilterMap = {
  'All movies': (films) => films.length,
  'Watchlist': (films) => films.filter((film) => isFilmInWatchlist(film)).length,
  'History': (films) => films.filter((film) => isFilmWatched(film)).length,
  'Favorites': (films) => films.filter((film) => isFilmFavorite(film)).length,
};

export const generateFilters = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  })
);

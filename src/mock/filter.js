import { isFilmInWatchlist, isFilmWatched, isFilmFavorite } from '../utils';

const filtersObject = {
  Watchlist: 0,
  History: 0,
  Favorites: 0,
};

export const countFilters = (films) => {
  films.forEach((film) => {

    if (isFilmInWatchlist(film)) {
      filtersObject.Watchlist++;
    }

    if (isFilmWatched(film)) {
      filtersObject.History++;
    }

    if (isFilmFavorite(film)) {
      filtersObject.Favorites++;
    }

  });
  return filtersObject;
};

export const generateFilters = (filtersMap) => Object.entries(filtersMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms,
  })
);

import { getRandomInteger, getRandomElements } from './common.js';

const UserRankNames = {
  LOW: 'Novice',
  MIDDLE: 'Fan',
  HIGH: 'Movie Buff',
};

const UserRankLevels = {
  LOW: 10,
  HIGH: 20,
};

const initialFilters = {
  allMovies: 0,
  watchlist: 0,
  history: 0,
  favorites: 0,
};

export const getActualRank = (watched) => {
  let rank;

  if (watched > 0 && watched <= UserRankLevels.LOW) {
    rank = UserRankNames.LOW;
  }

  if (watched > UserRankLevels.LOW && watched <= UserRankLevels.HIGH) {
    rank = UserRankNames.MIDDLE;
  }

  if (watched > UserRankLevels.HIGH) {
    rank = UserRankNames.HIGH;
  }

  return rank;
};

export const generateCommentsFilm = (comments) => {
  const commentsFilm = [];
  getRandomElements(comments, 0, 5).forEach((element) => {
    if (element) {
      commentsFilm.push(element.id);
    }
  });
  return commentsFilm;
};

export const getUrlImage = (folder, namesFiles) => {
  const numberFilm = getRandomInteger(1, namesFiles.length) - 1;
  return `${folder}${namesFiles[numberFilm]}`;
};

const isFilmInWatchList = (film) => Boolean(film.userDetails.watchList);

export const isFilmWatched = (film) => Boolean(film.userDetails.alreadyWatched);

const isFilmFavorite = (film) => Boolean(film.userDetails.favorite);

const countFilterCurrentFilm = (acc, currentFilm) => {
  if (isFilmInWatchList(currentFilm)) {
    acc.watchlist++;
  }

  if (isFilmWatched(currentFilm)) {
    acc.history++;
  }

  if (isFilmFavorite(currentFilm)) {
    acc.favorites++;
  }
  return acc;
};

export const countFiltersValue = (films) => {
  const amountAllFilms = films.length;
  const countFilters = films.reduce((acc, currentFilm) =>
    countFilterCurrentFilm(acc, currentFilm), initialFilters);
  countFilters.allMovies = amountAllFilms;

  return countFilters;
};

export const filterFilms = (films, filter) => {
  const filteredFilms = [];

  switch (filter) {
    case 'allMovies':
      films.forEach((film) => filteredFilms.push(film));
      break;
    case 'watchList':
      films.forEach((film) => {
        if (isFilmInWatchList(film)) {
          filteredFilms.push(film);
        }
      });
      break;
    case 'watched':
      films.forEach((film) => {
        if (isFilmWatched(film)) {
          filteredFilms.push(film);
        }
      });
      break;
    case 'favorites':
      films.forEach((film) => {
        if (isFilmFavorite(film)) {
          filteredFilms.push(film);
        }
      });
      break;
    default:
      throw new Error(`Unknown filter type ${filter}`);
  }
};

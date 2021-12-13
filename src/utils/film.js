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

const isFilmInWatchList = (film) => Boolean(film.userDetails.watchlist);

const isFilmWatched = (film) => Boolean(film.userDetails.alreadyWatched);

const isFilmFavorite = (film) => Boolean(film.userDetails.favorite);

export const generateFilters = (films) => films.reduce((acc, currentFilm) => {
  if (isFilmInWatchList(currentFilm)) {
    acc.watchList++;
  }

  if (isFilmWatched(currentFilm)) {
    acc.history++;
  }

  if (isFilmFavorite(currentFilm)) {
    acc.favorites++;
  }

  return acc;
}, initialFilters);

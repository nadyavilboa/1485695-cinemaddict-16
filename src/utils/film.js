import { getRandomInteger, getRandomElements } from './common.js';
import { UserRankLevels, UserRankNames, MenuItem } from '../const.js';

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

export const countFiltersValue = (films) =>
  films.reduce((acc, currentFilm) => countFilterCurrentFilm(acc, currentFilm),
    {
      watchlist: 0,
      history: 0,
      favorites: 0,
    });

export const filterFilms = (films, filter) => {
  switch (filter) {
    case MenuItem.ALL:
      return films;
    case MenuItem.WATCHLIST:
      return films.filter((film) => isFilmInWatchList(film));
    case MenuItem.HISTORY:
      return films.filter((film) => isFilmWatched(film));
    case MenuItem.FAVORITES:
      return films.filter((film) => isFilmFavorite(film));
    default:
      throw new Error(`Unknown filter type ${filter}`);
  }
};

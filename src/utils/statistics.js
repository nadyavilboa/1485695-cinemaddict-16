import { getActualRank, isFilmWatched } from './film.js';
import { AMOUNT_MINUTES_IN_HOUR } from '../const.js';

const countTimeFilms = (films) => {
  let time = 0;
  films.forEach((film) => {time =+ film.runtime;});
  return time;
};

const countGenresFilm = (accumulate, item) => {
  const newCount = (accumulate[item] || 0) + 1;
  return { ...accumulate, [item]: newCount };
};

const getTopGenre = (films) => {
  let genresArray = [];

  films.forEach((film) => {
    genresArray = [...film.genres, ...genresArray];
  });

  const countGenres = genresArray.reduce((accumulate, item) =>
    countGenresFilm(accumulate, item), {});

  const maxCount = Math.max.apply(null, Object.values(countGenres));
  const [recordItem] = Object.entries(countGenres).find(([, val]) => val === maxCount);

  return recordItem;
};

export const countHour = (timeValueInteger) => {
  const hours = Math.floor(timeValueInteger / AMOUNT_MINUTES_IN_HOUR);
  if (hours !== 0) {
    return hours;
  }
};

export const countMinutes = (timeValueInteger) => {
  const minutes = timeValueInteger % AMOUNT_MINUTES_IN_HOUR;
  if (minutes !== 0) {
    return minutes;
  }
};

export const getTextStatistics = (films) => {
  const watchedFilms = films.filter((film) => isFilmWatched(film));
  const textStatistics = {
    userRank: getActualRank(watchedFilms.length),
    countWatched: watchedFilms.length,
    timeFilms: countTimeFilms(watchedFilms),
    topGenre: getTopGenre(watchedFilms),
  };
  return textStatistics;
};

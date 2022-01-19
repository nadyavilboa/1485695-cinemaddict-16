import { getActualRank, isFilmWatched } from './film.js';
import { TimeValues, Color } from '../const.js';
import dayjs from 'dayjs';

export const getWatchedFilms = (films) => {
  const watchedFilms = films.filter((film) => isFilmWatched(film));
  return watchedFilms;
};

const countTimeFilms = (films) => {
  let time = 0;
  films.forEach((film) => {time =+ film.runtime;});
  return time;
};

const countGenresFilm = (accumulate, item) => {
  const newCount = (accumulate[item] || 0) + 1;
  return { ...accumulate, [item]: newCount };
};

export const getStatisticsGenres = (films) => {
  let genresArray = [];

  films.forEach((film) => {
    genresArray = [...film.genres, ...genresArray];
  });

  const countGenres = genresArray.reduce((accumulate, item) =>
    countGenresFilm(accumulate, item), {});

  return countGenres;
};

const getTopGenre = (films) => {
  const countGenres = getStatisticsGenres(films);

  const maxCount = Math.max.apply(null, Object.values(countGenres));
  const [recordItem] = Object.entries(countGenres).find(([, val]) => val === maxCount);

  return recordItem;
};

export const countHour = (timeValueInteger) => Math.floor(timeValueInteger / TimeValues.AMOUNT_MINUTES_IN_HOUR);

export const countMinutes = (timeValueInteger) => timeValueInteger % TimeValues.AMOUNT_MINUTES_IN_HOUR;

export const getEmptyStatistics = () => ({
  countWatched: 0,
  timeFilms: 0,
  topGenre: '',
});

export const getTextStatistics = (films) =>
  ({
    countWatched: films.length,
    timeFilms: countTimeFilms(films),
    topGenre: getTopGenre(films),
  });

export const isDateRange = (film, period) =>
  dayjs(film.userDetails.watchingDate).isAfter(dayjs().subtract(period, 'days'));

export const colorToHex = {
  [Color.YELLOW]: '#ffe800',
  [Color.WHITE]: '#ffffff',
};

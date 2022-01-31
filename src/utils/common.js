import dayjs from 'dayjs';
import { TimeValues } from '../const.js';

export const countHourInDuration = (valueInteger) => {
  const countHour = Math.floor(valueInteger / TimeValues.AMOUNT_MINUTES_IN_HOUR);
  if (countHour !== 0) {
    return `${String(countHour)  }h`;
  }
};

export const countMinutesInDuration = (valueInteger) => {
  const countMinutes = valueInteger % TimeValues.AMOUNT_MINUTES_IN_HOUR;
  if (countMinutes !== 0) {
    return `${String(countMinutes)  }m`;
  }
};

export const sortByDate = (firstFilm, secondFilm) => dayjs(secondFilm.release.date).diff(dayjs(firstFilm.release.date));

export const sortByRating = (firstFilm, secondFilm) => secondFilm.totalRating - firstFilm.totalRating;

export const isEscapeEvent = (key) => key === 'Escape';

let isControl = false;

export const isCtrlEnterEvent = (evt) => {
  if (evt.key === 'Control') {
    isControl = true;
  }

  if (isControl && evt.key === 'Enter') {
    return true;
  }
};

export const adaptToClient = (film) => {
  const adaptedTask = {...film,
    userDetails: {
      alreadyWatched: film['user_details']['already_watched'],
      watchList: film['user_details']['watchlist'],
      watchingDate: film['user_details']['watching_date'] ? new Date(film['user_details']['watching_date']) : null,
      favorite: film['user_details']['favorite'],
    },
    poster: film['film_info']['poster'],
    title: film['film_info']['title'],
    alternativeTitle: film['film_info']['alternative_title'],
    totalRating: film['film_info']['total_rating'],
    ageRating: film['film_info']['age_rating'],
    director: film['film_info']['director'],
    release: {
      date: new Date(film['film_info']['release']['date']),
      releaseCountry: film['film_info']['release']['release_country'],
    },
    runtime: film['film_info']['runtime'],
    writers: film['film_info']['writers'],
    actors: film['film_info']['actors'],
    genres: film['film_info']['genre'],
    description: film['film_info']['description'],
  };

  delete adaptedTask['film_info'];
  delete adaptedTask['user_details'];

  return adaptedTask;
};


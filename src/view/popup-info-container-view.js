import AbstractView from './abstract-view.js';
import { countHourInDuration, countMinutesInDuration } from '../utils/common.js';
import dayjs from 'dayjs';

const createPopupInfoContainerTemplate = (film) => (
  `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${film.poster}" alt="">

      <p class="film-details__age">${film.ageRating}+</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${film.title}</h3>
          <p class="film-details__title-original">Original: ${film.alternativeTitle}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${film.totalRating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${film.director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${film.writers.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${film.actors.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${dayjs(film.release.date).format('DD MMMM YYYY')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">
            ${countHourInDuration(film.runtime) ? countHourInDuration(film.runtime) : ''}
            ${countMinutesInDuration(film.runtime) ? countMinutesInDuration(film.runtime) : ''}
          </td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${film.release.releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Genres</td>
          <td class="film-details__cell">
            ${film.genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ')}
          </td>
        </tr>
      </table>

      <p class="film-details__film-description">
        ${film.description}
      </p>
    </div>
  </div>`
);

export default class PopupInfoContainerView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupInfoContainerTemplate(this.#film);
  }
}

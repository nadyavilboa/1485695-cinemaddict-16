import AbstractView from './abstract-view.js';
import { countHourInDuration, countMinutesInDuration } from '../utils/common.js';
import dayjs from 'dayjs';

const createPopupInfoContainerTemplate = (film) => {
  const { poster, ageRating, title, alternativeTitle, totalRating, director,
    writers, actors, release, runtime, genres, description } = film;
  return (
    `<div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img
          class="film-details__poster-img"
          src="${poster}"
          alt=""
        />
        <p class="film-details__age">${ageRating}+</p>
      </div>
      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">
              Original: ${alternativeTitle}
            </p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">
              ${dayjs(release.date).format('DD MMMM YYYY')}
            </td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">
              ${countHourInDuration(runtime) ? countHourInDuration(runtime) : ''}
              ${countMinutesInDuration(runtime) ? countMinutesInDuration(runtime) : ''}
            </td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${release.releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ')}
            </td>
          </tr>
        </table>
        <p class="film-details__film-description">
          ${description}
        </p>
      </div>
    </div>`);
};

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

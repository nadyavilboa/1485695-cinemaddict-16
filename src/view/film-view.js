import AbstractView from './abstract-view.js';
import { countHourInDuration, countMinutesInDuration } from '../utils/common.js';
import { ControlType } from '../const.js';
import dayjs from 'dayjs';

const MAX_LENGTH_VISIBLE_DESCRIPTION = 140;

const createFilmTemplate = (film) => {
  const { title, totalRating, release, runtime, genres,
    poster, description, comments, userDetails } = film;
  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">
            ${dayjs(release.date).format('YYYY')}
          </span>
          <span class="film-card__duration">
            ${countHourInDuration(runtime) ? countHourInDuration(runtime) : ''}
            ${countMinutesInDuration(runtime) ? countMinutesInDuration(runtime) : ''}
          </span>
          <span class="film-card__genre">${genres.join(', ')}</span>
        </p>
        <img
          src="${poster}"
          alt=""
          class="film-card__poster"
        />
        <p class="film-card__description">
          ${description.length > MAX_LENGTH_VISIBLE_DESCRIPTION ? description.slice(0, MAX_LENGTH_VISIBLE_DESCRIPTION - 1) : description}${description.length > MAX_LENGTH_VISIBLE_DESCRIPTION ? '…' : ''}
        </p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button
          class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchList ? 'film-card__controls-item--active' : ''}"
          type="button"
          data-control-type="watchlist"
        >
            ${userDetails.watchlist ? 'Added to watchlist' : 'Add to watchlist'}
        </button>
        <button
          class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}"
          type="button"
          data-control-type="watched"
        >
            ${userDetails.watched ? 'Marked watched' : 'Mark as watchlist'}
        </button>
        <button
          class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}"
          type="button"
          data-control-type="favorite"
        >
            ${userDetails.favorite ? 'Marked favorite' : 'Mark as favorite'}
        </button>
      </div>
    </article>`);
};

export default class FilmView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickFilmCardHandler);
  }

  #clickFilmCardHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('.film-card__controls-item')) {
      this._callback.click();
    }
  }

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.addEventListener('click', this.#changeFilmCard);
  }

  #changeFilmCard = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-card__controls-item')) {
      return;
    }

    let newControlsData = {};

    switch (evt.target.dataset.controlType) {
      case ControlType.WATCHLIST:
        newControlsData = {...this.#film.userDetails, watchList: !this.#film.userDetails.watchList};
        break;
      case ControlType.ALREADY_WATCHED:
        newControlsData = {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched};
        break;
      case ControlType.FAVORITE:
        newControlsData = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite};
        break;
      default:
        throw new Error(`Unknown control type ${evt.target.id}`);
    }

    this._callback.controlClick(newControlsData);
  }
}

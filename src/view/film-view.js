import { createElement } from '../render.js';

const MAX_LENGTH_VISIBLE_DESCRIPTION = 140;

const createFilmTemplate = (film) => (
  `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.release.date}</span>
        <span class="film-card__duration">${film.runtime}</span>
        <span class="film-card__genre">${film.genres.join(', ')}</span>
      </p>
      <img src="${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description.length > MAX_LENGTH_VISIBLE_DESCRIPTION ? film.description.slice(0, MAX_LENGTH_VISIBLE_DESCRIPTION - 1) : film.description}${film.description.length > MAX_LENGTH_VISIBLE_DESCRIPTION ? '…' : ''}</p>
      <span class="film-card__comments">${film.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watchlist ? 'Added to watchlist' : 'Add to watchlist'}</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.userDetails.watched ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watched ? 'Marked watched' : 'Mark as watchlist'}</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${film.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watchlist ? 'Marked favorite' : 'Mark as favorite'}</button>
    </div>
  </article>`
);

export default class FilmView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}

import AbstractView from './abstract-view.js';

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
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.userDetails.watchList ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watchlist ? 'Added to watchlist' : 'Add to watchlist'}</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watched ? 'Marked watched' : 'Mark as watchlist'}</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${film.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">${film.userDetails.watchlist ? 'Marked favorite' : 'Mark as favorite'}</button>
    </div>
  </article>`
);

export default class FilmView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains('film-card__controls-item')) {
      this._callback.click();
    }
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}

import { createElement, removeComponent, renderElement } from '../utils/render.js';

import PopupInfoContainerView from './popup-info-container-view.js';
import PopupControlsView from './popup-controls-view.js';
import PopupCommentsContainerView from './popup-comments-container-view.js';
import AbstractView from './abstract-view.js';

const createPopupContainerTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close"></div>
      </div>

      <div class="film-details__bottom-container"></div>
    </form>
  </section>`
);

export default class PopupContainerView extends AbstractView {
  #element = null;
  #film = null;
  #popupControls = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.topContainer = this.#element.querySelector('.film-details__top-container');
    renderElement(this.topContainer, new PopupInfoContainerView(this.#film));

    this.#popupControls = new PopupControlsView(this.#film.userDetails);
    renderElement(this.topContainer, this.#popupControls);

    this.bottomContainer = this.#element.querySelector('.film-details__bottom-container');
    renderElement(this.bottomContainer, new PopupCommentsContainerView(this.#film.comments));

    return this.#element;
  }

  get template() {
    return createPopupContainerTemplate();
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.#element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.#element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.#element.querySelector('.film-details__control-button--favorite')
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

  rerenderControls = (changeUserDetails) => {
    removeComponent(this.#popupControls);
    this.#popupControls = new PopupControlsView(changeUserDetails);
    renderElement(this.topContainer, this.#popupControls);
  }
}

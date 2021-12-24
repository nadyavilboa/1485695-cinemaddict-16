import { createElement, renderElement } from '../utils/render.js';

import PopupInfoContainerView from './popup-info-container-view.js';
import PopupControlsView from './popup-controls-view.js';
import PopupCommentsContainerView from './popup-comments-container-view.js';
import AbstractView from './abstract-view.js';
import PopupCloseButtonView from './popup-close-button-view.js';

const createPopupContainerTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container"></div>
      <div class="film-details__bottom-container"></div>
    </form>
  </section>`
);

export default class PopupContainerView extends AbstractView {
  #element = null;
  #film = null;

  #changeFilmCardWatchList = null;
  #changeFilmCardWatched = null;
  #changeFilmCardFavorite = null;

  constructor(film, changeFilmCardWatchList, changeFilmCardWatched, changeFilmCardFavorite) {
    super();
    this.#film = film;

    this.#changeFilmCardWatchList = changeFilmCardWatchList;
    this.#changeFilmCardWatched = changeFilmCardWatched;
    this.#changeFilmCardFavorite = changeFilmCardFavorite;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.topContainer = this.#element.querySelector('.film-details__top-container');

    this.popupCloseButton = new PopupCloseButtonView();
    renderElement(this.topContainer, this.popupCloseButton);

    renderElement(this.topContainer, new PopupInfoContainerView(this.#film));

    this.popupControls = new PopupControlsView(this.#film.userDetails, this.#changeFilmCardWatchList, this.#changeFilmCardWatched, this.#changeFilmCardFavorite);
    renderElement(this.topContainer, this.popupControls);

    this.bottomContainer = this.#element.querySelector('.film-details__bottom-container');
    renderElement(this.bottomContainer, new PopupCommentsContainerView(this.#film.comments));

    return this.#element;
  }

  get template() {
    return createPopupContainerTemplate();
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.#element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}

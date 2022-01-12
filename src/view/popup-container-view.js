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

  #updateFilmCard = null;
  #comments = null;

  #formSubmit = null;
  #deleteComment = null;

  constructor(film, updateFilmCard, comments, formSubmit, deleteComment) {
    super();
    this.#film = film;

    this.#updateFilmCard = updateFilmCard;
    this.#comments = comments;

    this.formSubmit = formSubmit;
    this.#deleteComment = deleteComment;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.topContainer = this.#element.querySelector('.film-details__top-container');
    this.bottomContainer = this.#element.querySelector('.film-details__bottom-container');

    this.popupControls = new PopupControlsView(
      this.#film.userDetails, this.#updateFilmCard);

    renderElement(this.topContainer, new PopupCloseButtonView());
    renderElement(this.topContainer, new PopupInfoContainerView(this.#film));
    renderElement(this.topContainer, this.popupControls);
    renderElement(this.bottomContainer,
      new PopupCommentsContainerView(this.#comments, this.#formSubmit, this.#deleteComment));

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

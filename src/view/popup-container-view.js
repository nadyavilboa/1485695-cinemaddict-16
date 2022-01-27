import { createElement, renderElement } from '../utils/render.js';
import PopupInfoContainerView from './popup-info-container-view.js';
import PopupControlsView from './popup-controls-view.js';
import PopupCommentsContainerView from './popup-comments-container-view.js';
import AbstractView from './abstract-view.js';
import PopupCloseButtonView from './popup-close-button-view.js';
import { submitKeys } from '../const.js';

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

  #formElement= null;
  #deleteComment = null;

  #keyArray = [];

  #scrollHeight = null;

  constructor(film, updateFilmCard, comments, deleteComment, scrollHeight) {
    super();
    this.#film = film;

    this.#updateFilmCard = updateFilmCard;
    this.#comments = comments;

    this.#deleteComment = deleteComment;

    this.#scrollHeight = scrollHeight;
  }

  get element() {

    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.#formElement = this.#element.querySelector('.film-details__inner');

    this.topContainer = this.#formElement.querySelector('.film-details__top-container');
    this.bottomContainer = this.#formElement.querySelector('.film-details__bottom-container');

    this.popupControls = new PopupControlsView(
      this.#film.userDetails, this.#updateFilmCard);

    renderElement(this.topContainer, new PopupCloseButtonView());
    renderElement(this.topContainer, new PopupInfoContainerView(this.#film));
    renderElement(this.topContainer, this.popupControls);
    renderElement(this.bottomContainer,
      new PopupCommentsContainerView(this.#comments, this.#deleteComment));

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

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.#runOnKeys(submitKeys, this._callback.formSubmit);
  }

  #runOnKeys = (keys, callback) => {
    document.addEventListener('keydown', (evt) => {
      if (evt.repeat) {
        return;
      }
      this.#keyArray = [...this.#keyArray, evt.key];
      return this.#keyArray;
    });

    document.addEventListener('keyup', () => {
      if (this.#keyArray.length === 0) {
        return;
      }

      let runFunc = true;

      keys.forEach((key) => {
        if (!this.#keyArray.includes(key)) {
          runFunc = false;
        }
      });

      if (runFunc) {
        const formData = new FormData(this.#formElement);
        const newComment = {
          comment: formData.get('comment-text'),
          emotion: formData.get('comment-emoji'),
        };
        callback(newComment);
      }

      this.#keyArray = [];
    });

  }


}

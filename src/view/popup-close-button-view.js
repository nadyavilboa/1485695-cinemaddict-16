import AbstractView from './abstract-view.js';

const createPopupCloseButtonTemplate = () => (
  `<button class="film-details__close-btn" type="button">
    close
  </button>`
);

export default class PopupCloseButtonView extends AbstractView {

  get template() {
    return createPopupCloseButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}

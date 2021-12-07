import { createElement } from '../render.js';

const createPopupCloseButtonTemplate = () => (
  `<button class="film-details__close-btn" type="button">
    close
  </button>`
);

export default class PopupCloseButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupCloseButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

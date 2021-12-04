import { createElement } from '../render.js';

const createPopupContainerTemplate = () => (
  `<div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
</div>`
);

export default class PopupContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

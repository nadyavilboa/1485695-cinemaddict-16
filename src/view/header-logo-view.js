import { createElement } from '../render.js';

const createHeaderLogoTemplate = () => (
  `<h1 class="header__logo logo">
    Cinemaddict
  </h1>`
);

export default class HeaderLogoView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createHeaderLogoTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

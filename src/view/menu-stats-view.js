import { createElement } from '../render.js';

const createMenuStatsTemplate = () => (
  `<a href="#stats" class="main-navigation__additional">
    Stats
  </a>`
);

export default class MenuStatsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuStatsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

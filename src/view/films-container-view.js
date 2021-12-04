import { createElement } from '../render.js';

const createFilmsContainerTemplate = (title, isExtra = true) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ''}">
      ${title}
    </h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsContainerView {
  #element = null;
  #title = null;
  #isExtra = true;

  constructor(title, isExtra) {
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsContainerTemplate(this.#title, this.#isExtra);
  }

  removeElement() {
    this.#element = null;
  }
}

import { createElement } from '../render.js';

const createFilmSectionTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmSectionView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmSectionTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

import { createElement } from '../render.js';

const createHeaderProfileTemplate = (rank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class HeaderProfileView {
  #element = null;
  #rank = null;

  constructor(rank) {
    this.#rank = rank;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createHeaderProfileTemplate(this.#rank);
  }

  removeElement() {
    this.#element = null;
  }
}

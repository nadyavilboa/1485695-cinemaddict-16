import { createElement } from '../render.js';

const createFooterStatisticsTemplate = (filmsCount) => (
  `<section class="footer__statistics">
    <p>
      ${filmsCount} movies inside
    </p>
  </section>`
);

export default class FooterStatisticsView {
  #element = null;
  #filmsCount = null;

  constructor(filmsCount) {
    this.#filmsCount = filmsCount;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmsCount);
  }

  removeElement() {
    this.#element = null;
  }
}

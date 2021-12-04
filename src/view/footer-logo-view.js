import { createElement } from '../render.js';

const createFooterLogoTemplate = () => (
  '<section class="footer__logo logo logo--smaller">Cinemaddict</section>'
);

export default class FooterLogoView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterLogoTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

import { createElement } from '../render.js';

const createPopupCommentsListTemplate = () => (
  '<ul class="film-details__comments-list"></ul>'
);

export default class PopupCommentsListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupCommentsListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

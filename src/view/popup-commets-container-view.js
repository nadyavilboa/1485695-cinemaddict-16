import { createElement } from '../render.js';

const createPopupCommentsContainerTemplate = (commentsCount) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments
        <span class="film-details__comments-count">${commentsCount}</span>
      </h3>
    </section>
</div>`
);

export default class PopupCommentsContainerView {
  #element = null;
  #commentsCount = null;

  constructor(commentsCount) {
    this.#commentsCount = commentsCount;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupCommentsContainerTemplate(this.#commentsCount);
  }

  removeElement() {
    this.#element = null;
  }
}

